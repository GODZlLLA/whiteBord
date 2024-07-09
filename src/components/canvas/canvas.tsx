// @ts-nocheck
import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
// https://www.npmjs.com/package/fabric?activeTab=readme キャンバスを簡単に操作できるフレームワーク 詳しい設定とかここを参照
import { fabric } from 'fabric';
// https://www.npmjs.com/package/react-colorful カラー調整出来るやつ
import { RgbaStringColorPicker } from 'react-colorful';
import { Accordion } from '../el-accordion/el-accordion';
import { onKeyDown } from './keydown-event';

// 各種コンポーネント
import Dropdown from './Dropdwon.tsx';

// functions
import { ontoolbar } from '../function/toolbar';
import { editMenu } from '../function/editMenu';
import { fileChange } from '../function/fileChange';
import { colorChange } from '../function/colorChange';

// import アイコン
import {
  ArrowIcon,
  CircleIcon,
  EraseIcon,
  ExportIcon,
  FlopIcon,
  HandIcon,
  ImageIcon,
  JsonIcon,
  LineIcon,
  PenIcon,
  RectIcon,
  UndoIcon,
  StickyIcon,
  TextIcon,
  TrashIcon,
  TriangleIcon,
  RedoIcon,
  GeometryIcon,
  CogIcon
} from '../icons/icon';

const WhiteboardContext = createContext(null);
const initState = {
  canvasOptions: { selectionLineWidth: 2, isDrawingMode: false },
};

const WhiteboardStore = (props) => {
  const [gstate, setGState] = useState(initState);

  return (
    <WhiteboardContext.Provider value={{ gstate, setGState }}>
      {props.children}
    </WhiteboardContext.Provider>
  )
}

// Canvasのinitializeメソッドを拡張して、履歴の初期化を追加
fabric.Canvas.prototype.initialize = (function (originalFn) {
  return function (...args) {
    originalFn.call(this, ...args);
    this._historyInit();
    return this;
  };
})(fabric.Canvas.prototype.initialize);

// Canvasのdisposeメソッドを拡張して、履歴の破棄を追加
fabric.Canvas.prototype.dispose = (function (originalFn) {
  return function (...args) {
    originalFn.call(this, ...args);
    this._historyDispose();
    return this;
  };
})(fabric.Canvas.prototype.dispose);

// 現在のCanvasの状態をJSON文字列として取得
fabric.Canvas.prototype._historyNext = function (): string {
  return JSON.stringify(this.toDatalessJSON(this.extraProps));
};

// 履歴に関連するイベントを定義
fabric.Canvas.prototype._historyEvents = function (): Record<string, (e: fabric.IEvent) => void> {
  return {
    'object:added': this._historySaveAction,
    'object:removed': this._historySaveAction,
    'object:modified': this._historySaveAction,
    'object:skewing': this._historySaveAction
  }
};

// 履歴の初期化
fabric.Canvas.prototype._historyInit = function (): void {
  this.historyUndo = [];
  this.historyRedo = [];
  this.extraProps = ['selectable'];
  this.historyNextState = this._historyNext();

  this.on(this._historyEvents());
};

// 履歴の破棄
fabric.Canvas.prototype._historyDispose = function (): void {
  this.off(this._historyEvents());
};

// 履歴にアクションを保存
fabric.Canvas.prototype._historySaveAction = function (): void {
  if (this.historyProcessing) return;

  const json = this.historyNextState;
  this.historyUndo.push(json);
  this.historyNextState = this._historyNext();
  this.fire('history:append', { json: json });
};

// Undo操作
fabric.Canvas.prototype.undo = function (callback?: () => void): void {
  this.historyProcessing = true;
  const history = this.historyUndo.pop();

  if (history) {
    this.historyRedo.push(this._historyNext());
    this.historyNextState = history;
    this._loadHistory(history, 'history:undo', callback);
  } else {
    this.historyProcessing = false;
  }
};

// Redo操作
fabric.Canvas.prototype.redo = function (callback?: () => void): void {
  this.historyProcessing = true;
  const history = this.historyRedo.pop();

  if (history) {
    this.historyUndo.push(this._historyNext());
    this.historyNextState = history;
    this._loadHistory(history, 'history:redo', callback);
  } else {
    this.historyProcessing = false;
  }
};

// 履歴をロード
fabric.Canvas.prototype._loadHistory = function (history: string, event: string, callback?: () => void): void {
  var that = this;

  this.loadFromJSON(history, function () {
    that.setBackgroundColor("#fff");
    that.renderAll();
    that.fire(event);
    that.historyProcessing = false;

    if (callback && typeof callback === 'function') callback();
  });
};

// 履歴をクリア
fabric.Canvas.prototype.clearHistory = function (): void {
  this.historyUndo = [];
  this.historyRedo = [];
  this.fire('history:clear');
};


const bottomMenu = [
  { title: 'Erase', icon: React.createElement(EraseIcon, null) },
  { title: 'Undo', icon: React.createElement(UndoIcon, null) },
  { title: 'Redo', icon: React.createElement(RedoIcon, null) },
  { title: 'Save', icon: React.createElement(FlopIcon, null) },
  { title: 'Export', icon: React.createElement(ExportIcon, null) },
  { title: 'ToJson', icon: React.createElement(JsonIcon, null) },
  { title: 'Clear', icon: React.createElement(TrashIcon, null) }
];

const toolbar = [
  { title: 'Select', icon: React.createElement(HandIcon, null) },
  { title: 'Draw', icon: React.createElement(PenIcon, null) },
  { title: 'Text', icon: React.createElement(TextIcon, null) },
  { title: 'Sticky', icon: React.createElement(StickyIcon, null) },
  { title: 'Arrow', icon: React.createElement(ArrowIcon, null) },
  { title: 'Line', icon: React.createElement(LineIcon, null) }
];


let currentCanvas = null;
function CanvasEditor({ onChange, options }) {
  const parentRef = useRef();
  const canvasRef = useRef();
  const inputImageFileRef = useRef();
  const inputJsonFileRef = useRef();
  const zoomRef = useRef(null);
  const { gstate, setGState } = useContext(WhiteboardContext);
  const { canvasOptions } = gstate;
  const [editor, setEditor] = useState();
  const [objOptions, setObjOptions] = useState(Object.assign({ stroke: '#000000', fontSize: 40, fill: 'rgba(255, 255, 255, 0.0)', strokeWidth: 5 }, options));
  const [colorProp, setColorProp] = useState('background');
  const [showObjOptions, setShowObjOptions] = useState(false);
  const canvasModifiedCallback = () => {
    if (currentCanvas) {
      onChange(currentCanvas.toDatalessJSON());
    }
  };

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef === null || canvasRef === void 0 ? void 0 : canvasRef.current, canvasOptions);
    currentCanvas = canvas;
    setEditor(canvas);
    const Keydown = (e) => onKeyDown({ e, canvas, inputImageFileRef });

    if (parentRef && parentRef.current && canvas) {
      const data = localStorage.getItem('whiteboard-cache');
      if (data)
        canvas.loadFromJSON(JSON.parse(data), canvas.renderAll.bind(canvas));
      if (onChange) {
        canvas.on('object:added', canvasModifiedCallback);
        canvas.on('object:removed', canvasModifiedCallback);
        canvas.on('object:modified', canvasModifiedCallback);
      }

      canvas.setHeight(parentRef.current.clientHeight);
      canvas.setWidth(parentRef.current.clientWidth);
      canvas.setBackgroundColor("#fff");
      canvas.renderAll();
      document.addEventListener('keydown', Keydown, false);

      const mousewheel = (e) => {
        //ポインタの位置取得
        const mouseX = e.pointer.x;
        const mouseY = e.pointer.y;
        //ホイール回転の取得
        const deltaY = e.e.wheelDeltaY;
        //現在の拡大倍率の取得
        let zoom = canvas.getZoom();
        //マウス位置を原点として拡大縮小
        canvas.zoomToPoint(new fabric.Point(mouseX, mouseY), zoom + deltaY / 1200);
      }

      canvas.on('mouse:wheel', (e) => mousewheel(e));
    }

    return () => {
      canvas.off('object:added', canvasModifiedCallback);
      canvas.off('object:removed', canvasModifiedCallback);
      canvas.off('object:modified', canvasModifiedCallback);
      document.removeEventListener('keydown', Keydown, false);
      canvas.dispose();
    };
  }, []);

  // ツールバー
  const onToolbar = (objName: string) => {
    ontoolbar(objName, editor, objOptions);
  }

  // 各種編集メンバーの設定
  const onEditMenu = (actionName: string) => {
    editMenu(actionName, editor, showObjOptions, setShowObjOptions)
  };

  // http://fabricjs.com/docs/fabric.Image.html 設定とかここ
  const onFileChange = (e) => {
    fileChange(e, editor)
  }

  const onRadioColor = (e) => {
    setColorProp(e.target.value);
  }

  const onColorChange = (value) => {
    colorChange(value, editor, colorProp, objOptions, setObjOptions)
  };

  const onOptionsChange = (e) => {
    let val = e.target.value;
    const name = e.target.name;
    const activeObj = editor.getActiveObject();
    if (editor.isDrawingMode && name === 'strokeWidth') {
      editor.freeDrawingBrush.width = Number(val);
      localStorage.setItem('freeDrawingBrush.width', Number(val));
    }
    if (activeObj) {
      val = isNaN(val) ? val : +val;
      activeObj.set(name, val);
      const ops = Object.assign(Object.assign({}, objOptions), { [name]: val });
      setObjOptions(ops);
      editor.renderAll();
    }
  };

  const onZoom = (e) => {
    editor.zoomToPoint(new fabric.Point(editor.width / 2, editor.height / 2), +e.target.value);
    const units = 10;
    const delta = new fabric.Point(units, 0);
    editor.relativePan(delta);
    e.preventDefault();
    e.stopPropagation();
  };

  const onLoadImage = () => inputImageFileRef.current.click();

  const onLoadFromJson = () => inputJsonFileRef.current.click();

  // 拡大率をもとに戻す
  const onZoomResetCanvas = (e) => {
    e.preventDefault();
    zoomRef.current.value = "1";
    editor.setZoom(1);
    editor.absolutePan(new fabric.Point(0, 0));
  }

  return (
    <div className='whiteboard' ref={parentRef}>
      <div className='inner'>
        <div className='el-side-controller'>
          {<div className='el-mapping'>
            <div className='el-mapping__list'>
              {toolbar.map(item =>
                <button className='el-mapping__item' key={item.title} onClick={() => { onToolbar(item.title); }} title={item.title}>
                  {item.icon}
                </button>
              )}
              <Dropdown title={<GeometryIcon />}>
                <button className='el-mapping__dropdown' onClick={() => { onToolbar('Circle'); }} title="Add Circle">
                  <CircleIcon />
                </button>
                <button className='el-mapping__dropdown' onClick={() => { onToolbar('Rect'); }} title="Add Rectangle">
                  <RectIcon />
                </button>
                <button className='el-mapping__dropdown' onClick={() => { onToolbar('Triangle'); }} title="Add Triangle">
                  <TriangleIcon />
                </button>
              </Dropdown>
              <button className='el-mapping__item' onClick={() => { onLoadImage(); }} title="Load Image">
                <ImageIcon />
              </button>
              <button className='el-mapping__item' onClick={() => { onLoadFromJson(); }} title="Load From Json">
                <JsonIcon />
              </button>
            </div>
          </div>}
          {<div className='el-edit'>
            <div className='el-edit__list'>
              {bottomMenu.map(item =>
                <button className='el-edit__item' key={item.title} onClick={() => { onEditMenu(item.title); }} title={item.title}>
                  {item.icon}
                </button>
              )}
            </div>

            <input ref={inputImageFileRef} type="file" name='image' onChange={onFileChange} accept="image/svg+xml, image/gif, image/jpeg, image/png" hidden={true} />
            <input ref={inputJsonFileRef} type="file" name='json' onChange={onFileChange} accept="application/json" hidden={true} />
          </div>}
        </div>
        <div className='el-main-container'>
          <canvas id="concat" width="800" height="800" />
          <canvas className='canvas' ref={canvasRef} />
        </div>
        <div className='el-right-controller'>
          <Accordion title={'詳細設定'} icon={React.createElement(CogIcon, null)}>
            <div className='el-any-setting'>
              <div className='el-any-setting__item'>
                <label>文字サイズ</label>
                <input type="number" min="1" name='fontSize' onChange={onOptionsChange} defaultValue="40" />
              </div>
              <div className='el-any-setting__item'>
                <label>枠線</label>
                <input type="number" min="1" name='strokeWidth' onChange={onOptionsChange} defaultValue="3" />
              </div>
              <div className='el-any-setting__item--fill'>
                <div className='el-any-setting__item--colors'>
                  <label htmlFor='backgroundColor'>背景</label>
                  <input type="radio" onChange={onRadioColor} name="setting" defaultValue="backgroundColor" />
                </div>
                <div className='el-any-setting__item--colors'>
                  <label htmlFor='stroke'>枠線</label>
                  <input type="radio" onChange={onRadioColor} name="setting" defaultValue="stroke" />
                </div>
                <div className='el-any-setting__item--colors'>
                  <label htmlFor='fill'>塗りつぶし</label>
                  <input type="radio" onChange={onRadioColor} name="setting" defaultValue="fill" />
                </div>
                <RgbaStringColorPicker onChange={onColorChange} />
              </div>
            </div>
          </Accordion>
          <div className='el-sizing'>
            <div className='el-zoom'>
              <span>拡大・縮小</span>
              <select onChange={onZoom} defaultValue="1" data-description="" ref={zoomRef}>
                <option value="2">200%</option>
                <option value="1.5">150%</option>
                <option value="1">100%</option>
                <option value="0.75">75%</option>
                <option value="0.5">50%</option>
                <option value="0.25">25%</option>
              </select>
            </div>
            <div className='el-reset-position'>
              <button onClick={(e) => onZoomResetCanvas(e)}>
                <span>座標をリセット</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Whiteboard = (props) => {
  return <WhiteboardStore>
    <CanvasEditor>
      {props}
    </CanvasEditor>
  </WhiteboardStore>
}

export { Whiteboard };

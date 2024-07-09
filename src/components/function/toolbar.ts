// 各種設定import
import textBox from '../icons/textbox';
import circle from '../icons/circle';
import rect from '../icons/rect';
import Triangle from '../icons/triangle';
import Arrow from '../icons/arrow';
import lines from '../icons/line';
import sticky from '../icons/sticky';
import { Canvas } from 'fabric/fabric-impl';

// ツールバーの関数
export function ontoolbar(objName: string, editor: Canvas, objOptions: {}) {
  let objType: any;
  switch (objName) {
    case 'Select':
      editor.isDrawingMode = false;
      editor.discardActiveObject().renderAll();
      break;
    case 'Draw':
      if (editor) {
        editor.isDrawingMode = true;
        editor.freeDrawingBrush.width = Number(localStorage.getItem('freeDrawingBrush.width')) || 5;
        editor.freeDrawingBrush.color = localStorage.getItem('freeDrawingBrush.color') || '#000000';
      }
      break;
    case 'Text':
      editor.isDrawingMode = false;
      objType = textBox(objOptions);
      break;
    case 'Circle':
      editor.isDrawingMode = false;
      objType = circle(objOptions);
      break;
    case 'Rect':
      editor.isDrawingMode = false;
      objType = rect(objOptions);
      break;
    case 'Triangle':
      editor.isDrawingMode = false;
      objType = Triangle(objOptions);
      break;
    case 'Arrow':
      editor.isDrawingMode = false;
      objType = Arrow(objOptions);
      break;
    case 'Line':
      editor.isDrawingMode = false;
      objType = lines(objOptions);
      break;
    case 'Sticky':
      objType = sticky(objOptions);
      break;
  }

  if (objName !== 'Draw' && objName !== 'Select') {
    editor.add(objType);
    editor.centerObject(objType);
  }
  editor.renderAll();
}
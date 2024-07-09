import { fabric } from 'fabric';

interface FileChangeEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

interface Editor {
  loadFromJSON: (json: any) => void;
  centerObject: (obj: fabric.Object) => void;
  add: (obj: fabric.Object) => void;
}

export function fileChange(e: FileChangeEvent, editor: Editor) {
  if (e.target.files.length < 1) return;
  const inputFileName = e.target.name;
  const file = e.target.files[0];
  const fileType = file.type;
  const url = URL.createObjectURL(file);

  // jsonインポート
  if (inputFileName === 'json') {
    fetch(url).then(r => r.json())
      .then(json => {
        editor.loadFromJSON(json);
      });
  } else {
    // pngとかjpgの設定
    if (fileType === 'image/png' || fileType === 'image/jpeg') {
      fabric.Image.fromURL(url, function (img) {
        // 画像サイズや比率を固定したまま初期に300px表示
        img.scaleToWidth(300);
        editor.centerObject(img);
        editor.add(img);
      });
    }

    // svg設定
    if (fileType === 'image/svg+xml') {
      fabric.loadSVGFromURL(url, function (objects, options) {
        const svg = fabric.util.groupSVGElements(objects, options);
        svg.scaleToWidth(180);
        svg.scaleToHeight(180);
        editor.centerObject(svg);
        editor.add(svg);
      });
    }
  };
}
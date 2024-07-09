import { Canvas } from "fabric/fabric-impl";

export function colorChange(value: string, editor: Canvas, colorProp: any, objOptions: {}, setObjOptions: Function) {
  const activeObj = editor.getActiveObject();

  if (editor.isDrawingMode) {
    editor.freeDrawingBrush.color = value;
    localStorage.setItem('freeDrawingBrush.color', value);
  }

  if (activeObj) {
    activeObj.set(colorProp, value);
    const ops = Object.assign(Object.assign({}, objOptions), { [colorProp]: value, });
    setObjOptions(ops);
    editor.renderAll();
  } else {
    if (colorProp === 'backgroundColor') {
      editor.backgroundColor = value;
      editor.renderAll();
    }
  }
}
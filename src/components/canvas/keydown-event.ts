import { fabric } from 'fabric';

interface Props {
  e: {
    code: string;
    keyCode: number;
    which: number;
    ctrlKey: any;
    metaKey: any;
    preventDefault: () => void;
  },
  canvas: {
    getActiveObject: () => any;
    remove: (arg0: any) => void;
    add: (arg0: any) => void;
    toDatalessJSON: () => any;
    undo: () => void;
    redo: () => void;
  },
  input: {
    current: { 
      click: () => void;
    }
  }
}

// キーボード操作
export const onKeyDown = ({e, canvas, input}: Props)  => {
  if (!canvas) return;
  if (e.code === 'Delete' || e.keyCode === 46 || e.which === 46) {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  }

  if ((e.ctrlKey || e.metaKey) && (e.keyCode === 67 || e.which === 67)) {
    const object = fabric.util.object.clone(canvas.getActiveObject());
    object.set("top", object.top + 5);
    object.set("left", object.left + 5);
    canvas.add(object);
  }

  if ((e.ctrlKey || e.metaKey) && (e.keyCode === 83 || e.which === 83)) {
    e.preventDefault();
    localStorage.setItem('whiteboard-cache', JSON.stringify(canvas.toDatalessJSON()));
  }

  if ((e.ctrlKey || e.metaKey) && (e.keyCode === 79 || e.which === 79)) {
    e.preventDefault();
    input.current.click();
  }

  if ((e.ctrlKey || e.metaKey) && (e.keyCode === 90 || e.which === 90)) {
    e.preventDefault();
    // @ts-ignore: Unreachable code error
    canvas.undo();
  }

  if ((e.ctrlKey || e.metaKey) && (e.keyCode === 89 || e.which === 89)) {
    e.preventDefault();
    // @ts-ignore: Unreachable code error
    canvas.redo();
  }
}
// 各種設定import
import Export from './canvas-downloader';

interface Editor {
  toDatalessJSON: () => object;
  getActiveObject: () => any;
  remove: (object: any) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  clear: () => void;
  backgroundColor: string;
  renderAll: () => void;
}

// 画像保存等の機能
export function editMenu(actionName: string, editor: Editor, showObjOptions: boolean, setShowObjOptions: Function) {
  switch (actionName) {
    case 'Show Object Options':
      setShowObjOptions(!showObjOptions);
      break;
    case 'Export':
      Export();
    case 'Save':
      localStorage.setItem('whiteboard-cache', JSON.stringify(editor.toDatalessJSON()));
      break;
    case 'Erase':
      const activeObject = editor.getActiveObject();
      if (activeObject) {
        editor.remove(activeObject);
      }
      break;
    case 'ToJson':
      const content = JSON.stringify(editor.toDatalessJSON());
      const link = document.createElement("a");
      const file = new Blob([content], { type: 'application/json' });
      link.setAttribute('download', 'whiteboard.json');
      link.href = URL.createObjectURL(file);
      document.body.appendChild(link);
      link.click();
      link.remove();
      break;
    case 'Undo':
      editor.undo();
      break;
    case 'Redo':
      editor.redo();
      break;
    case 'Clear':
      const message = '書き込んだ内容をすべて削除しますか？';
      if (confirm(message)) {
        localStorage.removeItem('whiteboard-cache');
        editor.clearHistory();
        editor.clear();
        editor.backgroundColor = '#fff';
        editor.renderAll();
      }
      break;
  }
}
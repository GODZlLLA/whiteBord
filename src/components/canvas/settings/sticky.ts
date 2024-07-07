import { fabric } from 'fabric';
/**
 * textboxの設定
*/
export default (objOptions: any) => {
  return new fabric.Textbox('フリーテキスト',
  Object.assign(Object.assign({}, objOptions), {
    backgroundColor: '#8bc34a',
    fill: '#fff',
    width: 150,
    textAlign: 'left',
    splitByGrapheme: true,
    height: 150,
    padding: 20
  }))
}
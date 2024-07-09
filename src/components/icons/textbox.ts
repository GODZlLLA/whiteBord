import { fabric } from 'fabric';
/**
 * textboxの設定
*/
export default (objOptions: any) => {
  return new fabric.Textbox('フリーテキスト', {
    fontSize: objOptions.fontSize,
    width: 300,
    height: 200,
    fill: '#f00',
  })
}
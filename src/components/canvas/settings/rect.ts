import { fabric } from 'fabric';
/**
 * textboxの設定
*/
export default (objOptions: any) => {
  return new fabric.Rect(Object.assign(Object.assign({}, objOptions), {
    width: 100,
    height: 100
  }))
}
import { fabric } from 'fabric';
/**
 * textboxの設定
*/
export default (objOptions: any) => {
  return new fabric.Circle(Object.assign(Object.assign({}, objOptions), {
    radius: 70
  }))
}
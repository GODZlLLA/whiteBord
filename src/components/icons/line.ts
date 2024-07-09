import { fabric } from 'fabric';
/**
 * textboxの設定
*/
export default (objOptions: any) => {
  return new fabric.Line([50, 10, 200, 150],
    Object.assign(Object.assign({}, objOptions), {
      angle: 47
    }
  ))
}
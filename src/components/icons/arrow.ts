import { fabric } from 'fabric';
const size = 2;
const points = [
  { x: 0 * size, y: 100 * size },
  { x: 90 * size, y: 100 * size },
  { x: 90 * size, y: 90 * size },
  { x: 130 * size, y: 105 * size },
  { x: 90 * size, y: 120 * size},
  { x: 90 * size, y:110 * size },
  { x: 0 * size, y: 110 * size },
]

export default (objOptions: any) => {
  return new fabric.Polygon(points, Object.assign(Object.assign({}, objOptions), {
    fill: '#000',
    strokeWidth: 0, 
  }));
}
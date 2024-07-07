/**
 * Canvas合成
 *
 * @param {string} base 合成結果を描画するcanvas(id)
 * @param {array} asset 合成する素材canvas(id)
 * @return {void}
 */
const concatCanvas = async (base: string, asset: string | any[]) => {
  const canvas = document.querySelector(base) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  for(let i = 0; i < asset.length; i++) {
    const image1: any = await getImageFromCanvas(asset[i]);
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  }

  imageDownLoader();
}

/**
 * Canvasを画像として取得
 *
 * @param {string} id  対象canvasのid
 * @return {object}
 */
function getImageFromCanvas(id: string): object {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const canvas = document.querySelector(id) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    image.onload = () => resolve(image);
    image.onerror = (e) => reject(e);
    image.crossOrigin = 'anonymous';
    image.src = ctx.canvas.toDataURL();
  });
}

// キャンバスの内容をデータ化して画像として保存
function imageDownLoader() {
  let blob;
  const canvas = document.querySelector('#concat') as HTMLCanvasElement;
  const link = document.createElement('a');
  blob = canvas.toDataURL('image/jpeg');
  console.log(blob)
  link.href = blob;
  link.download = 'output.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  eraseCanvas('#concat');
}

/**
 * Canvasをすべて削除する
 *
 * @param {string} target 対象canvasのid
 * @return {void}
 */
function eraseCanvas(target: string): void {
  const canvas = document.querySelector(target) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// iframeで画像を表示
function debugBase64(base64URL: string) {
  var win = window.open();
  win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}

export default () => concatCanvas('#concat', ['.upper-canvas', '.lower-canvas']);
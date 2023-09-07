import * as pdfjs from 'pdfjs-dist';
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker?worker';

pdfjs.GlobalWorkerOptions.workerPort = new PdfjsWorker();

onmessage = async ({ data }) => {
  const pdfList = data;

  const canvas = new OffscreenCanvas(1, 1);
  const context = canvas.getContext('2d');

  for (let i = 0; i < pdfList.length; i++) {
    const pdf = pdfList[i];
    console.log(i, pdf.name);

    const doc = await pdfjs.getDocument({
      data: await pdf.arrayBuffer(),
      ownerDocument: {
        fonts: self.fonts,
        createElement: (name) => {
          if (name == 'canvas') {
            return new OffscreenCanvas(1, 1);
          }
  
          return null;
        }
      }
    }).promise;
  
    const page = await doc.getPage(1);
  
    let scale = 1;
    let viewport = page.getViewport({scale: scale});

    canvas.width = 244/* viewport.width */;
    canvas.height = 288/* viewport.height */;
    scale = Math.max(canvas.width / viewport.width, canvas.height / viewport.height);

    viewport = viewport.clone({scale: scale});

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  
    const blob = await canvas.convertToBlob();
    await doc.destroy();

    const fileReader = new FileReader();
    fileReader.onload = () => {
      postMessage(fileReader.result);
    };
    fileReader.readAsDataURL(blob);
  }
}
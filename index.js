const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const officegen = require('officegen');
const Word2Pdf = require('word2pdf');
const docx = officegen('docx');

function createSignatureModal() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Signature Modal</title>
        <style>
          #signatureModal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
          }

          #signatureCanvas {
            width: 300px;
            height: 200px;
            border: 1px solid #ccc;
          }

          #signatureButtons {
            text-align: center;
          }

          #clearButton {
            margin-right: 10px;
          }
        </style>
      </head>
      <body>
        <div id="signatureModal">
          <canvas id="signatureCanvas"></canvas>
          <div id="signatureButtons">
            <button id="clearButton">Clear</button>
            <button id="saveButton">Save</button>
          </div>
        </div>

        <script>
          const signatureCanvas = document.getElementById('signatureCanvas');
          const signatureContext = signatureCanvas.getContext('2d');
          let signatureData = '';

          const clearSignature = () => {
            signatureContext.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
            signatureData = '';
          };

          const saveSignature = () => {
            const image = signatureCanvas.toDataURL('image/png');
            const base64Data = image.replace(/^data:image\/(png|jpg);base64,/, '');
            console.log('Base64 Image Data:', base64Data);
            localStorage.setItem('key', base64Data);
          };

          document.getElementById('clearButton').addEventListener('click', clearSignature);
          document.getElementById('saveButton').addEventListener('click', saveSignature);

          signatureCanvas.addEventListener('mousedown', (event) => {
            signatureContext.beginPath();
            signatureContext.moveTo(event.offsetX, event.offsetY);
          });

          signatureCanvas.addEventListener('mousemove', (event) => {
            if (event.buttons === 1) {
              signatureContext.lineTo(event.offsetX, event.offsetY);
              signatureContext.stroke();
            }
          });

          signatureCanvas.addEventListener('mouseup', () => {
            signatureContext.stroke();
          });

          signatureCanvas.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            signatureContext.beginPath();
            signatureContext.moveTo(touch.offsetX, touch.offsetY);
          });

          signatureCanvas.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            signatureContext.lineTo(touch.offsetX, touch.offsetY);
            signatureContext.stroke();
          });

          signatureCanvas.addEventListener('touchend', () => {
            signatureContext.stroke();
          });
        </script>
      </body>
    </html>
  `;

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const modal = document.getElementById('signatureModal');
  modal.style.display = 'block';
}

function addImageToWordDocument(filePath) {
  const base64Image = localStorage.getItem('key');
  const contentControls = docx.contentControls();
  const signatureContentControl = contentControls.getByTitle('Signature');

  if (signatureContentControl) {
    const pObj = signatureContentControl.addImage(Buffer.from(base64Image, 'base64'), { cx: 300, cy: 200 });
    pObj.addLineBreak();
  }

  const stream = fs.createWriteStream(filePath);
  docx.generate(stream);
}

function convertWordToPDF(docxFilePath, pdfFilePath) {
  const stream = fs.createWriteStream(pdfFilePath);
  const content = fs.readFileSync(docxFilePath, 'binary');
  docx.load(content);
  Word2Pdf(docx, stream);
}

module.exports = {
  createSignatureModal,
  addImageToWordDocument,
  convertWordToPDF
};

// ocr.ts
import vision from '@google-cloud/vision';
import fs from 'fs';
import dotenv from 'dotenv';

// .envファイルの読み込み
dotenv.config();

// 認証
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.CREDENTIALE_PATH, // さっきDLしたキー
});

// OCR対象のPDFファイル
const fileName = './receipt.pdf';

async function runOCR() {
  const input = {
    inputConfig: {
      mimeType: 'application/pdf',
      content: fs.readFileSync(fileName).toString('base64'),
    },
    features: [{ type: "TEXT_DETECTION" as const }],
  };

  const request = {
    requests: [input],
  };

  const [result] = await client.batchAnnotateFiles(request);
  const responses = result?.responses?.[0]?.responses || [];

  for (const page of responses) {
    console.log('OCR結果：');
    console.log(page.fullTextAnnotation?.text || '(テキストなし)');
  }
}

runOCR();

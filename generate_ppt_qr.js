import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const url = 'https://metrologylens-ai.vercel.app'; // Default Vercel live URL

async function generate() {
  const publicPath = path.resolve('public', 'metrologylens_ppt_qr.png');
  const artifactPath = 'C:\\Users\\moham\\.gemini\\antigravity\\brain\\f7fca268-911f-493d-b07f-dfb9eb8d7c96\\metrologylens_ppt_qr.png';

  await QRCode.toFile(publicPath, url, {
    width: 600,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });

  try {
    fs.copyFileSync(publicPath, artifactPath);
  } catch (e) {
    console.log('Artifact path copy note:', e.message);
  }

  console.log('Successfully generated PPT QR Code image at:', publicPath);
}

generate();

import { createWorker } from 'tesseract.js';

export interface OCRRawLine {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface TesseractOCRResult {
  fullText: string;
  lines: OCRRawLine[];
  averageConfidence: number;
  tokensCount: number;
  processingTimeMs: number;
}

let workerInstance: any = null;
let isInitializingWorker = false;
let workerInitPromise: Promise<any> | null = null;

/**
 * Pre-warms the Tesseract worker singleton in the background.
 */
export async function prewarmTesseractWorker(): Promise<void> {
  if (workerInstance || isInitializingWorker) return;
  try {
    isInitializingWorker = true;
    workerInitPromise = createWorker('eng', 1);
    workerInstance = await workerInitPromise;
  } catch (err) {
    console.warn('[MetrologyLens] Tesseract prewarm note:', err);
  } finally {
    isInitializingWorker = false;
  }
}

async function getTesseractWorker(onProgress?: (percent: number, status: string) => void) {
  if (workerInstance) return workerInstance;
  if (workerInitPromise) {
    workerInstance = await workerInitPromise;
    return workerInstance;
  }

  try {
    const worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(Math.round((m.progress || 0) * 100), 'Recognizing packaging characters...');
        }
      }
    });
    workerInstance = worker;
    return worker;
  } catch (err) {
    console.warn('[MetrologyLens] Initializing standard Tesseract worker:', err);
    const worker = await createWorker('eng');
    workerInstance = worker;
    return worker;
  }
}

/**
 * Rapidly scales high-resolution camera images down to an optimal size (max 1280px)
 * for 5x to 10x faster OCR recognition without sacrificing text legibility.
 */
async function optimizeImageForSpeed(imageDataUrl: string): Promise<string> {
  if (typeof window === 'undefined' || !imageDataUrl || !imageDataUrl.startsWith('data:image')) {
    return imageDataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;
        const maxDim = 1280;

        if (origW <= maxDim && origH <= maxDim) {
          resolve(imageDataUrl);
          return;
        }

        let targetW = origW;
        let targetH = origH;
        if (origW >= origH) {
          targetW = maxDim;
          targetH = Math.round((origH / origW) * maxDim);
        } else {
          targetH = maxDim;
          targetW = Math.round((origW / origH) * maxDim);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(imageDataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, targetW, targetH);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      } catch {
        resolve(imageDataUrl);
      }
    };
    img.onerror = () => resolve(imageDataUrl);
    img.src = imageDataUrl;
  });
}

/**
 * Executes browser-native Optical Character Recognition using optimized Tesseract.js
 */
export async function runTesseractOCR(
  imageSource: string,
  onProgress?: (percent: number, status: string) => void
): Promise<TesseractOCRResult> {
  const startTime = Date.now();

  const ocrExecution = async (): Promise<TesseractOCRResult> => {
    try {
      // Step 1: Scale image for maximum speed
      const optimizedImage = await optimizeImageForSpeed(imageSource);

      // Step 2: Get or initialize worker
      const worker = await getTesseractWorker(onProgress);

      // Step 3: Run recognition
      const result = await worker.recognize(optimizedImage);
      const data = result.data;

      const lines: OCRRawLine[] = [];
      if (data.lines && data.lines.length > 0) {
        data.lines.forEach((line: any) => {
          const text = (line.text || '').trim();
          if (text.length > 0) {
            lines.push({
              text,
              confidence: line.confidence || 75,
              bbox: {
                x0: line.bbox?.x0 || 0,
                y0: line.bbox?.y0 || 0,
                x1: line.bbox?.x1 || 100,
                y1: line.bbox?.y1 || 30,
              }
            });
          }
        });
      }

      const fullText = (data.text || '').trim();
      const tokensCount = data.words ? data.words.length : fullText.split(/\s+/).filter(Boolean).length;
      const averageConfidence = Math.round(data.confidence || 80);
      const processingTimeMs = Date.now() - startTime;

      return {
        fullText,
        lines,
        averageConfidence,
        tokensCount,
        processingTimeMs
      };
    } catch (err) {
      console.warn('[MetrologyLens] Tesseract recognition note:', err);
      return {
        fullText: '',
        lines: [],
        averageConfidence: 0,
        tokensCount: 0,
        processingTimeMs: Date.now() - startTime
      };
    }
  };

  // 5-second safety race so optical engine never hangs UI on mobile CDN delays
  const timeoutPromise = new Promise<TesseractOCRResult>((resolve) => {
    setTimeout(() => {
      resolve({
        fullText: '',
        lines: [],
        averageConfidence: 0,
        tokensCount: 0,
        processingTimeMs: Date.now() - startTime
      });
    }, 5500);
  });

  return Promise.race([ocrExecution(), timeoutPromise]);
}

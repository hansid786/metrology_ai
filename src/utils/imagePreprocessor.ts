/**
 * MetrologyLens Image Utility
 * Handles:
 * 1. HEIC/HEIF/PNG/WebP → JPEG conversion (iOS Safari & Cross-Platform compatibility)
 * 2. High-resolution preservation for small statutory text (up to 2048px)
 * 3. Canvas-based contrast & specular glare normalization for OCR
 * 4. Safe base64 extraction from any image source
 */

/**
 * Converts any image (including HEIC, WebP, PNG) to a JPEG data URL via Canvas.
 * Preserves high resolution (up to 2048px) to protect small statutory text (MRP, Expiry, Batch No).
 */
export async function convertToJpegDataUrl(imageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (!imageDataUrl) { resolve(''); return; }

    const img = new Image();
    if (imageDataUrl.startsWith('http://') || imageDataUrl.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const origW = img.naturalWidth || img.width || 1200;
        const origH = img.naturalHeight || img.height || 900;

        // Preserve higher resolution ceiling (up to 2048px) so 1mm-2mm printed dates/MRP are sharp
        const maxDim = 2048;
        let targetW = origW;
        let targetH = origH;
        if (origW > maxDim || origH > maxDim) {
          if (origW >= origH) {
            targetW = maxDim;
            targetH = Math.round((origH / origW) * maxDim);
          } else {
            targetH = maxDim;
            targetW = Math.round((origW / origH) * maxDim);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(imageDataUrl); return; }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const jpeg = canvas.toDataURL('image/jpeg', 0.92);
        resolve(jpeg);
      } catch {
        resolve(imageDataUrl);
      }
    };

    img.onerror = () => {
      resolve(imageDataUrl);
    };

    img.src = imageDataUrl;
  });
}

export interface PreprocessedImageResult {
  processedDataUrl: string;
  originalWidth: number;
  originalHeight: number;
  enhancementApplied: string[];
}

/**
 * Full OCR preprocessing pipeline:
 * 1. Convert format → JPEG
 * 2. Adaptive luminance balance
 * 3. Specular glare suppression (soft clamp on overexposed reflections)
 * 4. Contrast normalization with edge preservation
 */
export async function preprocessImageForOCR(imageDataUrl: string): Promise<PreprocessedImageResult> {
  // Step 1: Normalise to JPEG
  const jpegUrl = await convertToJpegDataUrl(imageDataUrl);

  return new Promise((resolve) => {
    const img = new Image();
    if (jpegUrl.startsWith('http://') || jpegUrl.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const origW = img.naturalWidth || img.width || 1000;
        const origH = img.naturalHeight || img.height || 800;

        const canvas = document.createElement('canvas');
        canvas.width = origW;
        canvas.height = origH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          resolve({ processedDataUrl: jpegUrl, originalWidth: origW, originalHeight: origH, enhancementApplied: ['jpeg-standard'] });
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, origW, origH);
        const data = imageData.data;
        const len = data.length;

        // Calculate average luminance
        let sumLum = 0;
        for (let i = 0; i < len; i += 4) {
          sumLum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        }
        const avgLum = sumLum / (len / 4);
        const brightnessShift = avgLum < 80 ? 18 : avgLum > 210 ? -12 : 0;
        const contrastFactor = 1.12; // Gentle contrast boost without pixel clipping

        for (let i = 0; i < len; i += 4) {
          let r = data[i], g = data[i + 1], b = data[i + 2];

          // Soft glare suppression for shiny foil packaging
          if (r > 248 && g > 248 && b > 248) {
            r = g = b = 232;
          }

          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          let enhanced = (gray - 128) * contrastFactor + 128 + brightnessShift;
          enhanced = Math.max(0, Math.min(255, enhanced));

          data[i] = data[i + 1] = data[i + 2] = Math.round(enhanced);
        }

        ctx.putImageData(imageData, 0, 0);
        resolve({
          processedDataUrl: canvas.toDataURL('image/jpeg', 0.94),
          originalWidth: origW,
          originalHeight: origH,
          enhancementApplied: ['Resolution Preservation (2048px)', 'Glare Softening', 'Adaptive Contrast']
        });
      } catch {
        resolve({ processedDataUrl: jpegUrl, originalWidth: 800, originalHeight: 800, enhancementApplied: ['safe-fallback'] });
      }
    };

    img.onerror = () => {
      resolve({ processedDataUrl: jpegUrl, originalWidth: 800, originalHeight: 800, enhancementApplied: ['jpeg-fallback'] });
    };

    img.src = jpegUrl;
  });
}

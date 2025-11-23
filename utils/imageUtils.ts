import { DocumentType } from '../types';

export const getDimensionsForDocType = (type: DocumentType): { width: number; height: number; label: string } => {
  switch (type) {
    case DocumentType.PASSPORT:
    case DocumentType.CCCD:
      return { width: 400, height: 600, label: '4x6 cm' };
    case DocumentType.LICENSE:
    case DocumentType.STUDENT:
      return { width: 300, height: 400, label: '3x4 cm' };
    default:
      return { width: 400, height: 600, label: '4x6 cm' };
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const cropImageToRatio = (
  base64Image: string, 
  targetWidth: number, 
  targetHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image.startsWith('data:') ? base64Image : `data:image/png;base64,${base64Image}`;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');

      // Calculate aspect ratios
      const targetRatio = targetWidth / targetHeight;
      const sourceRatio = img.width / img.height;

      let renderWidth = img.width;
      let renderHeight = img.height;
      let offsetX = 0;
      let offsetY = 0;

      // Crop logic: Center crop
      if (sourceRatio > targetRatio) {
        // Source is wider than target: Crop width
        renderWidth = img.height * targetRatio;
        offsetX = (img.width - renderWidth) / 2;
      } else {
        // Source is taller than target: Crop height
        renderHeight = img.width / targetRatio;
        offsetY = (img.height - renderHeight) / 2;
      }

      // Set high resolution for the output
      canvas.width = targetWidth * 2; // Double resolution for crisp print
      canvas.height = targetHeight * 2;

      ctx.drawImage(
        img,
        offsetX, offsetY, renderWidth, renderHeight, // Source crop
        0, 0, canvas.width, canvas.height // Dest draw
      );

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
  });
};
import { WorkerManager } from './workerUtils';
import {
  uploadToFirebaseStorage,
  generateUniqueFileName,
} from './storageUtils';

// 画像ファイルをArrayBufferに変換
export const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to ArrayBuffer'));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// 画像をImageDataに変換
export const imageToImageData = async (src: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      resolve(imageData);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
};

// ArrayBufferをBlobURL(Data URL)に変換
export const arrayBufferToDataURL = (
  buffer: ArrayBuffer,
  mimeType: string,
): string => {
  const blob = new Blob([buffer], { type: mimeType });
  return URL.createObjectURL(blob);
};

// 画像をAVIFに変換し、Firebase Storageにアップロードする
export const convertToAvifAndUpload = async (
  file: File,
  uploadPath?: string,
) => {
  try {
    // WorkerManagerのインスタンスを取得
    const workerManager = WorkerManager.getInstance();

    // 画像オブジェクトをImageDataに変換（元画像の表示用）
    const originalUrl = URL.createObjectURL(file);
    const imageData = await imageToImageData(originalUrl);

    // Worker経由でAVIFにエンコード
    const avifBuffer = await workerManager.encodeToAvif(imageData, {
      // エンコードオプション（必要に応じて調整）
      cqLevel: 30,
      cqAlphaLevel: -1,
      denoiseLevel: 0,
      tileColsLog2: 0,
      tileRowsLog2: 0,
      speed: 8,
      subsample: 1,
      chromaDeltaQ: false,
      sharpness: 0,
      tune: 0,
    });

    // 変換したAVIFをBlobURLに変換する
    const avifUrl = arrayBufferToDataURL(avifBuffer, 'image/avif');

    // Firebase Storageにアップロードするためのパスを生成
    const fileName = generateUniqueFileName(file.name);
    const storagePath = uploadPath
      ? `${uploadPath}/${fileName}`
      : `avif-images/${fileName}`;

    // Firebase Storageにアップロード
    const firebaseUrl = await uploadToFirebaseStorage(avifBuffer, storagePath, {
      contentType: 'image/avif',
      customMetadata: {
        originalFileName: file.name,
        originalFileSize: file.size.toString(),
        width: imageData.width.toString(),
        height: imageData.height.toString(),
        convertedAt: new Date().toISOString(),
      },
    });

    return {
      originalUrl,
      avifUrl,
      firebaseUrl,
      originalSize: file.size,
      avifSize: avifBuffer.byteLength,
      width: imageData.width,
      height: imageData.height,
      fileName: fileName,
    };
  } catch (error) {
    console.error('Error converting to AVIF and uploading:', error);
    throw error;
  }
};

// AVIFファイルをデコードしてImageDataに変換
export const decodeAvifFile = async (file: File): Promise<ImageData> => {
  const workerManager = WorkerManager.getInstance();
  const arrayBuffer = await fileToArrayBuffer(file);
  return workerManager.decodeAvif(arrayBuffer);
};

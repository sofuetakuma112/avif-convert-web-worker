import React, { useState, useEffect } from 'react';
import { convertToAvifAndUpload } from '../utils/imageUtils';
import { WorkerManager } from '../utils/workerUtils';

interface ImageConverterProps {
  onConversionComplete: (data: {
    originalUrl: string;
    avifUrl: string;
    firebaseUrl: string;
    originalSize: number;
    avifSize: number;
    width: number;
    height: number;
    fileName: string;
  }) => void;
  onError: (error: Error) => void;
  uploadPath?: string; // アップロード先のカスタムパス
}

const ImageConverter: React.FC<ImageConverterProps> = ({
  onConversionComplete,
  onError,
  uploadPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<'idle' | 'converting' | 'uploading'>(
    'idle',
  );

  // コンポーネントがマウントされたらWorkWerを初期化
  useEffect(() => {
    // Web Workerを初期化
    const workerManager = WorkerManager.getInstance();
    workerManager.initWorker();

    // クリーンアップ関数
    return () => {
      // コンポーネントがアンマウントされたらWorkerを終了
      workerManager.terminateWorker();
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      onError(new Error('Please select an image file'));
      return;
    }

    setIsLoading(true);
    setStage('converting');

    try {
      setStage('uploading');
      const result = await convertToAvifAndUpload(file, uploadPath);
      onConversionComplete(result);
    } catch (error) {
      onError(
        error instanceof Error ? error : new Error('Unknown error occurred'),
      );
    } finally {
      setIsLoading(false);
      setStage('idle');
    }
  };

  const getStatusMessage = () => {
    switch (stage) {
      case 'converting':
        return 'Converting image to AVIF...';
      case 'uploading':
        return 'Uploading to Firebase Storage...';
      default:
        return 'Converting...';
    }
  };

  return (
    <div className="image-converter">
      <h2>Convert Image to AVIF and Upload to Firebase</h2>
      <div className="upload-container">
        <label className="file-input-label">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          {isLoading ? getStatusMessage() : 'Select Image'}
        </label>
      </div>
      {isLoading && (
        <div className="loading">
          <div className="loading-message">{getStatusMessage()}</div>
          <div className="loading-progress"></div>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;

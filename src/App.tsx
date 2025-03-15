import React, { useState } from 'react';
import './App.css';
import ImageConverter from './components/ImageConverter';
import ImageDisplay from './components/ImageDisplay';

function App() {
  const [imageData, setImageData] = useState<{
    originalUrl: string | null;
    avifUrl: string | null;
    firebaseUrl: string | null;
    originalSize: number | null;
    avifSize: number | null;
    width: number | null;
    height: number | null;
    fileName: string | null;
  }>({
    originalUrl: null,
    avifUrl: null,
    firebaseUrl: null,
    originalSize: null,
    avifSize: null,
    width: null,
    height: null,
    fileName: null,
  });

  const [error, setError] = useState<string | null>(null);

  const handleConversionComplete = (data: {
    originalUrl: string;
    avifUrl: string;
    firebaseUrl: string;
    originalSize: number;
    avifSize: number;
    width: number;
    height: number;
    fileName: string;
  }) => {
    setImageData(data);
    setError(null);
  };

  const handleError = (err: Error) => {
    setError(err.message);
  };

  return (
    <div className="app-container">
      <header>
        <h1>AVIF Image Converter with Firebase Upload</h1>
        <p>
          Convert your images to the AVIF format and upload to Firebase Storage
        </p>
      </header>

      <main>
        <ImageConverter
          onConversionComplete={handleConversionComplete}
          onError={handleError}
          uploadPath="avif-images" // カスタムアップロードパス
        />

        {error && <div className="error-message">Error: {error}</div>}

        <ImageDisplay
          originalUrl={imageData.originalUrl}
          avifUrl={imageData.avifUrl}
          firebaseUrl={imageData.firebaseUrl}
          originalSize={imageData.originalSize}
          avifSize={imageData.avifSize}
          width={imageData.width}
          height={imageData.height}
          fileName={imageData.fileName}
        />
      </main>

      <footer>
        <p>Powered by @jsquash/avif, WebAssembly and Firebase</p>
      </footer>
    </div>
  );
}

export default App;

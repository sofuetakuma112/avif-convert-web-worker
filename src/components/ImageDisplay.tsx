import React from 'react';

interface ImageDisplayProps {
  originalUrl: string | null;
  avifUrl: string | null;
  firebaseUrl: string | null;
  originalSize: number | null;
  avifSize: number | null;
  width: number | null;
  height: number | null;
  fileName: string | null;
}

const formatSize = (bytes: number | null): string => {
  if (bytes === null) return 'N/A';
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  originalUrl,
  avifUrl,
  firebaseUrl,
  originalSize,
  avifSize,
  width,
  height,
  fileName,
}) => {
  if (!originalUrl || !avifUrl) return null;

  const compressionRatio =
    originalSize && avifSize
      ? ((1 - avifSize / originalSize) * 100).toFixed(2)
      : 'N/A';

  return (
    <div className="image-display-container">
      <div className="image-comparison">
        <div className="image-box">
          <h3>Original Image</h3>
          <img src={originalUrl} alt="Original" className="preview-image" />
          <div className="image-info">
            <p>Size: {formatSize(originalSize)}</p>
            <p>
              Dimensions: {width}×{height}
            </p>
          </div>
        </div>

        <div className="image-box">
          <h3>AVIF Image</h3>
          <img src={avifUrl} alt="AVIF" className="preview-image" />
          <div className="image-info">
            <p>Size: {formatSize(avifSize)}</p>
            <p>Compression: {compressionRatio}%</p>
            {fileName && <p>Filename: {fileName}</p>}
          </div>
        </div>
      </div>

      <div className="firebase-info">
        {firebaseUrl && (
          <>
            <h3>Firebase Storage Upload</h3>
            <p>
              Your image has been successfully uploaded to Firebase Storage!
            </p>
            <div className="firebase-url">
              <p>Firebase URL:</p>
              <a
                href={firebaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="firebase-link"
              >
                {firebaseUrl}
              </a>
            </div>
          </>
        )}
      </div>

      <div className="download-section">
        <a
          href={avifUrl}
          download="converted-image.avif"
          className="download-button"
        >
          Download AVIF Image
        </a>

        {firebaseUrl && (
          <a
            href={firebaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="firebase-button"
          >
            View in Firebase
          </a>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;

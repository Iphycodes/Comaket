// ImageCropper.tsx
import React, { useState, useCallback } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { Button } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imageSrc: string;
  onComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

const DEFAULT_CROP: Crop = {
  unit: '%',
  width: 90,
  height: 90,
  x: 5,
  y: 5,
};

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onComplete, onCancel }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  const [crop, setCrop] = useState<Crop>(DEFAULT_CROP);
  // Seed with the default crop so the button is never disabled on first render
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  // When the image loads, compute the pixel-based crop from the default %
  // so that completedCrop is populated immediately (button enabled).
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const pixelCrop: Crop = {
      unit: 'px',
      x: (DEFAULT_CROP.x / 100) * img.width,
      y: (DEFAULT_CROP.y / 100) * img.height,
      width: (DEFAULT_CROP.width / 100) * img.width,
      height: (DEFAULT_CROP.height / 100) * img.height,
    };
    setCompletedCrop(pixelCrop);
  }, []);

  const getCroppedImg = (image: HTMLImageElement, cropData: Crop): Promise<string> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = cropData.width;
    canvas.height = cropData.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        cropData.x * scaleX,
        cropData.y * scaleY,
        cropData.width * scaleX,
        cropData.height * scaleY,
        0,
        0,
        cropData.width,
        cropData.height
      );
    }

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          }
        },
        'image/jpeg',
        1
      );
    });
  };

  const handleCropComplete = async () => {
    if (!imageRef.current) return;

    // Use completedCrop if available, otherwise compute from current % crop
    let cropToUse = completedCrop;
    if (!cropToUse || !cropToUse.width || !cropToUse.height) {
      const img = imageRef.current;
      cropToUse = {
        unit: 'px',
        x: (crop.x / 100) * img.width,
        y: (crop.y / 100) * img.height,
        width: (crop.width / 100) * img.width,
        height: (crop.height / 100) * img.height,
      };
    }

    if (cropToUse.width && cropToUse.height) {
      const croppedImageUrl = await getCroppedImg(imageRef.current, cropToUse);
      onComplete(croppedImageUrl);
    }
  };

  // Button is always enabled once the image has loaded
  // const isButtonEnabled = !!completedCrop?.width && !!completedCrop?.height;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Crop area — fills available space */}
      <div className={`flex justify-center items-center flex-1 min-h-0 ${isMobile ? 'px-2' : ''}`}>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}
          className={isMobile ? 'max-h-[60vh]' : 'max-h-[400px]'}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop me"
            onLoad={onImageLoad}
            className={`object-contain ${isMobile ? 'max-h-[60vh]' : 'max-h-[400px]'}`}
          />
        </ReactCrop>
      </div>

      {/* Action buttons */}
      <div className={`flex gap-3 ${isMobile ? 'flex-col px-1 pb-2' : 'justify-end mt-4'}`}>
        {isMobile ? (
          <>
            <button
              type="button"
              onClick={handleCropComplete}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20"
            >
              Crop & Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <Button type="default" onClick={onCancel} className="!h-14 px-10 hover:bg-gray-100">
              Cancel
            </Button>
            <Button
              type="default"
              onClick={handleCropComplete}
              className="px-10 text-lg font-semibold py-2 !h-14 bg-gradient-to-r !from-blue !to-indigo-500 hover:!from-blue hover:!to-indigo-600 !text-white hover:!text-white rounded-md transition-colors"
            >
              Crop & Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

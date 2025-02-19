// ImageCropper.tsx
import React, { useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { Button } from 'antd';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imageSrc: string;
  onComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<string> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
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
    if (imageRef.current && completedCrop?.width && completedCrop?.height) {
      const croppedImageUrl = await getCroppedImg(imageRef.current, completedCrop);
      onComplete(croppedImageUrl);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}
          className="max-h-[400px]"
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop me"
            className="max-h-[400px] object-contain"
          />
        </ReactCrop>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button onClick={onCancel} className="!h-14 px-10 hover:bg-gray-100">
          Cancel
        </Button>
        <Button
          //   type="primary"
          onClick={handleCropComplete}
          disabled={!completedCrop?.width || !completedCrop?.height}
          className="px-10 text-lg font-semibold py-2 !h-14 bg-gradient-to-r !from-blue !to-indigo-500 hover:!from-blue hover:!to-indigo-600 !text-white hover:!text-white rounded-md  transition-colors"
        >
          Crop & Save
        </Button>
        {/* <Button
          type="primary"
          onClick={handleCropComplete}
          className="h-10 px-6 bg-black text-white hover:bg-gray-800"
          disabled={!completedCrop?.width || !completedCrop?.height}
        >
          Crop & Save
        </Button> */}
      </div>
    </div>
  );
};

// ImageUploadSection.tsx
import { Modal, message } from 'antd';
import { useState } from 'react';
import { ImageCropper } from '../image-cropper';

interface ImageUploadSectionProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  images,
  onImagesChange,
  maxImages = 7,
}) => {
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const processNextImage = () => {
    if (currentImageIndex < pendingImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
      setCurrentImage(pendingImages[currentImageIndex + 1]);
    } else {
      // No more images to process
      setCropModalVisible(false);
      setCurrentImage('');
      setPendingImages([]);
      setCurrentImageIndex(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxImages - images.length;

    if (files.length > remainingSlots) {
      message.warning(
        `You can only add ${remainingSlots} more image${remainingSlots > 1 ? 's' : ''}`
      );
      files.splice(remainingSlots);
    }

    // Validate and process each file
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        message.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        message.error(`${file.name} is not an image`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Read all valid files
    Promise.all(
      validFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    ).then((results) => {
      setPendingImages(results);
      setCurrentImage(results[0]);
      setCurrentImageIndex(0);
      setCropModalVisible(true);
    });

    // Reset input value
    e.target.value = '';
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    onImagesChange([...images, croppedImageUrl]);
    if (pendingImages.length > currentImageIndex + 1) {
      processNextImage();
    } else {
      setCropModalVisible(false);
      setPendingImages([]);
      setCurrentImageIndex(0);
    }
  };

  const handleCropCancel = () => {
    setCropModalVisible(false);
    setPendingImages([]);
    setCurrentImageIndex(0);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={image}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button
                onClick={() => handleRemoveImage(index)}
                className="text-white hover:text-red-500 transition-colors"
              >
                <i className="ri-delete-bin-6-line text-2xl"></i>
              </button>
            </div>
          </div>
        ))}
        {images.length < maxImages && (
          <div
            role="button"
            tabIndex={0}
            className="relative aspect-square cursor-pointer group"
            onClick={() => document.getElementById('multi-image-upload')?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                document.getElementById('multi-image-upload')?.click();
              }
            }}
          >
            <input
              id="multi-image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors">
              <i className="ri-add-circle-line text-3xl text-gray-400 mb-2"></i>
              <span className="text-sm text-gray-500">
                {images.length === 0
                  ? 'Add up to 7 images'
                  : `Add ${maxImages - images.length} more`}
              </span>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={cropModalVisible}
        onCancel={handleCropCancel}
        width={800}
        title={`Crop Image ${currentImageIndex + 1} of ${pendingImages.length}`}
        footer={null}
        destroyOnClose
      >
        {currentImage && (
          <ImageCropper
            imageSrc={currentImage}
            onComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        )}
      </Modal>
    </div>
  );
};

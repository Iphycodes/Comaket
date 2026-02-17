// ImageUploadSection.tsx
import { Modal, message } from 'antd';
import { useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Crop } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { ImageCropper } from '../image-cropper';

interface ImageUploadSectionProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const isVideo = (dataUrl: string): boolean =>
  dataUrl.startsWith('data:video/') || dataUrl.endsWith('.mp4');

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 15 * 1024 * 1024; // 15MB
const ACCEPTED_TYPES = 'image/*,video/mp4';

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  images,
  onImagesChange,
  maxImages = 7,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  // Crop state
  const [cropVisible, setCropVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Guard against double-trigger of file input
  const fileInputOpenRef = useRef(false);

  // Track images accumulated during a batch crop session
  const batchRef = useRef<string[]>([]);

  // ── File selection ──────────────────────────────────────────────────────

  const triggerFileInput = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Prevent the event from bubbling up to the Form which could cause submission
    e.preventDefault();
    e.stopPropagation();

    // Guard: don't open the file dialog if it's already opening
    if (fileInputOpenRef.current) return;
    fileInputOpenRef.current = true;

    // Reset the guard after a short delay (covers cancel + selection)
    setTimeout(() => {
      fileInputOpenRef.current = false;
    }, 1000);

    inputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent any form submission from the change event
    e.stopPropagation();

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;

    if (files.length > remainingSlots) {
      message.warning(
        `You can only add ${remainingSlots} more file${remainingSlots > 1 ? 's' : ''}`
      );
      files.splice(remainingSlots);
    }

    const validFiles = files.filter((file) => {
      const isVideoFile = file.type === 'video/mp4';
      const isImageFile = file.type.startsWith('image/');

      if (!isVideoFile && !isImageFile) {
        message.error(`${file.name} is not a supported format. Use images or MP4 video.`);
        return false;
      }

      if (isVideoFile && file.size > MAX_VIDEO_SIZE) {
        message.error(`${file.name} is too large (max 15MB for videos)`);
        return false;
      }

      if (isImageFile && file.size > MAX_IMAGE_SIZE) {
        message.error(`${file.name} is too large (max 5MB for images)`);
        return false;
      }

      return true;
    });

    // Reset the input value BEFORE processing so re-selecting the same file works
    e.target.value = '';

    if (validFiles.length === 0) return;

    // Read all files
    Promise.all(
      validFiles.map((file) => {
        return new Promise<{ dataUrl: string; isVideo: boolean }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve({
              dataUrl: reader.result as string,
              isVideo: file.type === 'video/mp4',
            });
          reader.readAsDataURL(file);
        });
      })
    ).then((results) => {
      const videoDataUrls = results.filter((r) => r.isVideo).map((r) => r.dataUrl);
      const imageDataUrls = results.filter((r) => !r.isVideo).map((r) => r.dataUrl);

      // Videos skip cropping — add them directly
      const updatedImages = [...images, ...videoDataUrls];

      if (imageDataUrls.length > 0) {
        // Start crop flow for images only
        batchRef.current = updatedImages;
        setPendingImages(imageDataUrls);
        setCurrentImage(imageDataUrls[0]);
        setCurrentImageIndex(0);
        setCropVisible(true);

        // If there were videos too, update state now so they show up
        if (videoDataUrls.length > 0) {
          onImagesChange(updatedImages);
        }
      } else {
        // Only videos — just add them all
        onImagesChange(updatedImages);
      }
    });
  };

  // ── Crop handlers ───────────────────────────────────────────────────────

  const advanceOrFinish = () => {
    if (currentImageIndex < pendingImages.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setCurrentImage(pendingImages[nextIndex]);
    } else {
      setCropVisible(false);
      setPendingImages([]);
      setCurrentImageIndex(0);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    batchRef.current = [...batchRef.current, croppedImageUrl];
    onImagesChange(batchRef.current);
    advanceOrFinish();
  };

  const handleCropCancel = () => {
    setCropVisible(false);
    setPendingImages([]);
    setCurrentImageIndex(0);
  };

  const handleSkipCrop = () => {
    // Add the current image uncropped
    batchRef.current = [...batchRef.current, currentImage];
    onImagesChange(batchRef.current);
    advanceOrFinish();
  };

  // ── Remove media ────────────────────────────────────────────────────────

  const handleRemoveMedia = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newMedia = images.filter((_, i) => i !== index);
    onImagesChange(newMedia);
  };

  // ── Thumbnail size ──────────────────────────────────────────────────────

  const thumbSize = isMobile ? 'w-20 h-20' : 'w-24 h-24';
  const addBtnSize = isMobile ? 'w-20 h-20' : 'w-24 h-24';

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════

  return (
    <div>
      {/* Hidden file input — OUTSIDE of any clickable container to prevent double triggers */}
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        className="hidden"
        onChange={handleFileSelect}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Single horizontal row — scrollable on overflow */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {/* Upload button — type="button" prevents form submission */}
        {images.length < maxImages && (
          <button
            type="button"
            className={`flex-shrink-0 ${addBtnSize} cursor-pointer bg-transparent border-none p-0`}
            onClick={triggerFileInput}
          >
            <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-blue dark:hover:border-blue hover:bg-indigo-50/50 dark:hover:bg-blue/10 transition-colors">
              <i className="ri-add-circle-line text-2xl text-gray-400 dark:text-gray-500 mb-0.5" />
              <span className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-tight px-1">
                {images.length === 0 ? 'Add media' : `${maxImages - images.length} left`}
              </span>
            </div>
          </button>
        )}

        {/* Media thumbnails */}
        {images.map((media, index) => (
          <div
            key={`${index}-${media.slice(-20)}`}
            className={`relative group flex-shrink-0 ${thumbSize}`}
          >
            {isVideo(media) ? (
              <div className="w-full h-full rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-900 relative">
                <video
                  src={media}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    video.currentTime = 1;
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                    <i className="ri-play-fill text-white text-base ml-0.5" />
                  </div>
                </div>
                <span className="absolute top-1 right-1 text-[8px] font-bold bg-purple-500 text-white px-1 py-0.5 rounded shadow">
                  MP4
                </span>
              </div>
            ) : (
              <img
                src={media}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700"
              />
            )}

            {/* Delete button */}
            {isMobile ? (
              <button
                type="button"
                onClick={(e) => handleRemoveMedia(index, e)}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md z-[2]"
              >
                <X size={12} />
              </button>
            ) : (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => handleRemoveMedia(index, e)}
                  className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                >
                  <i className="ri-delete-bin-6-line text-sm" />
                </button>
              </div>
            )}

            {/* Cover badge on first image */}
            {index === 0 && !isVideo(media) && (
              <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-blue text-white px-1.5 py-0.5 rounded shadow">
                Cover
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CROP — Mobile: full-screen view, Desktop: modal                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      {isMobile ? (
        <AnimatePresence>
          {cropVisible && currentImage && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-0 z-[10000] bg-white dark:bg-gray-900"
            >
              {/* Header — absolute top */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCropCancel}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div>
                      <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Crop size={16} />
                        Crop Image
                      </h2>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {currentImageIndex + 1} of {pendingImages.length}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSkipCrop}
                    className="text-sm font-medium text-blue hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue/10"
                  >
                    Skip
                  </button>
                </div>

                {/* Image counter dots */}
                {pendingImages.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pb-2">
                    {pendingImages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === currentImageIndex
                            ? 'w-6 bg-blue'
                            : idx < currentImageIndex
                              ? 'w-1.5 bg-blue/40'
                              : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Cropper area */}
              <div
                className="absolute left-0 right-0 overflow-y-auto"
                style={{
                  top: pendingImages.length > 1 ? 80 : 60,
                  bottom: 0,
                }}
              >
                <div className="h-full flex items-center justify-center px-3">
                  <ImageCropper
                    imageSrc={currentImage}
                    onComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <Modal
          open={cropVisible}
          onCancel={handleCropCancel}
          width={800}
          title={
            <div className="flex items-center justify-between pr-8">
              <span>
                Crop Image {currentImageIndex + 1} of {pendingImages.length}
              </span>
              <button
                type="button"
                onClick={handleSkipCrop}
                className="text-sm font-medium text-blue hover:text-indigo-600 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue/10"
              >
                Skip Crop
              </button>
            </div>
          }
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
      )}
    </div>
  );
};

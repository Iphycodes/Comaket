// ImageUploadSection.tsx
import { Modal, message } from 'antd';
import { useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Crop, Check } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { ImageCropper } from '../image-cropper';

interface ImageUploadSectionProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const isVideo = (dataUrl: string): boolean =>
  dataUrl.startsWith('data:video/') || dataUrl.endsWith('.mp4');

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 15 * 1024 * 1024;
const ACCEPTED_TYPES = 'image/*,video/mp4';

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  images,
  onImagesChange,
  maxImages = 7,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  // Preview/crop state
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fileInputOpenRef = useRef(false);
  const batchRef = useRef<string[]>([]);

  // ── File selection ──────────────────────────────────────────────────────

  const triggerFileInput = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputOpenRef.current) return;
    fileInputOpenRef.current = true;
    setTimeout(() => {
      fileInputOpenRef.current = false;
    }, 1000);
    inputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        message.error(`${file.name} is not a supported format.`);
        return false;
      }
      if (isVideoFile && file.size > MAX_VIDEO_SIZE) {
        message.error(`${file.name} is too large (max 15MB)`);
        return false;
      }
      if (isImageFile && file.size > MAX_IMAGE_SIZE) {
        message.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    e.target.value = '';
    if (validFiles.length === 0) return;

    Promise.all(
      validFiles.map(
        (file) =>
          new Promise<{ dataUrl: string; isVideo: boolean }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve({ dataUrl: reader.result as string, isVideo: file.type === 'video/mp4' });
            reader.readAsDataURL(file);
          })
      )
    ).then((results) => {
      const videoDataUrls = results.filter((r) => r.isVideo).map((r) => r.dataUrl);
      const imageDataUrls = results.filter((r) => !r.isVideo).map((r) => r.dataUrl);

      const updatedImages = [...images, ...videoDataUrls];

      if (imageDataUrls.length > 0) {
        batchRef.current = updatedImages;
        setPendingImages(imageDataUrls);
        setCurrentImage(imageDataUrls[0]);
        setCurrentImageIndex(0);
        setIsCropping(false); // Start in preview mode, not crop mode
        setPreviewVisible(true);

        if (videoDataUrls.length > 0) onImagesChange(updatedImages);
      } else {
        onImagesChange(updatedImages);
      }
    });
  };

  // ── Preview/Crop handlers ───────────────────────────────────────────────

  const advanceOrFinish = () => {
    if (currentImageIndex < pendingImages.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setCurrentImage(pendingImages[nextIndex]);
      setIsCropping(false); // Reset to preview for next image
    } else {
      setPreviewVisible(false);
      setPendingImages([]);
      setCurrentImageIndex(0);
      setIsCropping(false);
    }
  };

  /** Use the image as-is (no crop) */
  const handleProceed = () => {
    batchRef.current = [...batchRef.current, currentImage];
    onImagesChange(batchRef.current);
    advanceOrFinish();
  };

  /** Enter crop mode for current image */
  const handleStartCrop = () => {
    setIsCropping(true);
  };

  /** Crop completed — use the cropped version */
  const handleCropComplete = (croppedImageUrl: string) => {
    batchRef.current = [...batchRef.current, croppedImageUrl];
    onImagesChange(batchRef.current);
    setIsCropping(false);
    advanceOrFinish();
  };

  /** Cancel crop — go back to preview */
  const handleCropCancel = () => {
    setIsCropping(false);
  };

  /** Cancel entire preview flow */
  const handleClosePreview = () => {
    setPreviewVisible(false);
    setPendingImages([]);
    setCurrentImageIndex(0);
    setIsCropping(false);
  };

  // ── Remove media ────────────────────────────────────────────────────────

  const handleRemoveMedia = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const thumbSize = isMobile ? 'w-20 h-20' : 'w-24 h-24';
  const addBtnSize = isMobile ? 'w-20 h-20' : 'w-24 h-24';

  // ── Preview content (shared between mobile & desktop) ───────────────────

  const renderPreviewContent = () => {
    if (isCropping) {
      return (
        <ImageCropper
          imageSrc={currentImage}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      );
    }

    // Preview mode — show image with Proceed / Crop buttons
    return (
      <div className="flex flex-col h-full">
        <div
          className={`flex-1 flex items-center justify-center min-h-0 ${isMobile ? 'px-3' : 'p-4'}`}
        >
          <img
            src={currentImage}
            alt={`Preview ${currentImageIndex + 1}`}
            className={`max-w-full object-contain rounded-lg ${
              isMobile ? 'max-h-[60vh]' : 'max-h-[400px]'
            }`}
          />
        </div>

        <div
          className={`flex gap-3 ${isMobile ? 'flex-col px-4 pb-4' : 'justify-end px-2 pb-2 mt-4'}`}
        >
          {isMobile ? (
            <div className="pb-20 flex flex-col gap-y-2">
              <button
                type="button"
                onClick={handleStartCrop}
                className="w-full py-3 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center justify-center gap-2"
              >
                <Crop size={16} />
                Crop Image
              </button>
              <button
                type="button"
                onClick={handleProceed}
                className="w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Use This Image
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleStartCrop}
                className="px-6 py-3 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center gap-2"
              >
                <Crop size={16} />
                Crop
              </button>
              <button
                type="button"
                onClick={handleProceed}
                className="px-8 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 flex items-center gap-2"
              >
                <Check size={16} />
                Use This Image
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════

  return (
    <div>
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

      {/* Thumbnail row */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600">
        {images.length < maxImages && (
          <button
            type="button"
            className={`flex-shrink-0 ${addBtnSize} cursor-pointer bg-transparent border-none p-0`}
            onClick={triggerFileInput}
          >
            <div className="w-full h-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl flex flex-col items-center justify-center hover:border-blue dark:hover:border-blue hover:bg-indigo-50/50 dark:hover:bg-blue/10 transition-colors">
              <i className="ri-add-circle-line text-2xl text-neutral-400 dark:text-neutral-500 mb-0.5" />
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center leading-tight px-1">
                {images.length === 0 ? 'Add media' : `${maxImages - images.length} left`}
              </span>
            </div>
          </button>
        )}

        {images.map((media, index) => (
          <div
            key={`${index}-${media.slice(-20)}`}
            className={`relative group flex-shrink-0 ${thumbSize}`}
          >
            {isVideo(media) ? (
              <div className="w-full h-full rounded-xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-900 relative">
                <video
                  src={media}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    e.currentTarget.currentTime = 1;
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
                className="w-full h-full object-cover rounded-xl border-2 border-neutral-200 dark:border-neutral-700"
              />
            )}
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
            {index === 0 && !isVideo(media) && (
              <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-blue text-white px-1.5 py-0.5 rounded shadow">
                Cover
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PREVIEW / CROP — Mobile: full-screen, Desktop: modal             */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      {isMobile ? (
        <AnimatePresence>
          {previewVisible && currentImage && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-0 z-[10000] bg-white dark:bg-neutral-900"
            >
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={isCropping ? handleCropCancel : handleClosePreview}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div>
                      <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        {isCropping ? (
                          <>
                            <Crop size={16} />
                            Crop Image
                          </>
                        ) : (
                          'Preview'
                        )}
                      </h2>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {currentImageIndex + 1} of {pendingImages.length}
                      </p>
                    </div>
                  </div>
                </div>

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
                              : 'w-1.5 bg-neutral-300 dark:bg-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                className="absolute left-0 right-0 overflow-y-auto"
                style={{ top: pendingImages.length > 1 ? 80 : 60, bottom: 0 }}
              >
                <div className="h-full flex flex-col">{renderPreviewContent()}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <Modal
          open={previewVisible}
          onCancel={handleClosePreview}
          width={800}
          title={
            <div className="flex items-center gap-2">
              {isCropping && (
                <button
                  type="button"
                  onClick={handleCropCancel}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <span>
                {isCropping ? 'Crop Image' : 'Preview'} {currentImageIndex + 1} of{' '}
                {pendingImages.length}
              </span>
            </div>
          }
          footer={null}
          destroyOnClose
        >
          {currentImage && renderPreviewContent()}
        </Modal>
      )}
    </div>
  );
};

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Modal, message as antMessage } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Trash2,
  Sparkles,
  Layers,
  Send,
  Loader2,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useFeaturedWorks } from '@grc/hooks/useFeaturedWorks';
import { useMedia } from '@grc/hooks/useMedia';
import { FeaturedWorkOwnerType, FeaturedWork } from '@grc/services/featured-works';

// ═══════════════════════════════════════════════════════════════════════════
// CAPTION UPLOAD SCREEN (WhatsApp-style)
// ═══════════════════════════════════════════════════════════════════════════

interface CaptionUploadScreenProps {
  images: string[];
  onSubmit: (caption: string) => void;
  onBack: () => void;
  onRemoveImage: (index: number) => void;
  isSubmitting?: boolean;
}

const MAX_CAPTION_LENGTH = 280;

const CaptionUploadScreen: React.FC<CaptionUploadScreenProps> = ({
  images,
  onSubmit,
  onBack,
  onRemoveImage,
  isSubmitting,
}) => {
  const [caption, setCaption] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-black/80 backdrop-blur-sm z-10">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <span className="text-white/50 text-xs">
          {images.length} image{images.length !== 1 ? 's' : ''} selected
        </span>
      </div>

      {/* Main image preview */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={previewIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            src={images[previewIndex]}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        </AnimatePresence>

        {/* Remove current image */}
        {images.length > 1 && (
          <button
            onClick={() => {
              onRemoveImage(previewIndex);
              if (previewIndex >= images.length - 1) setPreviewIndex(Math.max(0, previewIndex - 1));
            }}
            disabled={isSubmitting}
            className="absolute top-3 right-3 w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} className="text-white" />
          </button>
        )}

        {/* Nav arrows */}
        {images.length > 1 && previewIndex > 0 && (
          <button
            onClick={() => setPreviewIndex((p) => p - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronLeft size={18} className="text-white" />
          </button>
        )}
        {images.length > 1 && previewIndex < images.length - 1 && (
          <button
            onClick={() => setPreviewIndex((p) => p + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setPreviewIndex(i)}
                className={`rounded-full transition-all ${
                  i === previewIndex ? 'w-2.5 h-2.5 bg-white' : 'w-2 h-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 px-4 py-3 bg-black/80 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setPreviewIndex(i)}
              className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                i === previewIndex ? 'border-white scale-105' : 'border-transparent opacity-60'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Caption input area — WhatsApp style */}
      <div className="px-4 py-4 pb-8 bg-gradient-to-t from-black via-black/95 to-black/80">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <textarea
              value={caption}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CAPTION_LENGTH) setCaption(e.target.value);
              }}
              placeholder="Add a caption..."
              rows={2}
              disabled={isSubmitting}
              className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/40 rounded-2xl px-4 py-3 text-sm resize-none border border-white/10 focus:border-white/30 focus:outline-none transition-colors disabled:opacity-50"
            />
            <span
              className={`absolute bottom-2 right-3 text-[10px] ${
                caption.length >= MAX_CAPTION_LENGTH ? 'text-red-400' : 'text-white/30'
              }`}
            >
              {caption.length}/{MAX_CAPTION_LENGTH}
            </span>
          </div>
          <button
            onClick={() => onSubmit(caption)}
            disabled={isSubmitting}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue to-indigo-500 flex items-center justify-center shadow-lg shadow-blue/30 hover:shadow-xl hover:scale-105 transition-all flex-shrink-0 disabled:opacity-60 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="text-white animate-spin" />
            ) : (
              <Send size={18} className="text-white ml-0.5" />
            )}
          </button>
        </div>
        {isSubmitting && (
          <p className="text-white/40 text-xs text-center mt-2">Uploading images...</p>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// WORK DETAIL VIEW (shared content for modal & mobile)
// ═══════════════════════════════════════════════════════════════════════════

interface WorkDetailViewProps {
  work: FeaturedWork;
  onClose: () => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const WorkDetailView: React.FC<WorkDetailViewProps> = ({ work, onDelete, isDeleting }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery(mediaSize.mobile);

  const images = work.images || [];
  const workId = work._id || (work as any).id || '';

  return (
    <div className={`flex flex-col ${isMobile ? 'h-full bg-black' : ''}`}>
      {/* Image area */}
      <div
        className={`relative ${
          isMobile ? 'flex-1 flex items-center justify-center' : 'aspect-square'
        } bg-black overflow-hidden`}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            src={images[currentIndex]}
            alt={work.description}
            className={`${isMobile ? 'max-w-full max-h-full' : 'w-full h-full'} object-contain`}
          />
        </AnimatePresence>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex((p) => p - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-neutral-600 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-neutral-600 transition-colors"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
            )}
            {currentIndex < images.length - 1 && (
              <button
                onClick={() => setCurrentIndex((p) => p + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-neutral-600 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-neutral-600 transition-colors"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            )}
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <span className="text-white text-xs font-medium">
              {currentIndex + 1}/{images.length}
            </span>
          </div>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_: any, i: any) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all ${
                  i === currentIndex ? 'w-2.5 h-2.5 bg-white' : 'w-2 h-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption & meta */}
      <div
        className={`${
          isMobile ? 'bg-black px-5 py-4 pb-8' : 'bg-white dark:bg-neutral-800 px-6 py-5'
        }`}
      >
        {/* Stats */}
        {/* <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <Heart size={16} className={`${isMobile ? 'text-white/60' : 'text-neutral-400'}`} />
            <span
              className={`text-sm font-medium ${
                isMobile ? 'text-white/70' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {work. ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={16} className={`${isMobile ? 'text-white/60' : 'text-neutral-400'}`} />
            <span
              className={`text-sm font-medium ${
                isMobile ? 'text-white/70' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {work.views ?? 0}
            </span>
          </div>
          <span className={`text-xs ml-auto ${isMobile ? 'text-white/40' : 'text-neutral-400'}`}>
            {new Date(work.createdAt).toLocaleDateString('en-NG', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div> */}

        {/* Caption */}
        <p
          className={`text-sm leading-relaxed ${
            isMobile ? 'text-white/90' : 'text-neutral-700 dark:text-neutral-300'
          }`}
        >
          {work?.description ?? ''}
        </p>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={() => onDelete(workId)}
            disabled={isDeleting}
            className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
              isMobile
                ? 'bg-white/10 text-red-400 hover:bg-white/15'
                : 'bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
            }`}
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN FEATURED WORKS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface FeaturedWorksProps {
  ownerType: FeaturedWorkOwnerType;
  ownerId: string;
  /** Whether the current user owns this profile — controls add/delete */
  isOwnProfile?: boolean;
}

const FeaturedWorks: React.FC<FeaturedWorksProps> = ({
  ownerType,
  ownerId,
  isOwnProfile = false,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Backend hooks ───────────────────────────────────────────────────

  const {
    featuredWorks,
    featuredWorksTotal,
    isLoadingWorks,
    isCreatingWork,
    isDeletingWork,
    createFeaturedWork,
    deleteFeaturedWork,
    refetchWorks,
    refetchCount,
  } = useFeaturedWorks({
    fetchWorks: !!(ownerType && ownerId),
    fetchCount: !!(ownerType && ownerId),
    ownerType,
    ownerId,
  });

  const { uploadImages, isUploadingGeneralMultiple } = useMedia();

  const isSubmitting = isUploadingGeneralMultiple || isCreatingWork;

  // ── Upload flow state ───────────────────────────────────────────────

  // Holds local base64 previews + corresponding File objects
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // ── Detail view state ───────────────────────────────────────────────

  const [selectedWork, setSelectedWork] = useState<FeaturedWork | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // ── File input handler ──────────────────────────────────────────────

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (files.length > 5) {
      antMessage.warning('You can upload up to 5 images at a time');
      return;
    }

    const selected = files.slice(0, 5);

    // Read base64 previews for the upload screen
    const readPromises = selected.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readPromises).then((previews) => {
      setUploadPreviews(previews);
      setUploadFiles(selected);
      setIsUploadOpen(true);
    });

    // Deferred reset
    const input = e.target;
    requestAnimationFrame(() => {
      if (input) input.value = '';
    });
  }, []);

  const handleRemoveUploadImage = (index: number) => {
    setUploadPreviews((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setIsUploadOpen(false);
      return next;
    });
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Submit: upload images → create featured work ────────────────────

  const handleSubmitWork = async (caption: string) => {
    if (uploadFiles.length === 0) return;

    try {
      // 1. Upload files to get Cloudinary URLs
      const urls = await uploadImages(uploadFiles, true);

      if (!urls || urls.length === 0) {
        antMessage.error('Failed to upload images');
        return;
      }

      // 2. Create featured work with the uploaded URLs
      await createFeaturedWork({
        ownerType,
        ownerId,
        images: urls,
        description: caption,
      });

      // 3. Cleanup & refetch
      setUploadPreviews([]);
      setUploadFiles([]);
      setIsUploadOpen(false);
      refetchWorks();
      refetchCount();
    } catch {
      // Errors handled by RTK mutation (toast shown by service layer)
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────

  const handleDeleteWork = (id: string) => {
    Modal.confirm({
      title: 'Delete Featured Work',
      content: 'Are you sure you want to delete this featured work? This cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      zIndex: 20000,
      onOk: async () => {
        try {
          await deleteFeaturedWork(id);
          setIsDetailOpen(false);
          setSelectedWork(null);
          refetchWorks();
          refetchCount();
        } catch {
          // Errors handled by RTK
        }
      },
    });
  };

  // ── Detail view handlers ────────────────────────────────────────────

  const handleOpenDetail = (work: FeaturedWork) => {
    setSelectedWork(work);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedWork(null);
  };

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════

  return (
    <div className={`${isMobile ? 'px-0' : 'p-4'}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        tabIndex={-1}
      />

      {/* Header */}
      <div className={`flex items-center justify-between ${isMobile ? 'mb-3 px-4' : 'mb-5'}`}>
        <div>
          <h2
            className={`${
              isMobile ? 'text-base' : 'text-xl'
            } font-bold text-neutral-900 dark:text-white flex items-center gap-2`}
          >
            Featured Works
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {featuredWorksTotal} work{featuredWorksTotal !== 1 ? 's' : ''}
          </p>
        </div>
        {isOwnProfile && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className={`bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-md shadow-blue/20 hover:shadow-lg transition-all ${
              isMobile ? 'py-1.5 px-3 text-xs' : 'py-2.5 px-5 text-sm'
            }`}
          >
            <Plus size={isMobile ? 14 : 16} />
            {isMobile ? 'Add' : 'Add Work'}
          </motion.button>
        )}
      </div>

      {/* Loading state */}
      {isLoadingWorks ? (
        <div
          className={`grid gap-1 ${isMobile ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-4 gap-2'}`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-sm animate-pulse"
            />
          ))}
        </div>
      ) : featuredWorks.length === 0 ? (
        /* Empty state */
        <div className={`text-center py-20 ${isMobile ? 'px-4' : ''}`}>
          <div className="w-20 h-20 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} className="text-neutral-200 dark:text-neutral-700" />
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            No featured works yet
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {isOwnProfile
              ? 'Showcase your best handmade creations here'
              : "This creator hasn't added any featured works yet"}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 text-sm font-semibold text-blue hover:text-indigo-600 transition-colors"
            >
              Upload your first work
            </button>
          )}
        </div>
      ) : (
        /* Grid */
        <div
          className={`grid gap-1 ${isMobile ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-4 gap-2'}`}
        >
          {featuredWorks.map((work, index) => {
            const images = work.images || [];
            return (
              <motion.div
                key={work._id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => handleOpenDetail(work)}
                className="relative aspect-square cursor-pointer group overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-sm"
              >
                <img
                  src={images[0]}
                  alt={work?.description ?? ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Multi-image indicator */}
                {images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-1 rounded-md">
                    <Layers size={14} className="text-white" />
                  </div>
                )}

                {/* Hover overlay */}
                {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1.5">
                      <Heart size={16} className="fill-white" />
                      <span className="text-sm font-semibold">{work.likes ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye size={16} />
                      <span className="text-sm font-semibold">{work.views ?? 0}</span>
                    </div>
                  </div>
                </div> */}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* UPLOAD SCREEN — mobile: full-screen, desktop: modal              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isMobile ? (
        <AnimatePresence>
          {isUploadOpen && uploadPreviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-0 z-[300] bg-black"
            >
              <CaptionUploadScreen
                images={uploadPreviews}
                onSubmit={handleSubmitWork}
                onBack={() => {
                  if (isSubmitting) return;
                  setUploadPreviews([]);
                  setUploadFiles([]);
                  setIsUploadOpen(false);
                }}
                onRemoveImage={handleRemoveUploadImage}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <Modal
          open={isUploadOpen && uploadPreviews.length > 0}
          onCancel={() => {
            if (isSubmitting) return;
            setUploadPreviews([]);
            setUploadFiles([]);
            setIsUploadOpen(false);
          }}
          footer={null}
          width={560}
          closable={false}
          maskClosable={!isSubmitting}
          className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden [&_.ant-modal-content]:!p-0 [&_.ant-modal-body]:!p-0"
        >
          <div className="h-[80vh]">
            <CaptionUploadScreen
              images={uploadPreviews}
              onSubmit={handleSubmitWork}
              onBack={() => {
                if (isSubmitting) return;
                setUploadPreviews([]);
                setUploadFiles([]);
                setIsUploadOpen(false);
              }}
              onRemoveImage={handleRemoveUploadImage}
              isSubmitting={isSubmitting}
            />
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DETAIL VIEW — mobile: full-screen, desktop: modal                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {selectedWork && (
        <>
          {isMobile ? (
            <AnimatePresence>
              {isDetailOpen && (
                <motion.div
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="fixed inset-0 z-[200] bg-black flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-black/80 backdrop-blur-sm flex-shrink-0">
                    <button
                      onClick={handleCloseDetail}
                      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                    >
                      <ArrowLeft size={18} />
                      <span className="text-sm font-medium">Back</span>
                    </button>
                    <button
                      onClick={handleCloseDetail}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <WorkDetailView
                      work={selectedWork}
                      onClose={handleCloseDetail}
                      onDelete={isOwnProfile ? handleDeleteWork : undefined}
                      isDeleting={isDeletingWork}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <Modal
              open={isDetailOpen}
              onCancel={handleCloseDetail}
              footer={null}
              width={640}
              closable={false}
              className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden [&_.ant-modal-content]:!p-0 [&_.ant-modal-body]:!p-0"
            >
              <div className="relative">
                <button
                  onClick={handleCloseDetail}
                  className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
                <WorkDetailView
                  work={selectedWork}
                  onClose={handleCloseDetail}
                  onDelete={isOwnProfile ? handleDeleteWork : undefined}
                  isDeleting={isDeletingWork}
                />
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedWorks;

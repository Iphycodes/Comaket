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
  Heart,
  Eye,
  Send,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface FeaturedWork {
  id: string;
  images: string[]; // base64 or URLs
  caption: string;
  createdAt: string;
  likes: number;
  views: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const mockFeaturedWorks: FeaturedWork[] = [
  {
    id: 'fw-1',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
    ],
    caption:
      'Custom sneaker restoration — brought these classics back to life with a fresh colorway and premium materials ✨',
    createdAt: '2025-02-15T10:00:00Z',
    likes: 47,
    views: 312,
  },
  {
    id: 'fw-2',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'],
    caption: 'Minimalist watch face design — less is more 🕐',
    createdAt: '2025-02-10T14:30:00Z',
    likes: 23,
    views: 189,
  },
  {
    id: 'fw-3',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
    ],
    caption: 'Custom headphone mod — wood grain cups with gold accents. Handcrafted over 3 weeks.',
    createdAt: '2025-02-05T09:00:00Z',
    likes: 89,
    views: 567,
  },
  {
    id: 'fw-4',
    images: [
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&h=600&fit=crop',
    ],
    caption:
      'Full custom Air Max build from scratch — every panel hand-cut and stitched. My most ambitious project yet 🔥',
    createdAt: '2025-01-28T16:00:00Z',
    likes: 156,
    views: 1024,
  },
  {
    id: 'fw-5',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop'],
    caption: 'UV reactive lens tint — changes color in sunlight ☀️',
    createdAt: '2025-01-20T11:00:00Z',
    likes: 34,
    views: 245,
  },
  {
    id: 'fw-6',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1554941829-202a0b2a3b46?w=600&h=600&fit=crop',
    ],
    caption: 'Vintage Polaroid camera restoration — fully functional again after 30 years 📸',
    createdAt: '2025-01-15T08:30:00Z',
    likes: 72,
    views: 430,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CAPTION UPLOAD SCREEN (WhatsApp-style)
// ═══════════════════════════════════════════════════════════════════════════

interface CaptionUploadScreenProps {
  images: string[];
  onSubmit: (caption: string) => void;
  onBack: () => void;
  onRemoveImage: (index: number) => void;
}

const MAX_CAPTION_LENGTH = 280;

const CaptionUploadScreen: React.FC<CaptionUploadScreenProps> = ({
  images,
  onSubmit,
  onBack,
  onRemoveImage,
}) => {
  const [caption, setCaption] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
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
            className="absolute top-3 right-3 w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
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
      <div className="px-4 py-4 bg-gradient-to-t from-black via-black/95 to-black/80">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={caption}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CAPTION_LENGTH) setCaption(e.target.value);
              }}
              placeholder="Add a caption..."
              rows={2}
              className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/40 rounded-2xl px-4 py-3 text-sm resize-none border border-white/10 focus:border-white/30 focus:outline-none transition-colors"
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
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue to-indigo-500 flex items-center justify-center shadow-lg shadow-blue/30 hover:shadow-xl hover:scale-105 transition-all flex-shrink-0"
          >
            <Send size={18} className="text-white ml-0.5" />
          </button>
        </div>
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
}

const WorkDetailView: React.FC<WorkDetailViewProps> = ({ work, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery(mediaSize.mobile);

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
            src={work.images[currentIndex]}
            alt={work.caption}
            className={`${isMobile ? 'max-w-full max-h-full' : 'w-full h-full'} object-contain`}
          />
        </AnimatePresence>

        {/* Nav arrows */}
        {work.images.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex((p) => p - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
            )}
            {currentIndex < work.images.length - 1 && (
              <button
                onClick={() => setCurrentIndex((p) => p + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            )}
          </>
        )}

        {/* Counter */}
        {work.images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <span className="text-white text-xs font-medium">
              {currentIndex + 1}/{work.images.length}
            </span>
          </div>
        )}

        {/* Dots */}
        {work.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {work.images.map((_, i) => (
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
          isMobile ? 'bg-black px-5 py-4 pb-8' : 'bg-white dark:bg-gray-800 px-6 py-5'
        }`}
      >
        {/* Stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <Heart size={16} className={`${isMobile ? 'text-white/60' : 'text-gray-400'}`} />
            <span
              className={`text-sm font-medium ${
                isMobile ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {work.likes}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={16} className={`${isMobile ? 'text-white/60' : 'text-gray-400'}`} />
            <span
              className={`text-sm font-medium ${
                isMobile ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {work.views}
            </span>
          </div>
          <span className={`text-xs ml-auto ${isMobile ? 'text-white/40' : 'text-gray-400'}`}>
            {new Date(work.createdAt).toLocaleDateString('en-NG', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Caption */}
        <p
          className={`text-sm leading-relaxed ${
            isMobile ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {work.caption}
        </p>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={() => onDelete(work.id)}
            className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isMobile
                ? 'bg-white/10 text-red-400 hover:bg-white/15'
                : 'bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
            }`}
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN FEATURED WORKS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const FeaturedWorks: React.FC = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [works, setWorks] = useState<FeaturedWork[]>(mockFeaturedWorks);

  // Upload flow
  const [uploadImages, setUploadImages] = useState<string[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Detail view
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

    const readPromises = files.slice(0, 5).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readPromises).then((results) => {
      setUploadImages(results);
      setIsUploadOpen(true);
    });

    // Deferred reset
    const input = e.target;
    requestAnimationFrame(() => {
      if (input) input.value = '';
    });
  }, []);

  const handleRemoveUploadImage = (index: number) => {
    setUploadImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        setIsUploadOpen(false);
      }
      return next;
    });
  };

  const handleSubmitWork = (caption: string) => {
    const newWork: FeaturedWork = {
      id: `fw-${Date.now()}`,
      images: uploadImages,
      caption,
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
    };
    setWorks((prev) => [newWork, ...prev]);
    setUploadImages([]);
    setIsUploadOpen(false);
    antMessage.success('Featured work added!');
  };

  const handleDeleteWork = (id: string) => {
    Modal.confirm({
      title: 'Delete Featured Work',
      content: 'Are you sure you want to delete this featured work? This cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      zIndex: 20000,
      onOk: () => {
        setWorks((prev) => prev.filter((w) => w.id !== id));
        setIsDetailOpen(false);
        setSelectedWork(null);
        antMessage.success('Deleted');
      },
    });
  };

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
    <div className={`${isMobile ? 'px-0' : ''}`}>
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
      <div className={`flex items-center justify-between mb-5 ${isMobile ? 'px-4' : ''}`}>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            Featured Works
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {works.length} work{works.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white py-2 px-4 rounded-xl font-semibold flex items-center gap-1.5 text-sm shadow-md shadow-blue/20 hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          {isMobile ? 'Add' : 'Add Work'}
        </motion.button>
      </div>

      {/* Grid */}
      {works.length === 0 ? (
        <div className={`text-center py-20 ${isMobile ? 'px-4' : ''}`}>
          <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} className="text-gray-200 dark:text-gray-700" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            No featured works yet
          </p>
          <p className="text-xs text-gray-400 mt-1">Showcase your best handmade creations here</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 text-sm font-semibold text-blue hover:text-indigo-600 transition-colors"
          >
            Upload your first work
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-1 ${isMobile ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-4 gap-2'}`}
        >
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => handleOpenDetail(work)}
              className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-sm"
            >
              <img
                src={work.images[0]}
                alt={work.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Multi-image indicator */}
              {work.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-1 rounded-md">
                  <Layers size={14} className="text-white" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-4 text-white">
                  <div className="flex items-center gap-1.5">
                    <Heart size={16} className="fill-white" />
                    <span className="text-sm font-semibold">{work.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={16} />
                    <span className="text-sm font-semibold">{work.views}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* UPLOAD SCREEN — mobile: full-screen, desktop: modal              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isMobile ? (
        <AnimatePresence>
          {isUploadOpen && uploadImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-0 z-[300] bg-black"
            >
              <CaptionUploadScreen
                images={uploadImages}
                onSubmit={handleSubmitWork}
                onBack={() => {
                  setUploadImages([]);
                  setIsUploadOpen(false);
                }}
                onRemoveImage={handleRemoveUploadImage}
              />
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <Modal
          open={isUploadOpen && uploadImages.length > 0}
          onCancel={() => {
            setUploadImages([]);
            setIsUploadOpen(false);
          }}
          footer={null}
          width={560}
          closable={false}
          className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden [&_.ant-modal-content]:!p-0 [&_.ant-modal-body]:!p-0"
        >
          <div className="h-[80vh]">
            <CaptionUploadScreen
              images={uploadImages}
              onSubmit={handleSubmitWork}
              onBack={() => {
                setUploadImages([]);
                setIsUploadOpen(false);
              }}
              onRemoveImage={handleRemoveUploadImage}
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
                  className="fixed inset-0 z-[200] bg-black flex flex-col pt-10"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm flex-shrink-0">
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
                      onDelete={handleDeleteWork}
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
                  onDelete={handleDeleteWork}
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

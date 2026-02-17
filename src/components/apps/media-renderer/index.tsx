import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { MediaItem } from '@grc/_shared/namespace';

interface MediaRendererProps {
  media: MediaItem;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  /** If true, show a static thumbnail with play icon overlay (for grid cards) */
  thumbnailMode?: boolean;
  onClick?: () => void;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({
  media,
  alt,
  fill = true,
  className = '',
  priority = false,
  thumbnailMode = false,
  onClick,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  if (media.type === 'image') {
    return (
      <Image
        src={media.url}
        alt={alt}
        fill={fill}
        className={`object-cover ${className}`}
        priority={priority}
        onClick={onClick}
      />
    );
  }

  // Video — thumbnail mode (grid cards): show poster with play icon
  if (thumbnailMode) {
    const posterUrl = media.thumbnail || '';
    return (
      <div className="relative w-full h-full cursor-pointer" onClick={onClick}>
        {posterUrl ? (
          <Image src={posterUrl} alt={alt} fill className={`object-cover ${className}`} />
        ) : (
          <video
            src={media.url}
            className={`w-full h-full object-cover ${className}`}
            muted
            preload="metadata"
          />
        )}
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play size={18} className="text-gray-800 ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>
    );
  }

  // Video — full playback mode (list view / detail modal)
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="relative w-full h-full bg-black" onClick={onClick}>
      <video
        ref={videoRef}
        src={media.url}
        poster={media.thumbnail}
        className={`w-full h-full object-contain ${className}`}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          {isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} className="ml-0.5" fill="currentColor" />
          )}
        </button>
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Video badge */}
      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
        VIDEO
      </div>

      {/* Big play button when paused */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Play size={24} className="text-white ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaRenderer;

/**
 * Helper: get the first image URL from a media array (for thumbnails, cart, og:image, etc.)
 */
export const getFirstImageUrl = (media: MediaItem[]): string => {
  const firstImage = media.find((m) => m.type === 'image');
  if (firstImage) return firstImage.url;
  // Fallback to video thumbnail
  const firstVideo = media.find((m) => m.type === 'video');
  return firstVideo?.thumbnail || firstVideo?.url || '';
};

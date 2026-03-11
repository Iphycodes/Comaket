import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

interface MobileOverlayProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  zIndex?: number;
  children: React.ReactNode;
}

const MobileOverlay: React.FC<MobileOverlayProps> = ({
  open,
  onClose,
  title,
  zIndex = 200,
  children,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`fixed inset-0 bg-white dark:bg-neutral-900 flex flex-col overflow-hidden ${
            isMobile ? 'pt-10' : ''
          }`}
          style={{ zIndex }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">{title || 'Back'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
            >
              <X size={16} className="text-neutral-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileOverlay;

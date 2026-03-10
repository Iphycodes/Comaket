import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Drawer } from 'antd';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  children: React.ReactNode;
}

const OrderDrawer: React.FC<OrderDrawerProps> = ({ isOpen, onClose, isMobile, children }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          /> */}

          {isMobile ? (
            /* Mobile: Full-screen bottom sheet */
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 top-10 z-[61] bg-white dark:bg-neutral-900 rounded-t-2xl overflow-hidden flex flex-col"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              </div>

              {/* Close button */}
              <div className="flex items-center justify-between px-5 py-2 flex-shrink-0">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Order Details
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X size={18} className="text-neutral-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
            </motion.div>
          ) : (
            /* Desktop: Right-side drawer */
            <Drawer
              open={isOpen}
              onClose={onClose}
              title={null}
              width={540}
              className="[&_.ant-drawer-body]:!p-0 [&_.ant-drawer-body]:!flex [&_.ant-drawer-body]:!flex-col [&_.ant-drawer-body]:!overflow-hidden"
              closeIcon={null}
            >
              {/* Header - fixed */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Order Details
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X size={18} className="text-neutral-400" />
                </button>
              </div>

              {/* Content - scrollable */}
              <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
            </Drawer>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDrawer;

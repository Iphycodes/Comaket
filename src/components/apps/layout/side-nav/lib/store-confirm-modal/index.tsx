import { message, Modal } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle, Store, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { motion } from 'framer-motion';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

interface StoreConfirmModalProps {
  showConfirm: boolean;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue/10 to-indigo-500/10 blur-2xl"
    />
    <motion.div
      animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 blur-2xl"
    />
    <motion.div
      animate={{ x: [0, 10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      className="absolute top-1/3 -left-6 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/8 to-orange-400/8 blur-xl"
    />
  </div>
);

const StoreConfirmModal = ({ showConfirm, setShowConfirm }: StoreConfirmModalProps) => {
  const { push } = useRouter();
  const isMobile = useMediaQuery(mediaSize.mobile);

  const renderView = () => {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue/20">
          <Store size={28} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
          Ready to Create a new Store?
        </h3>
        <p className="text-sm text-neutral-500 mt-2 leading-relaxed max-w-[300px] mx-auto">
          You&apos;ll have the ability to list products, sell online and offline, track orders,
          receive reviews and lot's more.
        </p>

        <div className="space-y-3 mt-6 text-left bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
          {[
            'Create your store with a custom name & branding',
            'List products for sale with multiple images',
            'Showcase featured handmade works',
            'Receive and manage buyer reviews',
            'Access seller analytics and insights',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-neutral-600 dark:text-neutral-300">{item}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors"
          >
            Not Now
          </button>
          <button
            onClick={() => {
              push('/creator-store/setup');
              setShowConfirm(false);
              message.info('Redirecting you to set up your creator store...', 3);
            }}
            className="flex-1 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue to-indigo-500 text-white shadow-md hover:shadow-lg transition-all"
          >
            Let&apos;s Go!
          </button>
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[10000] bg-white dark:bg-neutral-900 flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-sm font-semibold text-neutral-400">Create new Store</span>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X size={18} className="text-neutral-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 relative">
              <FloatingShapes />
              <div className="relative z-10">{renderView()}</div>
            </div>

            {/* Bottom brand */}
            <div className="px-5 py-4 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-center text-[11px] text-neutral-400">
                By continuing, you agree to Comaket&apos;s Terms of Service & Privacy Policy
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {showConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center !w-[100vw]">
          <Modal
            open={showConfirm}
            onCancel={() => setShowConfirm(false)}
            footer={null}
            width={420}
            className="[&_.ant-modal-content]:!rounded-2xl"
            zIndex={20000}
          >
            {renderView()}
          </Modal>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StoreConfirmModal;

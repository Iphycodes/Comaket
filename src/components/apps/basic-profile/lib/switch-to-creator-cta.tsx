import React, { useState } from 'react';
import { Modal, message as antMessage } from 'antd';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Shield, Sparkles, Store, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SwitchToCreatorCTAProps {
  isMobile: boolean;
}

const SwitchToCreatorCTA: React.FC<SwitchToCreatorCTAProps> = ({ isMobile }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { push } = useRouter();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isMobile ? 'mx-4' : ''} mb-6`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-blue to-cyan-500 p-[1px]">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue/5 to-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/5 to-blue/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue/20">
                  <Store size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Become a Creator
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Start selling your products and showcase your handmade creations to thousands of
                    buyers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: <TrendingUp size={16} />, label: 'Sell Products' },
                  { icon: <Sparkles size={16} />, label: 'Showcase Work' },
                  { icon: <Shield size={16} />, label: 'Get Verified' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
                  >
                    <span className="text-blue">{item.icon}</span>
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 text-center">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Switch to Creator Account
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <Modal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        footer={null}
        width={420}
        className="[&_.ant-modal-content]:!rounded-2xl"
        zIndex={20000}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue/20">
            <Store size={28} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Ready to become a Creator?
          </h3>
          <p className="text-sm text-neutral-500 mt-2 leading-relaxed max-w-[300px] mx-auto">
            You&apos;ll unlock the ability to list products, showcase featured works, receive
            reviews, and build your store.
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
                push('/creator-account/setup');
                setShowConfirm(false);
                antMessage.success("You'll be redirected to set up your creator account.");
              }}
              className="flex-1 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue to-indigo-500 text-white shadow-md hover:shadow-lg transition-all"
            >
              Let&apos;s Go!
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SwitchToCreatorCTA;

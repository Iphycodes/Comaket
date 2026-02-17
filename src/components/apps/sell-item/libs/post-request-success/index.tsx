'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ArrowRight, Store, Handshake, BadgeDollarSign } from 'lucide-react';
import { getSellingModelLabel, SellingModel } from '@grc/_shared/namespace/sell-item';

interface Props {
  itemName?: string;
  itemId: string | number;
  onClose: () => void;
  onTrackStatus: (id: string | number) => void;
  type: 'new' | 'update';
  sellingModel?: SellingModel;
}

const modelMessages: Record<SellingModel, { nextSteps: string[]; timeline: string }> = {
  'self-listing': {
    nextSteps: [
      'Our team will review your listing within 24 hours',
      "Once approved, you'll be prompted to pay the listing fee",
      'After payment, your item goes live on the marketplace',
    ],
    timeline: 'Review typically takes 12–24 hours',
  },
  consignment: {
    nextSteps: [
      'Our team will review your item within 24 hours',
      "Once approved, we'll contact you to arrange product handover",
      "After receiving your item, we'll photograph and list it",
    ],
    timeline: 'Review typically takes 12–24 hours, listing within 48 hours of receiving the item',
  },
  'direct-sale': {
    nextSteps: [
      'Our team will review your item within 24 hours',
      "We'll send you a price offer based on current market value",
      'You can accept, counter, or decline our offer',
    ],
    timeline: "You'll receive an offer within 24–48 hours",
  },
};

const modelIcons: Record<SellingModel, React.ElementType> = {
  'self-listing': Store,
  consignment: Handshake,
  'direct-sale': BadgeDollarSign,
};

export const PostRequestSuccessful: React.FC<Props> = ({
  itemName,
  itemId,
  onClose,
  onTrackStatus,
  type,
  sellingModel,
}) => {
  const msgs = sellingModel ? modelMessages[sellingModel] : null;
  const ModelIcon = sellingModel ? modelIcons[sellingModel] : CheckCircle2;

  return (
    <div className="flex flex-col items-center text-center py-6 px-4">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5"
      >
        <CheckCircle2 size={40} className="text-white" strokeWidth={2.5} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
      >
        {type === 'new' ? 'Submitted Successfully!' : 'Updated Successfully!'}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-gray-500 dark:text-gray-400 max-w-sm"
      >
        {type === 'new' ? (
          <>
            {itemName && <strong>"{itemName}"</strong>} has been submitted for review
            {sellingModel && (
              <>
                {' '}
                via <strong>{getSellingModelLabel(sellingModel)}</strong>
              </>
            )}
            .
          </>
        ) : (
          <>
            Your changes to {itemName && <strong>"{itemName}"</strong>} have been saved and are now
            under review.
          </>
        )}
      </motion.p>

      {/* Selling model badge */}
      {sellingModel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <ModelIcon size={16} />
          {getSellingModelLabel(sellingModel)}
        </motion.div>
      )}

      {/* Next steps */}
      {msgs && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 w-full max-w-sm"
        >
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 text-left">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              What happens next?
            </h4>
            <div className="space-y-3">
              {msgs.nextSteps.map((step, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400">
              <Clock size={12} />
              <span>{msgs.timeline}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-2 mt-6 w-full max-w-sm"
      >
        <button
          onClick={() => onTrackStatus(itemId)}
          className="w-full py-3 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          Track Status <ArrowRight size={16} />
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-sm font-medium transition-colors"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

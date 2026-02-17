import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

interface ComingSoonProps {
  header: ReactNode | ReactNode[];
}

const ComingSoon = ({ header }: ComingSoonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-6 text-center space-y-4"
    >
      {header}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="text-blue dark:text-blue"
      >
        <Timer size={48} />
      </motion.div>

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-gray-200"
        animate={{ opacity: [0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      >
        Coming Soon
      </motion.h3>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        We're working on something exciting! Stay tuned for updates.
      </p>
    </motion.div>
  );
};

export default ComingSoon;

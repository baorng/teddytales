import React from 'react';
import { motion } from 'framer-motion';

export const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <motion.div
          className="w-24 h-24 border-8 border-primary-purple/20 border-t-primary-purple rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ✨
        </motion.div>
      </div>
      
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Creating Your Story...</h3>
        <p className="text-gray-600">The magic is happening! ✨</p>
      </motion.div>
    </div>
  );
};
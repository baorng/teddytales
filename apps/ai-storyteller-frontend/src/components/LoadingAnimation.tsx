import React from 'react';
import { motion } from 'framer-motion';

export const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <motion.div
          className="w-28 h-28 border-8 border-earth-200 border-t-sunset-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-4xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.div>
      </div>
      
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-3xl font-bold text-earth-800 mb-3 heading-handwritten">
          Weaving Your Tale...
        </h3>
        <p className="text-lg text-earth-600 font-display">
          The pages are turning, magic is brewing ✨
        </p>
      </motion.div>
    </div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { PenTool } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 text-nature-400"
        >
          <PenTool className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-nature-400 rounded-full"
        />
      </div>
    </div>
  );
}
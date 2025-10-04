import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const AgeBanner = () => {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="age-banner text-white text-center py-2 px-4 relative z-50"
    >
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle size={16} className="animate-pulse" />
        <span className="font-semibold text-sm">
          ⚠️ 18+ ONLY - This platform contains cryptocurrency content
        </span>
        <AlertTriangle size={16} className="animate-pulse" />
      </div>
    </motion.div>
  );
};

export default AgeBanner;

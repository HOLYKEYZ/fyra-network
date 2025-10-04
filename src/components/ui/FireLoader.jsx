import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const FireLoader = ({ 
  percentage = 0, 
  size = 'md', 
  showPercentage = true, 
  text = 'Loading...',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Circular Progress Container */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full border-4 border-dark-700"></div>
        
        {/* Progress Circle */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-fire-500 border-r-fire-400"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, transparent ${360 - (percentage * 3.6)}deg, #ef4444 ${360 - (percentage * 3.6)}deg, #dc2626 100%)`
          }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Glow Effect */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-fire-500/20 to-transparent"
          animate={{
            boxShadow: [
              "0 0 20px rgba(239, 68, 68, 0.3)",
              "0 0 40px rgba(239, 68, 68, 0.6)",
              "0 0 20px rgba(239, 68, 68, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-fire-500"
          >
            <Flame size={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 40 : 48} />
          </motion.div>
        </div>
        
        {/* Percentage Text */}
        {showPercentage && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <motion.span
              className={`font-bold text-fire-500 ${textSizeClasses[size]}`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {Math.round(percentage)}%
            </motion.span>
          </div>
        )}
      </div>
      
      {/* Loading Text */}
      {text && (
        <motion.p
          className={`mt-4 text-dark-300 ${textSizeClasses[size]} text-center`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
      
      {/* Fire Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-fire-400 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, -40],
              opacity: [1, 0.8, 0],
              scale: [1, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FireLoader;

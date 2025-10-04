import React from 'react';
import { motion } from 'framer-motion';

const EntryAnimation = () => {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center overflow-hidden relative">
      {/* Enhanced background with fire particles */}
      <div className="absolute inset-0 -z-10">
        {/* Large fire particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-fire-400 to-fire-600 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, -300],
              opacity: [1, 0.8, 0],
              scale: [1, 1.5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Small ember particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`ember-${i}`}
            className="absolute w-1 h-1 bg-fire-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, -160],
              opacity: [0.8, 1, 0],
              scale: [0.5, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Main logo with 720° rotation animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.1, 1],
            opacity: [0, 1, 1],
            rotate: [0, 720] // 720° rotation (2 full turns)
          }}
          transition={{ 
            duration: 4, 
            ease: "easeInOut",
            times: [0, 0.3, 1]
          }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glow effect behind logo */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-fire-500/30 via-fire-400/40 to-fire-600/30 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* FYRA Logo Image with shake effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0] // Subtle shake
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative w-32 h-32 mx-auto"
            >
              <img 
                src="/splash.png" 
                alt="FYRA Network Logo" 
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(255, 90, 20, 0.6))'
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Subtitle with enhanced styling */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-2xl md:text-3xl text-dark-300 mb-4 font-medium"
        >
          Fyra Token Network
        </motion.p>

        {/* Tagline with fire effect */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-lg text-dark-400 max-w-md mx-auto leading-relaxed"
        >
          Mine, earn, and grow with the power of{' '}
          <span className="flame-text font-semibold">fyra</span>
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="mt-12"
        >
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-dark-400 text-sm mt-4">Igniting the network...</p>
        </motion.div>

        {/* Additional fire effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-2 h-2 bg-gradient-to-r from-fire-400 to-fire-600 rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                y: [0, -100, -200],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EntryAnimation;

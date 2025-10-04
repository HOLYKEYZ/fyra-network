import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Zap } from 'lucide-react';
import FireCard from './FireCard';
import FireButton from './FireButton';

const AdTrigger = ({ isOpen, onClose, onAdComplete }) => {
  const [adTimer, setAdTimer] = useState(8);
  const [adWatched, setAdWatched] = useState(false);

  useEffect(() => {
    if (isOpen && adTimer > 0) {
      const timer = setInterval(() => {
        setAdTimer(prev => {
          if (prev <= 1) {
            setAdWatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, adTimer]);

  const handleAdComplete = () => {
    onAdComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <FireCard variant="fire" glow className="p-8 text-center relative overflow-hidden max-w-md w-full">
          {/* Fire particles in modal */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-fire-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, -40],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <Play className="w-16 h-16 text-fire-500 mx-auto" />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Watch Advertisement</h3>
            <p className="text-dark-300 mb-6">
              Watch this ad to start your mining session and earn 36 FIRE tokens
            </p>
            
            <div className="bg-dark-800/50 rounded-xl p-6 mb-6 border border-dark-700">
              <div className="text-3xl font-bold flame-text mb-3">
                {adTimer}s
              </div>
              <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-fire-500 to-fire-600 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(adTimer / 8) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
              <p className="text-dark-400 text-sm mt-2">
                {adWatched ? 'Ad completed!' : 'Please wait...'}
              </p>
            </div>
            
            {adWatched ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FireButton
                  onClick={handleAdComplete}
                  variant="glow"
                  size="lg"
                  className="w-full"
                >
                  <Zap className="w-5 h-5" />
                  Start Mining Session
                </FireButton>
              </motion.div>
            ) : (
              <div className="text-dark-300 text-sm">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse"></div>
                  <span>Watching advertisement...</span>
                </div>
                <p className="text-xs text-dark-400">
                  This will unlock your 24-hour mining cycle
                </p>
              </div>
            )}
            
            <FireButton
              onClick={onClose}
              variant="outline"
              size="sm"
              className="mt-4"
              disabled={!adWatched}
            >
              <X size={16} />
              Close
            </FireButton>
          </div>
        </FireCard>
      </motion.div>
    </div>
  );
};

export default AdTrigger;

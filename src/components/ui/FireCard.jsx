import React from 'react';
import { motion } from 'framer-motion';

const FireCard = ({ 
  children, 
  variant = 'default',
  glow = false,
  hover = true,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "rounded-xl border transition-all duration-300";
  
  const variants = {
    default: "bg-dark-900 border-dark-800 shadow-xl",
    elevated: "bg-dark-900 border-dark-700 shadow-2xl",
    gradient: "bg-gradient-to-br from-dark-900 to-dark-800 border-dark-700 shadow-xl",
    fire: "bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 border-fire-500/30 shadow-xl",
    glass: "bg-dark-900/50 backdrop-blur-md border-dark-700/50 shadow-xl"
  };
  
  const glowClasses = glow ? "shadow-fire-500/20 hover:shadow-fire-500/40" : "";
  const hoverClasses = hover ? "hover:border-fire-500/50 hover:shadow-lg hover:shadow-fire-500/10" : "";
  
  return (
    <motion.div
      className={`${baseClasses} ${variants[variant]} ${glowClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -2, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      {...props}
    >
      {/* Gradient border effect for fire variant */}
      {variant === 'fire' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-fire-500/20 via-transparent to-fire-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Content */}
      <div className="relative p-6">
        {children}
      </div>
      
      {/* Fire particles for fire variant */}
      {variant === 'fire' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-fire-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -15, -30],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FireCard;

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const FireButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = "relative font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 transform hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-fire-500 to-fire-600 hover:from-fire-600 hover:to-fire-700 text-white shadow-lg hover:shadow-fire-500/25 focus:ring-fire-500",
    secondary: "bg-dark-800 hover:bg-dark-700 text-white border border-dark-600 hover:border-dark-500 focus:ring-dark-500",
    outline: "border-2 border-fire-500 text-fire-500 hover:bg-fire-500 hover:text-white focus:ring-fire-500",
    ghost: "text-fire-500 hover:bg-fire-500/10 hover:text-fire-400 focus:ring-fire-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-red-500/25 focus:ring-red-500",
    glow: "bg-gradient-to-r from-fire-400 via-fire-500 to-fire-600 text-white shadow-lg hover:shadow-fire-500/50 focus:ring-fire-500"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };
  
  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed hover:scale-100 active:scale-100" : "";
  
  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      {...props}
    >
      {/* Glow effect for glow variant */}
      {variant === 'glow' && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-fire-400 via-fire-500 to-fire-600 opacity-0"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Content */}
      <div className="relative flex items-center justify-center space-x-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 28} />
          </motion.div>
        )}
        {children}
      </div>
      
      {/* Fire particles for primary and glow variants */}
      {(variant === 'primary' || variant === 'glow') && !disabled && !loading && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-fire-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -10, -20],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
};

export default FireButton;

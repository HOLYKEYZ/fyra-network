import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const FireInput = ({ 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  icon: Icon,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-dark-300 mb-2">
          {label}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400">
            <Icon size={20} />
          </div>
        )}
        
        {/* Input Field */}
        <motion.input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
            ${Icon ? 'pl-12' : ''}
            ${type === 'password' ? 'pr-12' : ''}
            ${isFocused 
              ? 'border-fire-500 bg-dark-800/50 shadow-lg shadow-fire-500/20' 
              : 'border-dark-700 bg-dark-800 hover:border-dark-600'
            }
            ${error 
              ? 'border-red-500 bg-red-900/20' 
              : ''
            }
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'focus:outline-none'
            }
            text-white placeholder-dark-400
          `}
          {...props}
        />
        
        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        
        {/* Focus Glow Effect */}
        {isFocused && !error && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-fire-500/10 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400 flex items-center"
        >
          {error}
        </motion.p>
      )}
      
      {/* Fire particles on focus */}
      {isFocused && !error && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-fire-400 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -10, -20],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FireInput;

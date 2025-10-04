import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Flame, 
  Gift, 
  TrendingUp, 
  Settings, 
  Crown,
  Zap
} from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/rewards', label: 'Rewards', icon: Gift },
    { path: '/mining', label: 'Mining', icon: Flame, isCenter: true },
    { path: '/airdrop', label: 'Airdrop', icon: Zap },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-md border-t border-dark-800">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around relative">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            if (item.isCenter) {
              return (
                <motion.div
                  key={item.path}
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-fire-400 via-fire-500 to-fire-600 opacity-0"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Center button */}
                  <Link
                    to={item.path}
                    className={`
                      relative flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300
                      ${active 
                        ? 'bg-gradient-to-r from-fire-500 to-fire-600 text-white shadow-lg shadow-fire-500/50' 
                        : 'bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-fire-400'
                      }
                    `}
                  >
                    {/* Fire particles */}
                    {active && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-fire-300 rounded-full"
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`,
                            }}
                            animate={{
                              y: [0, -15, -30],
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
                    
                    <motion.div
                      animate={active ? { 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Icon size={24} />
                    </motion.div>
                    
                    <span className="text-xs mt-1 font-medium">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-300
                  ${active 
                    ? 'text-fire-500' 
                    : 'text-dark-400 hover:text-fire-400'
                  }
                `}
              >
                <motion.div
                  animate={active ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Icon size={20} />
                </motion.div>
                <span className="text-xs mt-1 font-medium">
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {active && (
                  <motion.div
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-fire-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;

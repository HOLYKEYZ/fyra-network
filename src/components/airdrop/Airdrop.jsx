import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Gift, Zap, Calendar, Users, Coins } from 'lucide-react';
import FireCard from '../ui/FireCard';
import FireLoader from '../ui/FireLoader';

const Airdrop = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set airdrop date (example: 30 days from now)
  const airdropDate = new Date();
  airdropDate.setDate(airdropDate.getDate() + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = airdropDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const airdropStats = [
    { label: 'Total Airdrop', value: '3B FIRE', icon: Gift, color: 'fire' },
    { label: 'Participants', value: '50K+', icon: Users, color: 'blue' },
    { label: 'Per User', value: '60K FIRE', icon: Coins, color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-8 relative overflow-hidden">
      {/* Enhanced background with fire particles */}
      <div className="absolute inset-0 -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-fire-400 to-fire-600 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120, -240],
              opacity: [0.8, 1, 0],
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
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative mb-8"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-fire-500/30 via-fire-400/40 to-fire-600/30 rounded-3xl blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <h1 className="text-5xl md:text-6xl font-bold flame-text relative z-10">
              Claim Airdrop
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-dark-300 mb-4"
          >
            Coming Soon
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-dark-400 max-w-2xl mx-auto"
          >
            Be among the first to claim your share of 3 billion FIRE tokens
          </motion.p>
        </motion.div>

        {/* Central Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <FireCard variant="fire" glow className="p-12 max-w-lg w-full relative overflow-hidden">
            {/* Fire particles inside card */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-fire-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -25, -50],
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

            <div className="text-center relative z-10">
              {/* Animated Flame/Clock Loader */}
              <div className="relative mb-8">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <FireLoader 
                    percentage={75} 
                    size="xl" 
                    showPercentage={false}
                  />
                  
                  {/* Clock overlay */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Clock className="w-16 h-16 text-fire-500" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Airdrop Countdown</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                        <div className="text-3xl font-bold flame-text mb-1">
                          {item.value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-dark-400">{item.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Status Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center space-x-2 text-fire-400">
                  <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Airdrop in Progress</span>
                </div>
                <p className="text-dark-300 text-sm">
                  Stay tuned for the official launch announcement
                </p>
              </motion.div>
            </div>
          </FireCard>
        </motion.div>

        {/* Airdrop Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {airdropStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <FireCard variant="gradient" className="p-6 text-center">
                  <div className={`w-16 h-16 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 text-${stat.color}-500`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-dark-300 text-sm">{stat.label}</p>
                </FireCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="space-y-6"
        >
          <FireCard variant="glass" className="p-8">
            <h3 className="text-2xl font-bold flame-text mb-6 text-center">How to Participate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-fire-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-fire-500 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Join the Community</h4>
                    <p className="text-dark-300 text-sm">Follow our social media channels and join our Telegram group</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-fire-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-fire-500 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Complete Tasks</h4>
                    <p className="text-dark-300 text-sm">Complete social media tasks and activities to qualify</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-fire-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-fire-500 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Stay Active</h4>
                    <p className="text-dark-300 text-sm">Keep mining and participating in the platform</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-fire-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-fire-500 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Claim Tokens</h4>
                    <p className="text-dark-300 text-sm">Claim your airdrop tokens when the event goes live</p>
                  </div>
                </div>
              </div>
            </div>
          </FireCard>

          <FireCard variant="fire" className="p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Zap className="w-8 h-8 text-fire-500" />
              <h3 className="text-2xl font-bold text-white">Get Notified</h3>
            </div>
            <p className="text-dark-300 mb-6">
              We'll notify you as soon as the airdrop becomes available
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                Join Telegram
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-600">
                Follow Twitter
              </button>
            </div>
          </FireCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Airdrop;

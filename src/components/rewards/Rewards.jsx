import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { 
  Gift, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Coins,
  Users,
  MessageCircle,
  Share2,
  Eye,
  Zap,
  Twitter,
  Youtube,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';
import FireCard from '../ui/FireCard';
import FireButton from '../ui/FireButton';
import FireLoader from '../ui/FireLoader';

const Rewards = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAd, setShowAd] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [adTimer, setAdTimer] = useState(0);
  const [adWatched, setAdWatched] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    let interval;
    if (showAd && adTimer < 8) {
      interval = setInterval(() => {
        setAdTimer(prev => {
          if (prev >= 8) {
            setAdWatched(true);
            return 8;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showAd, adTimer]);

  const tasks = [
    {
      id: 'follow_twitter',
      title: 'Follow X (Twitter)',
      description: 'Follow our official X account',
      reward: 1.5,
      icon: Twitter,
      type: 'social',
      url: 'https://twitter.com/jos4471',
      completed: userData?.taskStats?.completedTasks?.includes('follow_twitter') || false,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'join_telegram',
      title: 'Join Telegram',
      description: 'Join our official Telegram community',
      reward: 1.5,
      icon: MessageCircle,
      type: 'social',
      url: 'https://t.me/fyranetwork',
      completed: userData?.taskStats?.completedTasks?.includes('join_telegram') || false,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'watch_ad',
      title: 'Watch Ads',
      description: '+5% mining rate, 3x per hour',
      reward: 0,
      icon: Play,
      type: 'ad',
      completed: userData?.taskStats?.completedTasks?.includes('watch_ad') || false,
      gradient: 'from-fire-500 to-fire-600'
    },
    {
      id: 'subscribe_youtube',
      title: 'Subscribe YouTube',
      description: 'Subscribe to our YouTube channel',
      reward: 2,
      icon: Youtube,
      type: 'social',
      url: 'https://youtube.com/@fyranetwork',
      completed: userData?.taskStats?.completedTasks?.includes('subscribe_youtube') || false,
      gradient: 'from-red-500 to-red-600'
    },
    {
      id: 'share_referral',
      title: 'Share Referral',
      description: 'Share your referral link',
      reward: 1,
      icon: Share2,
      type: 'referral',
      completed: userData?.taskStats?.completedTasks?.includes('share_referral') || false,
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'daily_checkin',
      title: 'Daily Check-in',
      description: 'Check in daily for bonus',
      reward: 0.5,
      icon: Clock,
      type: 'daily',
      completed: userData?.taskStats?.completedTasks?.includes('daily_checkin') || false,
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  const startTask = (task) => {
    if (task.completed) {
      toast.error('This task is already completed!');
      return;
    }

    if (task.type === 'ad') {
      setCurrentTask(task);
      setShowAd(true);
      setAdTimer(0);
      setAdWatched(false);
    } else if (task.type === 'social' || task.type === 'referral') {
      window.open(task.url, '_blank');
      toast.success(`Opening ${task.title}...`);
    } else if (task.type === 'daily') {
      completeTask(task);
    }
  };

  const completeTask = async (task) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const currentBalance = userData.fireBalance || 0;
      const currentTaskRewards = userData.taskStats?.totalTaskRewards || 0;
      
      await updateDoc(userRef, {
        fireBalance: currentBalance + task.reward,
        'taskStats.completedTasks': arrayUnion(task.id),
        'taskStats.totalTaskRewards': currentTaskRewards + task.reward
      });

      toast.success(`Task completed! You earned ${task.reward} FIRE tokens!`);
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task. Please try again.');
    }
  };

  const closeAd = () => {
    setShowAd(false);
    setAdTimer(0);
    setCurrentTask(null);
  };

  const claimAdReward = () => {
    if (currentTask && adWatched) {
      completeTask(currentTask);
      closeAd();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <FireLoader 
          percentage={100} 
          size="lg" 
          showPercentage={false}
          text="Loading rewards..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-8 relative overflow-hidden">
      {/* Background fire particles */}
      <div className="absolute inset-0 -z-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-fire-400 to-fire-600 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, -160],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold flame-text mb-2">
            Rewards & Tasks 🎁
          </h1>
          <p className="text-lg text-dark-300">
            Complete tasks to earn extra Fire tokens
          </p>
        </motion.div>

        {/* Unified Earnings Balance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <FireCard variant="fire" glow className="p-6 max-w-md w-full">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Coins className="w-8 h-8 text-fire-500" />
                <h2 className="text-2xl font-bold text-white">Unified Earnings</h2>
              </div>
              <div className="text-4xl font-bold flame-text mb-2">
                {userData?.fireBalance || 0} FIRE
              </div>
              <p className="text-dark-300 text-sm">
                Total balance from all sources
              </p>
            </div>
          </FireCard>
        </motion.div>

        {/* Task Cards with Gradient Borders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tasks.map((task, index) => {
            const Icon = task.icon;
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="relative group cursor-pointer"
                onClick={() => startTask(task)}
              >
                {/* Gradient Border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${task.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <FireCard 
                  variant={task.completed ? "default" : "fire"} 
                  className={`relative z-10 p-6 h-full ${
                    task.completed ? 'border-green-500/50 bg-green-500/5' : ''
                  }`}
                >
                  {/* Fire particles for active tasks */}
                  {!task.completed && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-fire-400 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
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

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${task.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      {task.completed ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </motion.div>
                      ) : (
                        <ExternalLink className="w-5 h-5 text-dark-400 group-hover:text-fire-400 transition-colors" />
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-fire-400 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-dark-300 text-sm mb-4 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Reward */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-5 h-5 text-fire-500" />
                        <span className="text-fire-500 font-bold text-lg">
                          {task.reward > 0 ? `${task.reward} FIRE` : 'Bonus Rate'}
                        </span>
                      </div>
                      
                      {task.type === 'ad' && (
                        <div className="flex items-center space-x-1 text-fire-400 text-sm">
                          <Play className="w-4 h-4" />
                          <span>Watch</span>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    {task.completed && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-center"
                      >
                        <span className="inline-flex items-center space-x-2 text-green-500 text-sm font-semibold bg-green-500/10 px-3 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </span>
                      </motion.div>
                    )}
                  </div>
                </FireCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <FireCard variant="glass" className="p-6">
            <h3 className="text-xl font-bold flame-text mb-4 text-center">How to Complete Tasks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse"></div>
                  <span className="text-dark-300">
                    <span className="text-fire-500 font-semibold">Social Tasks:</span> Click to open and complete
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse"></div>
                  <span className="text-dark-300">
                    <span className="text-fire-500 font-semibold">Ad Tasks:</span> Watch for mining boost
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse"></div>
                  <span className="text-dark-300">
                    <span className="text-fire-500 font-semibold">Referral Tasks:</span> Share your link
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse"></div>
                  <span className="text-dark-300">
                    <span className="text-fire-500 font-semibold">Daily Tasks:</span> Check in daily
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse"></div>
                  <span className="text-dark-300">
                    <span className="text-fire-500 font-semibold">Rewards:</span> Added to unified balance
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse"></div>
                  <span className="text-dark-300">
                    <span className="text-fire-500 font-semibold">Progress:</span> Track completion status
                  </span>
                </div>
              </div>
            </div>
          </FireCard>
        </motion.div>
      </div>

      {/* Enhanced Ad Modal */}
      {showAd && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-md w-full"
          >
            <FireCard variant="fire" glow className="p-8 text-center relative overflow-hidden">
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
                      duration: 2,
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
                  className="w-20 h-20 bg-gradient-to-r from-fire-500 to-fire-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-fire-500/50"
                >
                  <Play className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Watch Advertisement</h3>
                <p className="text-dark-300 mb-6">
                  {currentTask?.title} - {currentTask?.description}
                </p>
                
                <div className="bg-dark-800/50 rounded-xl p-6 mb-6 border border-dark-700">
                  <div className="text-3xl font-bold flame-text mb-3">
                    {adTimer}/8 seconds
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-fire-500 to-fire-600 h-3 rounded-full"
                      style={{ width: `${(adTimer / 8) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-dark-400 text-sm mt-2">
                    {adWatched ? 'Ad completed!' : 'Please wait...'}
                  </p>
                </div>
                
                {adWatched ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-center space-x-2 text-green-500">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-semibold">Ad watched successfully!</span>
                    </div>
                    <FireButton
                      onClick={claimAdReward}
                      variant="glow"
                      size="lg"
                      className="w-full"
                    >
                      <Zap className="w-5 h-5" />
                      Claim Mining Boost
                    </FireButton>
                  </motion.div>
                ) : (
                  <div className="text-dark-300 text-sm">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-fire-500 rounded-full animate-pulse"></div>
                      <span>Watching advertisement...</span>
                    </div>
                    <p className="text-xs text-dark-400">
                      This will boost your mining rate by 5%
                    </p>
                  </div>
                )}
                
                <FireButton
                  onClick={closeAd}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Close
                </FireButton>
              </div>
            </FireCard>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Rewards;

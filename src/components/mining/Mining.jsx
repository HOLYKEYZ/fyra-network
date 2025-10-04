import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { 
  Flame, 
  Play, 
  Pause, 
  Clock, 
  Coins, 
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Mining = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [miningActive, setMiningActive] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [adTimer, setAdTimer] = useState(0);
  const [miningProgress, setMiningProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData(data);
        setMiningActive(data.miningStats?.miningActive || false);
        
        if (data.miningStats?.miningActive && data.miningStats?.lastMiningStart) {
          const startTime = data.miningStats.lastMiningStart.toDate();
          const now = new Date();
          const elapsed = (now - startTime) / (1000 * 60 * 60); // hours
          const progress = Math.min((elapsed / 24) * 100, 100);
          setMiningProgress(progress);
          
          if (progress < 100) {
            const remaining = 24 - elapsed;
            setTimeRemaining(Math.max(0, remaining));
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    let interval;
    if (miningActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            setMiningActive(false);
            return 0;
          }
          return prev - (1 / 3600); // Decrease by 1 second
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [miningActive, timeRemaining]);

  useEffect(() => {
    let interval;
    if (showAd && adTimer < 10) {
      interval = setInterval(() => {
        setAdTimer(prev => {
          if (prev >= 10) {
            setAdWatched(true);
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showAd, adTimer]);

  const startMining = async () => {
    if (!adWatched) {
      setShowAd(true);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const now = new Date();
      
      await updateDoc(userRef, {
        'miningStats.miningActive': true,
        'miningStats.lastMiningStart': now,
        'miningStats.totalMiningTime': 0
      });

      setMiningActive(true);
      setMiningProgress(0);
      setTimeRemaining(24);
      setAdWatched(false);
      toast.success('Mining started! You will earn 36 FIRE tokens in 24 hours.');
    } catch (error) {
      console.error('Error starting mining:', error);
      toast.error('Failed to start mining. Please try again.');
    }
  };

  const stopMining = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const currentTime = userData.miningStats?.totalMiningTime || 0;
      const elapsed = timeRemaining > 0 ? 24 - timeRemaining : 0;
      
      await updateDoc(userRef, {
        'miningStats.miningActive': false,
        'miningStats.totalMiningTime': currentTime + elapsed
      });

      setMiningActive(false);
      setMiningProgress(0);
      setTimeRemaining(0);
      toast.success('Mining stopped. Progress saved.');
    } catch (error) {
      console.error('Error stopping mining:', error);
      toast.error('Failed to stop mining. Please try again.');
    }
  };

  const claimReward = async () => {
    if (miningProgress < 100) {
      toast.error('Mining must be 100% complete to claim reward');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const currentBalance = userData.fireBalance || 0;
      const currentMined = userData.totalMined || 0;
      
      await updateDoc(userRef, {
        fireBalance: currentBalance + 36,
        totalMined: currentMined + 36,
        'miningStats.miningActive': false,
        'miningStats.totalMiningTime': 0,
        'miningStats.lastMiningStart': null
      });

      setMiningActive(false);
      setMiningProgress(0);
      setTimeRemaining(0);
      toast.success('Congratulations! You earned 36 FIRE tokens!');
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward. Please try again.');
    }
  };

  const watchAd = () => {
    setShowAd(true);
    setAdTimer(0);
    setAdWatched(false);
  };

  const closeAd = () => {
    setShowAd(false);
    setAdTimer(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fire-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400">Loading mining interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fire Token Mining 🔥
          </h1>
          <p className="text-xl text-dark-400">
            Mine 36 FIRE tokens every 24 hours
          </p>
        </motion.div>

        {/* Mining Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="text-center">
            <div className="w-24 h-24 bg-fire-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
              <Flame className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              {miningActive ? 'Mining Active' : 'Mining Inactive'}
            </h2>

            {/* Fire Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-400">Mining Progress</span>
                <span className="text-white font-semibold">{Math.round(miningProgress)}%</span>
              </div>
              
              <div className="relative w-full h-6 bg-dark-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full fire-gradient rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${miningProgress}%` }}
                  transition={{ duration: 1 }}
                >
                  {/* Fire particles effect */}
                  <div className="absolute inset-0">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Time Remaining */}
            {miningActive && timeRemaining > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-dark-400" />
                  <span className="text-dark-400">Time Remaining</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.floor(timeRemaining)}h {Math.floor((timeRemaining % 1) * 60)}m
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {!miningActive ? (
                <div className="space-y-3">
                  {!adWatched && (
                    <div className="bg-dark-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <span className="text-yellow-500 font-semibold">Watch Ad to Start Mining</span>
                      </div>
                      <p className="text-dark-400 text-sm mb-3">
                        You must watch a short advertisement before starting mining
                      </p>
                      <button
                        onClick={watchAd}
                        className="btn-primary w-full"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Watch Ad & Start Mining
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={startMining}
                    disabled={!adWatched}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Mining
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={stopMining}
                    className="btn-secondary w-full"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Stop Mining
                  </button>
                  
                  {miningProgress >= 100 && (
                    <button
                      onClick={claimReward}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 w-full"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Claim 36 FIRE Tokens
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Mining Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card text-center">
            <Coins className="w-8 h-8 text-fire-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{userData?.fireBalance || 0}</div>
            <div className="text-dark-400 text-sm">Current Balance</div>
          </div>
          
          <div className="card text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{userData?.totalMined || 0}</div>
            <div className="text-dark-400 text-sm">Total Mined</div>
          </div>
          
          <div className="card text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {Math.round((userData?.miningStats?.totalMiningTime || 0) * 100) / 100}
            </div>
            <div className="text-dark-400 text-sm">Hours Mined</div>
          </div>
        </motion.div>

        {/* Mining Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-white mb-4">How Mining Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-dark-400">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Watch an ad to start mining</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Mine continuously for 24 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Earn 36 FIRE tokens upon completion</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Progress is saved if you stop</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Can restart anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Referrals boost your earnings</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ad Modal */}
      {showAd && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-dark-900 rounded-xl p-6 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">Watch Advertisement</h3>
            <p className="text-dark-400 mb-4">
              Please watch this advertisement to start mining
            </p>
            
            <div className="bg-dark-800 rounded-lg p-4 mb-4">
              <div className="text-2xl font-bold text-fire-500 mb-2">
                {adTimer}/10 seconds
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div 
                  className="bg-fire-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(adTimer / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {adWatched ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  <span>Ad watched successfully!</span>
                </div>
                <button
                  onClick={closeAd}
                  className="btn-primary w-full"
                >
                  Continue to Mining
                </button>
              </div>
            ) : (
              <div className="text-dark-400 text-sm">
                Please wait for the advertisement to complete...
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Mining;

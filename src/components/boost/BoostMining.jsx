import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { 
  TrendingUp, 
  Users, 
  Coins, 
  Share2, 
  Copy,
  CheckCircle,
  ExternalLink,
  Flame,
  ArrowUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const BoostMining = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const referralLink = `${window.location.origin}?ref=${userData?.referralCode}`;
  const referralBonus = userData?.referralStats?.totalReferralBonus || 0;
  const referredUsers = userData?.referralStats?.referredUsers || [];
  const activeReferrals = referredUsers.filter(ref => ref.miningActive).length;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy referral link');
    }
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Fyra Network',
        text: 'Join me on Fyra Network and earn Fire tokens! Use my referral link:',
        url: referralLink
      });
    } else {
      copyReferralLink();
    }
  };

  const getReferralStats = () => {
    const totalReferrals = referredUsers.length;
    const activeReferrals = referredUsers.filter(ref => ref.miningActive).length;
    const totalEarnings = referralBonus;
    const potentialEarnings = activeReferrals * 3.6; // 10% of 36 FIRE

    return {
      totalReferrals,
      activeReferrals,
      totalEarnings,
      potentialEarnings
    };
  };

  const stats = getReferralStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fire-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400">Loading boost mining...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Boost Mining 🚀
          </h1>
          <p className="text-xl text-dark-400">
            Increase your earnings with referrals
          </p>
        </motion.div>

        {/* Referral Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-fire-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Your Referral Link</h2>
            <p className="text-dark-400 mb-6">
              Share this link with friends to earn 10% of their first mining reward
            </p>

            <div className="bg-dark-800 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-fire-500 rounded-full animate-pulse"></div>
                <span className="text-fire-500 text-sm font-semibold">Referral Code: {userData?.referralCode}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="input-field flex-1 text-center font-mono text-sm"
                />
                <button
                  onClick={copyReferralLink}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white'
                  }`}
                >
                  {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={shareReferralLink}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Share2 size={20} />
                <span>Share Referral Link</span>
              </button>
              
              <button
                onClick={copyReferralLink}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Copy size={20} />
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Referral Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalReferrals}</div>
            <div className="text-dark-400 text-sm">Total Referrals</div>
          </div>
          
          <div className="card text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.activeReferrals}</div>
            <div className="text-dark-400 text-sm">Active Mining</div>
          </div>
          
          <div className="card text-center">
            <Coins className="w-8 h-8 text-fire-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalEarnings}</div>
            <div className="text-dark-400 text-sm">Total Earned</div>
          </div>
          
          <div className="card text-center">
            <ArrowUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.potentialEarnings.toFixed(1)}</div>
            <div className="text-dark-400 text-sm">Potential Daily</div>
          </div>
        </motion.div>

        {/* Referral List */}
        {referredUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card mb-8"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Your Referrals</h3>
            <div className="space-y-3">
              {referredUsers.map((referral, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-dark-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-dark-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{referral.username || 'User'}</div>
                      <div className="text-dark-400 text-sm">
                        Joined {referral.joinedAt ? new Date(referral.joinedAt.toDate()).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {referral.miningActive ? 'Active' : 'Inactive'}
                      </div>
                      <div className="text-dark-400 text-sm">
                        {referral.miningActive ? 'Mining' : 'Not Mining'}
                      </div>
                    </div>
                    
                    <div className={`w-3 h-3 rounded-full ${
                      referral.miningActive ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-white mb-4">How Referral System Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-dark-400">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <div className="text-white font-medium">Share Your Link</div>
                  <div>Share your unique referral link with friends and on social media</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <div className="text-white font-medium">Friends Join</div>
                  <div>When they sign up using your link, they become your referrals</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <div className="text-white font-medium">Earn Bonuses</div>
                  <div>You earn 10% of their first mining reward (3.6 FIRE tokens)</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <div>
                  <div className="text-white font-medium">Passive Income</div>
                  <div>Earn bonuses every time your referrals complete mining cycles</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Referral Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 card"
        >
          <h3 className="text-xl font-semibold text-white mb-4">💡 Referral Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-dark-400">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Share on social media platforms</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Create content about Fyra Network</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Join crypto communities and forums</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Explain the benefits to friends</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Use messaging apps and groups</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
                <span>Be consistent with sharing</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BoostMining;

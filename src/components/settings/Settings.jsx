import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { 
  User, 
  Calendar, 
  MapPin, 
  Mail, 
  Users, 
  FileText,
  MessageCircle,
  Download,
  Shield,
  AlertTriangle,
  Edit3,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingCount, setEditingCount] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    dateOfBirth: '',
    country: '',
    email: ''
  });

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData(data);
        setProfileData({
          name: data.profile?.name || '',
          dateOfBirth: data.profile?.dateOfBirth || '',
          country: data.profile?.country || '',
          email: data.email || ''
        });
        setEditingCount(data.profile?.editCount || 0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleProfileEdit = () => {
    if (editingCount >= 2) {
      toast.error('You can only edit your profile twice. Contact support for more changes.');
      return;
    }
    setEditingProfile(true);
  };

  const handleProfileSave = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'profile.name': profileData.name,
        'profile.dateOfBirth': profileData.dateOfBirth,
        'profile.country': profileData.country,
        'profile.editCount': editingCount + 1,
        'profile.lastEdited': new Date()
      });

      setEditingCount(editingCount + 1);
      setEditingProfile(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleProfileCancel = () => {
    setProfileData({
      name: userData.profile?.name || '',
      dateOfBirth: userData.profile?.dateOfBirth || '',
      country: userData.profile?.country || '',
      email: userData.email || ''
    });
    setEditingProfile(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fire-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400">Loading settings...</p>
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
            Settings ⚙️
          </h1>
          <p className="text-xl text-dark-400">
            Manage your profile and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">User Profile</h2>
                {!editingProfile ? (
                  <button
                    onClick={handleProfileEdit}
                    disabled={editingCount >= 2}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleProfileSave}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleProfileCancel}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {editingCount >= 2 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-yellow-500">
                    <AlertTriangle size={18} />
                    <span className="font-semibold">Profile Edit Limit Reached</span>
                  </div>
                  <p className="text-yellow-400 text-sm mt-1">
                    You have reached the maximum number of profile edits (2). Contact support for additional changes.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="input-field bg-dark-800 text-white">
                      {profileData.name || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth
                  </label>
                  {editingProfile ? (
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="input-field"
                    />
                  ) : (
                    <div className="input-field bg-dark-800 text-white">
                      {profileData.dateOfBirth || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Country
                  </label>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={profileData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="input-field"
                      placeholder="Enter your country"
                    />
                  ) : (
                    <div className="input-field bg-dark-800 text-white">
                      {profileData.country || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <div className="input-field bg-dark-800 text-dark-400 cursor-not-allowed">
                    {profileData.email}
                  </div>
                  <p className="text-xs text-dark-500 mt-1">Email cannot be changed</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-dark-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Profile edits remaining:</span>
                  <span className={`font-semibold ${editingCount >= 2 ? 'text-red-500' : 'text-green-500'}`}>
                    {Math.max(0, 2 - editingCount)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Mining Team Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Mining Team Panel</h2>
              
              {userData?.referralStats?.referredUsers?.length > 0 ? (
                <div className="space-y-4">
                  {userData.referralStats.referredUsers.map((referral, index) => (
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
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          referral.miningActive ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {referral.miningActive ? 'Active Mining' : 'Inactive'}
                        </div>
                        <div className="text-dark-400 text-xs">
                          {referral.miningActive ? 'Earning bonus' : 'No bonus'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                  <p className="text-dark-400 mb-4">No referrals yet</p>
                  <p className="text-dark-500 text-sm">
                    Share your referral link to start building your mining team
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="https://t.me/fyranetwork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-white">Community Chat</span>
                </a>
                
                <a
                  href="https://t.me/fyrasupportbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <span className="text-white">Contact Support</span>
                </a>
                
                <a
                  href="/whitepaper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <FileText className="w-5 h-5 text-fire-500" />
                  <span className="text-white">Download Whitepaper</span>
                </a>
              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-400">Username:</span>
                  <span className="text-white font-medium">{userData?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Member since:</span>
                  <span className="text-white">
                    {userData?.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Referral code:</span>
                  <span className="text-white font-mono">{userData?.referralCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Total mined:</span>
                  <span className="text-white">{userData?.totalMined || 0} FIRE</span>
                </div>
              </div>
            </motion.div>

            {/* Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Coming Soon</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  <span className="text-dark-400">KYC Verification</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg">
                  <Download className="w-5 h-5 text-blue-500" />
                  <span className="text-dark-400">Token Withdrawal</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="text-dark-400">Advanced Referrals</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

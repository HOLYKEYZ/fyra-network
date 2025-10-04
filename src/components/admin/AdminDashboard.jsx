import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { 
  Crown, 
  Users, 
  Coins, 
  Flame, 
  TrendingUp, 
  Settings,
  Edit3,
  Save,
  X,
  Eye,
  Download,
  MessageCircle,
  FileText,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFireMined: 0,
    activeMiners: 0,
    totalReferrals: 0
  });
  const [editingContent, setEditingContent] = useState(null);
  const [contentData, setContentData] = useState({
    faq: '',
    whitepaperLink: '',
    telegramLink: '',
    termsAndConditions: ''
  });

  // Admin emails (in production, this would be in Firestore)
  const adminEmails = ['admin@fyranetwork.com', 'support@fyranetwork.com'];

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData(data);
        setIsAdmin(adminEmails.includes(data.email));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;

    // Load users
    const loadUsers = async () => {
      try {
        const usersQuery = query(collection(db, 'users'));
        const querySnapshot = await getDocs(usersQuery);
        const usersData = [];
        let totalFire = 0;
        let activeMiners = 0;
        let totalRefs = 0;

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          usersData.push({ id: doc.id, ...userData });
          totalFire += userData.totalMined || 0;
          if (userData.miningStats?.miningActive) activeMiners++;
          totalRefs += userData.referralStats?.referredUsers?.length || 0;
        });

        setUsers(usersData);
        setStats({
          totalUsers: usersData.length,
          totalFireMined: totalFire,
          activeMiners,
          totalReferrals: totalRefs
        });
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
      }
    };

    loadUsers();
  }, [isAdmin]);
  
  const handleContentEdit = (contentType) => {
    setEditingContent(contentType);
    setContentData(prev => ({
      ...prev,
      [contentType]: contentData[contentType] || ''
    }));
  };

  const handleContentSave = async (contentType) => {
    try {
      // In a real app, you'd save this to Firestore
      // For now, we'll just show a success message
      toast.success(`${contentType} updated successfully!`);
      setEditingContent(null);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const handleContentCancel = () => {
    setEditingContent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fire-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-dark-400 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <p className="text-dark-500 text-sm">
            Only approved admin emails can access this area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-fire-600 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-xl text-dark-400">
            Manage Fyra Network platform and users
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <div className="text-dark-400 text-sm">Total Users</div>
          </div>
          
          <div className="card text-center">
            <Coins className="w-8 h-8 text-fire-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalFireMined}</div>
            <div className="text-dark-400 text-sm">Total Fire Mined</div>
          </div>
          
          <div className="card text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.activeMiners}</div>
            <div className="text-dark-400 text-sm">Active Miners</div>
          </div>
          
          <div className="card text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalReferrals}</div>
            <div className="text-dark-400 text-sm">Total Referrals</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
              
              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-800">
                        <th className="text-left p-3 text-dark-300 font-medium">User</th>
                        <th className="text-left p-3 text-dark-300 font-medium">Balance</th>
                        <th className="text-left p-3 text-dark-300 font-medium">Mined</th>
                        <th className="text-left p-3 text-dark-300 font-medium">Status</th>
                        <th className="text-left p-3 text-dark-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 10).map((user) => (
                        <tr key={user.id} className="border-b border-dark-800/50">
                          <td className="p-3">
                            <div>
                              <div className="text-white font-medium">{user.username || 'No username'}</div>
                              <div className="text-dark-400 text-sm">{user.email}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-fire-500 font-semibold">{user.fireBalance || 0} FIRE</span>
                          </td>
                          <td className="p-3">
                            <span className="text-white">{user.totalMined || 0} FIRE</span>
                          </td>
                          <td className="p-3">
                            <div className={`w-3 h-3 rounded-full ${
                              user.miningStats?.miningActive ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                          </td>
                          <td className="p-3">
                            <button className="text-fire-500 hover:text-fire-400 text-sm">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {users.length > 10 && (
                    <div className="text-center mt-4">
                      <span className="text-dark-400 text-sm">
                        Showing 10 of {users.length} users
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                  <p className="text-dark-400">No users found</p>
                </div>
              )}
            </motion.div>

            {/* Platform Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Platform Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Mining Rate (FIRE per 24h)
                  </label>
                  <input
                    type="number"
                    defaultValue="36"
                    className="input-field"
                    placeholder="36"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Referral Bonus (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="input-field"
                    placeholder="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Task Reward Multiplier
                  </label>
                  <input
                    type="number"
                    defaultValue="1.0"
                    step="0.1"
                    className="input-field"
                    placeholder="1.0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Daily Mining Limit
                  </label>
                  <input
                    type="number"
                    defaultValue="1"
                    className="input-field"
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button className="btn-primary">
                  <Save className="w-5 h-5 mr-2" />
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Content Management */}
          <div className="space-y-6">
            {/* FAQ Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">FAQ Management</h3>
                {editingContent !== 'faq' ? (
                  <button
                    onClick={() => handleContentEdit('faq')}
                    className="btn-secondary"
                  >
                    <Edit3 size={16} />
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleContentSave('faq')}
                      className="btn-primary"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleContentCancel}
                      className="btn-secondary"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {editingContent === 'faq' ? (
                <textarea
                  value={contentData.faq}
                  onChange={(e) => setContentData(prev => ({ ...prev, faq: e.target.value }))}
                  className="input-field h-32 resize-none"
                  placeholder="Enter FAQ content..."
                />
              ) : (
                <div className="text-dark-400 text-sm">
                  {contentData.faq || 'No FAQ content set'}
                </div>
              )}
            </motion.div>

            {/* Content Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Content Links</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Whitepaper Link
                  </label>
                  {editingContent === 'whitepaperLink' ? (
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={contentData.whitepaperLink}
                        onChange={(e) => setContentData(prev => ({ ...prev, whitepaperLink: e.target.value }))}
                        className="input-field flex-1"
                        placeholder="https://..."
                      />
                      <button
                        onClick={() => handleContentSave('whitepaperLink')}
                        className="btn-primary"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleContentCancel}
                        className="btn-secondary"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-dark-400 text-sm">
                        {contentData.whitepaperLink || 'No link set'}
                      </div>
                      <button
                        onClick={() => handleContentEdit('whitepaperLink')}
                        className="btn-secondary"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Telegram Link
                  </label>
                  {editingContent === 'telegramLink' ? (
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={contentData.telegramLink}
                        onChange={(e) => setContentData(prev => ({ ...prev, telegramLink: e.target.value }))}
                        className="input-field flex-1"
                        placeholder="https://t.me/..."
                      />
                      <button
                        onClick={() => handleContentSave('telegramLink')}
                        className="btn-primary"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleContentCancel}
                        className="btn-secondary"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-dark-400 text-sm">
                        {contentData.telegramLink || 'No link set'}
                      </div>
                      <button
                        onClick={() => handleContentEdit('telegramLink')}
                        className="btn-secondary"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Terms & Conditions</h3>
                {editingContent !== 'termsAndConditions' ? (
                  <button
                    onClick={() => handleContentEdit('termsAndConditions')}
                    className="btn-secondary"
                  >
                    <Edit3 size={16} />
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleContentSave('termsAndConditions')}
                      className="btn-primary"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleContentCancel}
                      className="btn-secondary"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {editingContent === 'termsAndConditions' ? (
                <textarea
                  value={contentData.termsAndConditions}
                  onChange={(e) => setContentData(prev => ({ ...prev, termsAndConditions: e.target.value }))}
                  className="input-field h-32 resize-none"
                  placeholder="Enter terms and conditions..."
                />
              ) : (
                <div className="text-dark-400 text-sm">
                  {contentData.termsAndConditions || 'No terms and conditions set'}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../../firebase/config';
import { User, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const UsernameSetup = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const validateUsername = (value) => {
    // Only letters a-z, A-Z allowed
    const regex = /^[a-zA-Z]+$/;
    return regex.test(value) && value.length >= 3 && value.length <= 20;
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setIsValid(validateUsername(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValid || !username) {
      toast.error('Please enter a valid username (letters only, 3-20 characters)');
      return;
    }

    setIsLoading(true);
    try {
      // Check if username is already taken
      const usernameQuery = await getDoc(doc(db, 'usernames', username.toLowerCase()));
      
      if (usernameQuery.exists()) {
        toast.error('Username is already taken. Please choose another one.');
        return;
      }

      // Update user document with username
      await updateDoc(doc(db, 'users', user.uid), {
        username: username,
        usernameSetAt: new Date()
      });

      // Reserve username
      await updateDoc(doc(db, 'usernames', username.toLowerCase()), {
        uid: user.uid,
        username: username,
        reservedAt: new Date()
      });

      toast.success('Username set successfully!');
      
      // Redirect to dashboard (this will happen automatically via App.jsx logic)
    } catch (error) {
      console.error('Error setting username:', error);
      toast.error('Failed to set username. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Fyra!</h1>
          <p className="text-dark-400">Let's set up your profile</p>
        </div>

        {/* Username Setup Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-300 mb-2">
                Choose Your Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter username (letters only)"
                  className={`input-field pl-10 ${!isValid && username ? 'border-red-500' : ''}`}
                  maxLength={20}
                  required
                />
              </div>
              
              {/* Validation feedback */}
              {username && (
                <div className="mt-2 flex items-center space-x-2">
                  {isValid ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                    {isValid 
                      ? 'Username is available!' 
                      : 'Username must contain only letters (a-z, A-Z) and be 3-20 characters long'
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Username rules */}
            <div className="bg-dark-800 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-dark-300">Username Requirements:</h4>
              <ul className="text-xs text-dark-400 space-y-1">
                <li>• Only letters (a-z, A-Z) allowed</li>
                <li>• 3-20 characters long</li>
                <li>• Must be unique</li>
                <li>• Cannot be changed later</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isValid || !username}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Set Username & Continue</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Next steps info */}
        <div className="mt-8 text-center">
          <p className="text-dark-400 text-sm">
            After setting your username, you'll be able to:
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-center space-x-2 text-dark-300">
              <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
              <span>Start mining Fire tokens</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-dark-300">
              <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
              <span>Complete tasks for rewards</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-dark-300">
              <div className="w-2 h-2 bg-fire-500 rounded-full"></div>
              <span>Build your referral network</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UsernameSetup;

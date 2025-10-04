import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import {
  Flame,
  Gift,
  TrendingUp,
  Coins,
  Users,
  Clock,
  Zap,
  ArrowRight,
  Copy,
  Share2,
} from "lucide-react";
import CountUp from "react-countup";
import FireCard from "../ui/FireCard";
import FireButton from "../ui/FireButton";
import FireLoader from "../ui/FireLoader";
import AdTrigger from "../ui/AdTrigger";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <FireLoader
          percentage={100}
          size="lg"
          showPercentage={false}
          text="Loading dashboard.."
        />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <p className="text-dark-400">User data not found</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Fire Balance",
      value: userData.fireBalance || 0,
      icon: Coins,
      color: "text-fire-500",
      bgColor: "bg-fire-500/10",
      link: "/mining",
    },
    {
      label: "Total Mined",
      value: userData.totalMined || 0,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      link: "/mining",
    },
    {
      label: "Referral Bonus",
      value: userData.referralStats?.totalReferralBonus || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      link: "/boost",
    },
    {
      label: "Task Rewards",
      value: userData.taskStats?.totalTaskRewards || 0,
      icon: Gift,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      link: "/rewards",
    },
  ];

  const quickActions = [
    {
      title: "Start Mining",
      description: "Earn 36 Fire tokens per 24 hours",
      icon: Flame,
      color: "bg-fire-600",
      link: "/mining",
      action: "Mine Now",
    },
    {
      title: "Complete Tasks",
      description: "Earn extra Fire tokens",
      icon: Gift,
      color: "bg-green-600",
      link: "/rewards",
      action: "View Tasks",
    },
    {
      title: "Boost Mining",
      description: "refer to get more earnings",
      icon: TrendingUp,
      color: "bg-blue-600",
      link: "/boost",
      action: "Boost Now",
    },
  ];

  const miningProgress = userData.miningStats?.miningActive
    ? Math.min(((userData.miningStats?.totalMiningTime || 0) / 24) * 100, 100)
    : 0;

  const timeLeft =
    userData.miningStats?.miningActive && userData.miningStats?.lastMiningStart
      ? Math.max(0, 24 - (userData.miningStats?.totalMiningTime || 0))
      : 0;

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-8 relative overflow-hidden">
      {/* Background fire particles */}
      <div className="absolute inset-0 -z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-fire-400 to-fire-600 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Logo and Username */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="relative w-12 h-12">
              <img
                src="/splash.png"
                alt="Fyra Network Logo"
                className="w-full h-full object-contain"
                style={{
                  filter: "drop-shadow(0 0 15px rgba(255, 90, 20, 0.6))",
                }}
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Hi,{" "}
              <span className="flame-text">{userData.username || "User"}</span>!
              🔥
            </h1>
          </div>
        </div>

        {/* Central Circular Fire-themed Mining Progress */}
        <div className="flex justify-center mb-8">
          <FireCard variant="fire" glow className="p-8 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                Mining Progress
              </h2>

              {/* Circular Progress */}
              <div className="relative mb-6">
                <FireLoader
                  percentage={miningProgress}
                  size="xl"
                  showPercentage={true}
                />

                {/* Time Left */}
                <div className="mt-4">
                  <p className="text-dark-300 text-sm mb-1">Time Remaining</p>
                  <p className="text-2xl font-bold text-white">
                    {timeLeft > 0
                      ? `${Math.floor(timeLeft)}h ${Math.floor(
                          (timeLeft % 1) * 60
                        )}m`
                      : "Complete!"}
                  </p>
                </div>
              </div>

              {/* Tap to Start Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FireButton
                  variant="glow"
                  size="lg"
                  className="w-full mb-4"
                  onClick={() => {
                    if (userData.miningStats?.miningActive) {
                      window.location.href = "/mining";
                    } else {
                      setShowAd(true);
                    }
                  }}
                >
                  <Zap size={24} />
                  {userData.miningStats?.miningActive
                    ? "View Mining"
                    : "Tap to Start"}
                </FireButton>
              </motion.div>

              <p className="text-sm text-dark-400">
                {userData.miningStats?.miningActive
                  ? "Mining in progress..."
                  : "Watch an ad to start mining and earn 36 FIRE tokens per 24h cycle"}
              </p>
            </div>
          </FireCard>
        </div>

        {/* Stats Row: Balance, Active Members, Current Mining Rate, Invite Rate */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Balance",
              value: userData.fireBalance || 0,
              icon: Coins,
              color: "fire",
            },
            {
              label: "Active Members",
              value: userData.referralStats?.referredUsers?.length || 0,
              icon: Users,
              color: "blue",
            },
            {
              label: "Current Mining Rate",
              value: "36 FIRE/24h",
              icon: Clock,
              color: "green",
            },
            {
              label: "Invite Rate",
              value: "10%",
              icon: TrendingUp,
              color: "purple",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <FireCard
                key={stat.label}
                variant="default"
                className="text-center"
              >
                <div
                  className={`w-12 h-12 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
                <p className="text-white font-bold text-lg">
                  {typeof stat.value === "number" ? (
                    <CountUp end={stat.value} duration={2} />
                  ) : (
                    stat.value
                  )}
                </p>
              </FireCard>
            );
          })}
        </div>

        {/* Action Buttons: Copy Referral Link, Boost Mining */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <FireCard variant="gradient" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Copy Referral Link
                </h3>
                <p className="text-dark-300 text-sm">
                  Share your link to earn 10% bonus
                </p>
              </div>
              <FireButton
                variant="outline"
                size="md"
                onClick={() => {
                  const referralLink = `${window.location.origin}?ref=${userData.referralCode}`;
                  navigator.clipboard.writeText(referralLink);
                  // You could add a toast notification here
                }}
              >
                <Copy size={20} />
              </FireButton>
            </div>
          </FireCard>

          <FireCard variant="gradient" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Boost Mining
                </h3>
                <p className="text-dark-300 text-sm">
                  Increase your mining rate
                </p>
              </div>
              <Link to="/boost">
                <FireButton variant="primary" size="md">
                  <TrendingUp size={20} />
                </FireButton>
              </Link>
            </div>
          </FireCard>
        </div>

        {/* Tokenomics Info */}
        <div className="text-center">
          <FireCard variant="glass" className="p-6">
            <h3 className="text-xl font-bold flame-text mb-4">
              Fire Token Network
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Flame className="w-5 h-5 text-fire-500" />
                <span className="text-dark-300">
                  <span className="text-fire-500 font-semibold">10B</span> Total
                  Supply
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5 text-fire-500" />
                <span className="text-dark-300">
                  <span className="text-fire-500 font-semibold">36 FIRE</span>{" "}
                  Daily Reward
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5 text-fire-500" />
                <span className="text-dark-300">
                  <span className="text-fire-500 font-semibold">10%</span>{" "}
                  Referral Bonus
                </span>
              </div>
            </div>
          </FireCard>
        </div>
      </div>

      {/* Ad Trigger Modal */}
      <AdTrigger
        isOpen={showAd}
        onClose={() => setShowAd(false)}
        onAdComplete={() => {
          // In production, this would start the actual mining session
          console.log("Ad completed, mining session started");
          // You could update Firestore here to start mining
        }}
      />
    </div>
  );
};

export default Dashboard;

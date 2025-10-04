import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";

// Components
import EntryAnimation from "./components/EntryAnimation";
import Login from "./components/auth/Login";
import UsernameSetup from "./components/auth/UsernameSetup";
import Dashboard from "./components/dashboard/Dashboard";
import Mining from "./components/mining/Mining";
import Rewards from "./components/rewards/Rewards";
import BoostMining from "./components/boost/BoostMining";
import Settings from "./components/settings/Settings";
import Airdrop from "./components/airdrop/Airdrop";
import AdminDashboard from "./components/admin/AdminDashboard";
import Navigation from "./components/layout/Navigation";
import BottomNavigation from "./components/layout/BottomNavigation";

function App() {
  const [user, loading] = useAuthState(auth);
  const [showEntry, setShowEntry] = useState(true);
  const [hasUsername, setHasUsername] = useState(false);

  useEffect(() => {
    // Show entry animation for 6 seconds
    const timer = setTimeout(() => {
      setShowEntry(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      // Check if user has username set
      // This would typically check Firestore
      setHasUsername(true); // Placeholder
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fire-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400">Loading Fyra Network...</p>
        </div>
      </div>
    );
  }

  if (showEntry) {
    return <EntryAnimation />;
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {user && <Navigation />}

      <main className={`${user ? "pt-16 pb-20" : "pt-0 pb-0"}`}>
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <Login />
              ) : !hasUsername ? (
                <UsernameSetup />
              ) : (
                <Dashboard />
              )
            }
          />

          {user && hasUsername && (
            <>
              <Route path="/mining" element={<Mining />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/boost" element={<BoostMining />} />
              <Route path="/airdrop" element={<Airdrop />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {user && hasUsername && <BottomNavigation />}
    </div>
  );
}

export default App;

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import {
  Flame,
  Mail,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Lock,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import FireButton from "../ui/FireButton";
import FireCard from "../ui/FireCard";
import FireInput from "../ui/FireInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loginMethod, setLoginMethod] = useState("emailLink"); // 'emailLink' or 'emailPassword'
  const [isSignUp, setIsSignUp] = useState(false);

  // Check if user is returning from email link
  React.useEffect(() => {
    // Enhanced mobile detection and URL handling
    const currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);
    console.log("User Agent:", navigator.userAgent);
    console.log(
      "Is Mobile:",
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );

    if (isSignInWithEmailLink(auth, currentUrl)) {
      console.log("Valid email link detected");
      setShowConfirmation(true);
    } else {
      console.log("No valid email link found");
    }
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      // Get the current origin dynamically for mobile compatibility
      const currentOrigin = window.location.origin;

      const actionCodeSettings = {
        url: currentOrigin,
        handleCodeInApp: true,
        // Add additional domains for development
        dynamicLinkDomain: "fyra-network-84c30.firebaseapp.com",
      };

      // Ensure proper URL for different environments
      if (currentOrigin.includes("vercel.app")) {
        actionCodeSettings.url = currentOrigin;
      } else if (currentOrigin.includes("localhost")) {
        actionCodeSettings.url = "http://localhost:3001";
      } else {
        actionCodeSettings.url = currentOrigin;
      }

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      // Save email to localStorage for later use
      window.localStorage.setItem("emailForSignIn", email);

      setShowConfirmation(true);
      toast.success("Login link sent to your email!");

      // Additional mobile-specific instructions
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (isMobile) {
        console.log(
          "Mobile device detected - email link should work on this device"
        );
        toast.success("Check your email and tap the link to continue!", {
          duration: 6000,
        });
      }
    } catch (error) {
      console.error("Error sending login link:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      // More specific error messages
      if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please try again later");
      } else if (error.code === "auth/operation-not-allowed") {
        toast.error(
          "Email link authentication is not enabled. Please contact support"
        );
      } else if (error.code === "auth/unauthorized-domain") {
        toast.error("This domain is not authorized. Please contact support");
      } else {
        toast.error(`Failed to send login link: ${error.message}`);
      }

      // For development: show a fallback option
      if (process.env.NODE_ENV === "development") {
        console.log(
          "Development mode: You can check the browser console for the email link"
        );
        console.log("Or enable Email Link Authentication in Firebase Console");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationCode = async (e) => {
    e.preventDefault();
    if (!confirmationCode) {
      toast.error("Please enter the confirmation code");
      return;
    }

    setIsLoading(true);
    try {
      const email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        toast.error("Email not found. Please try logging in again.");
        return;
      }

      // Complete sign in with email link
      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          createdAt: new Date(),
          fireBalance: 0,
          totalMined: 0,
          referralCode: generateReferralCode(),
          referredBy: null,
          username: null,
          profile: {
            name: "",
            dateOfBirth: "",
            country: "",
          },
          miningStats: {
            lastMiningStart: null,
            totalMiningTime: 0,
            miningActive: false,
          },
          referralStats: {
            referredUsers: [],
            totalReferralBonus: 0,
          },
          taskStats: {
            completedTasks: [],
            totalTaskRewards: 0,
          },
        });
      }

      window.localStorage.removeItem("emailForSignIn");
      toast.success("Successfully logged in!");
    } catch (error) {
      console.error("Error confirming login:", error);
      toast.error("Failed to confirm login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (isSignUp) {
        // Create new user
        result = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile with username
        const username = email.split("@")[0];
        await updateProfile(result.user, {
          displayName: username,
        });

        // Create user document in Firestore
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          username: username,
          createdAt: new Date(),
          fireBalance: 0,
          totalMined: 0,
          referralCode: generateReferralCode(),
          referredBy: null,
          profile: {
            name: username,
            dateOfBirth: "",
            country: "",
          },
          miningStats: {
            lastMiningStart: null,
            totalMiningTime: 0,
            miningActive: false,
          },
          referralStats: {
            referredUsers: [],
            totalReferralBonus: 0,
          },
          taskStats: {
            completedTasks: [],
            totalTaskRewards: 0,
          },
        });

        toast.success("Account created successfully!");
      } else {
        // Sign in existing user
        result = await signInWithEmailAndPassword(auth, email, password);
        toast.success("Successfully logged in!");
      }

      // Check if user exists in Firestore (for existing users)
      if (!isSignUp) {
        const userDoc = await getDoc(doc(db, "users", result.user.uid));
        if (!userDoc.exists()) {
          // Create user document if it doesn't exist
          await setDoc(doc(db, "users", result.user.uid), {
            email: result.user.email,
            username: result.user.displayName || email.split("@")[0],
            createdAt: new Date(),
            fireBalance: 0,
            totalMined: 0,
            referralCode: generateReferralCode(),
            referredBy: null,
            profile: {
              name: result.user.displayName || email.split("@")[0],
              dateOfBirth: "",
              country: "",
            },
            miningStats: {
              lastMiningStart: null,
              totalMiningTime: 0,
              miningActive: false,
            },
            referralStats: {
              referredUsers: [],
              totalReferralBonus: 0,
            },
            taskStats: {
              completedTasks: [],
              totalTaskRewards: 0,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error with email/password auth:", error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email is already in use. Try signing in instead.");
        setIsSignUp(false);
      } else if (error.code === "auth/user-not-found") {
        toast.error(
          "No account found with this email. Try signing up instead."
        );
        setIsSignUp(true);
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error(`Authentication failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
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
              y: [0, -100, -200],
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

      <div className="w-full max-w-md relative z-10">
        {/* Enhanced Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            className="relative mx-auto mb-6"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-fire-500/30 via-fire-400/40 to-fire-600/30 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* FYRA Logo Image */}
            <div className="relative w-24 h-24 mx-auto">
              <img
                src="/splash.png"
                alt="FYRA Network Logo"
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(255, 90, 20, 0.6))",
                }}
              />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold flame-text mb-2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            Welcome to Fyra
          </motion.h1>
          <p className="text-dark-300 text-lg">Fyra Token Mining Network</p>
        </div>

        {/* Age Restriction Banner */}
        <div className="mb-6">
          <FireCard variant="fire" className="border-2 border-amber-500/50">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-amber-400 font-semibold text-sm">
                  Age Restriction Notice
                </p>
                <p className="text-dark-300 text-xs mt-1">
                  You must be 18+ to use this platform. By continuing, you
                  confirm you meet the age requirement.
                </p>
              </div>
            </div>
          </FireCard>
        </div>

        {/* Enhanced Login Form */}
        <FireCard variant="fire" glow className="relative overflow-hidden">
          {/* Fire particles inside card */}
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
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {!showConfirmation ? (
            <div className="space-y-6 relative z-10">
              {/* Login Method Toggle */}
              <div className="flex space-x-2 mb-6">
                <button
                  type="button"
                  onClick={() => setLoginMethod("emailLink")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    loginMethod === "emailLink"
                      ? "bg-fire-500 text-white shadow-lg"
                      : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                  }`}
                >
                  <Mail size={16} className="inline mr-2" />
                  Email Link
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("emailPassword")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    loginMethod === "emailPassword"
                      ? "bg-fire-500 text-white shadow-lg"
                      : "bg-dark-700 text-dark-300 hover:bg-dark-600"
                  }`}
                >
                  <Lock size={16} className="inline mr-2" />
                  Email & Password
                </button>
              </div>

              {loginMethod === "emailLink" ? (
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div>
                    <FireInput
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={Mail}
                      required
                    />
                  </div>

                  <FireButton
                    type="submit"
                    variant="glow"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Zap size={20} />
                    Send Login Link
                  </FireButton>
                </form>
              ) : (
                <form onSubmit={handleEmailPasswordLogin} className="space-y-6">
                  <div>
                    <FireInput
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={Mail}
                      required
                    />
                  </div>

                  <div>
                    <FireInput
                      type="password"
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={Lock}
                      required
                    />
                  </div>

                  <FireButton
                    type="submit"
                    variant="glow"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <User size={20} />
                    {isSignUp ? "Create Account" : "Sign In"}
                  </FireButton>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-fire-400 hover:text-fire-300 text-sm font-medium transition-colors"
                    >
                      {isSignUp
                        ? "Already have an account? Sign In"
                        : "Don't have an account? Sign Up"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6 relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/50">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                </div>

                {/* Success particles */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-green-400 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        y: [0, -30, -60],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 1,
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Check Your Email
                </h3>
                <p className="text-dark-300 leading-relaxed">
                  We've sent a secure login link to your email address. Click
                  the link to continue.
                </p>
              </div>

              <div className="text-sm text-dark-400 bg-dark-800/50 rounded-lg p-4">
                <p className="mb-2">
                  Don't see the email? Check your spam folder.
                </p>
                <p className="mb-2">
                  <strong>Mobile users:</strong> Make sure you're opening the
                  link in the same browser where you requested it.
                </p>
                <p>Or enter any confirmation code</p>
              </div>

              <form onSubmit={handleConfirmationCode} className="space-y-4">
                <FireInput
                  type="text"
                  placeholder="Enter confirmation code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="text-center text-lg font-mono"
                  maxLength={6}
                />
                <FireButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Shield size={20} />
                  Verify & Continue
                </FireButton>
              </form>
            </div>
          )}
        </FireCard>

        {/* Enhanced Features */}
        <div className="mt-8 space-y-3">
          {[
            { icon: Shield, text: "No passwords required", color: "fire" },
            { icon: Zap, text: "Secure email authentication", color: "fire" },
            { icon: Flame, text: "Instant access to mining", color: "fire" },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 text-dark-300 hover:text-fire-400 transition-colors duration-300"
            >
              <div
                className={`w-2 h-2 bg-${feature.color}-500 rounded-full animate-pulse`}
              ></div>
              <feature.icon size={16} className="text-fire-500" />
              <span className="text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;

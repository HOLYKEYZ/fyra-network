# 🔥 Fyra Network - Fire Token Mining Platform

A full-stack responsive web application for mining Fire tokens with a modern dark theme and fire-inspired design.

## ✨ Features

### 🎨 Design & UI
- **Dark theme with red accents** - Fire-inspired look
- **Modern, sleek, and professional** design
- **Fully responsive** across desktop and mobile browsers
- **Smooth animations** with fire-themed loading and mining bars
- **5-second entry animation** featuring "fyra" text and fire effects

### ✅ Core Features
- **Email Authentication** - No password required, confirmation code system
- **Username Setup** - Letters only (a-z, A-Z), 3-20 characters
- **Mining Engine** - 36 Fire tokens per 24 hours with animated progress bar
- **Referral System** - 10% bonus on referred users' first mining
- **Unified Balance** - All earnings go into one Fire balance

### 🛠️ Admin Dashboard
- **User Management** - View all users, balances, and statistics
- **Platform Settings** - Adjust mining rates, referral bonuses, task rewards
- **Content Management** - FAQ, rewards, tasks, T&Cs, whitepaper links
- **Secure Access** - Admin-only via approved emails

### 🎁 Rewards & Tasks
- **Social Media Tasks** - Follow Twitter, join Telegram, subscribe to channels
- **Ad Integration** - Watch ads to earn tokens and start mining
- **Task Management** - Admin can add/remove/edit tasks and set rewards

### 🔄 Boost Mining
- **Referral System** - Share referral links to boost earnings
- **Statistics Dashboard** - Track referrals and earnings
- **Team Building** - Build your mining network

### ⚙️ Settings & Profile
- **User Profile** - Name, DoB, Country, Email, Username
- **Mining Team Panel** - List of referrals and mining status
- **KYC System** - Coming soon placeholder
- **Community Links** - Telegram and social media integration

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd fyra-network
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Hosting
   - Copy your Firebase config

4. **Configure Firebase**
   - Update `src/firebase/config.js` with your Firebase credentials
   - Set up Firestore security rules
   - Configure authentication methods

5. **Start development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Hosting
3. Update the config in `src/firebase/config.js`

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📱 User Flow

1. **Entry Animation** - 5-second fire-themed intro
2. **Login** - Email authentication with confirmation code
3. **Username Setup** - Choose unique username (letters only)
4. **Dashboard** - View stats and quick actions
5. **Mining** - Watch ad, start mining, earn 36 FIRE tokens
6. **Tasks** - Complete social media and ad tasks
7. **Referrals** - Share links to boost earnings
8. **Settings** - Manage profile and preferences

## 🏗️ Architecture

### Frontend
- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom fire theme
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Firebase Authentication** for user management
- **Firestore** for real-time database
- **Firebase Hosting** for deployment

### Key Components
- `EntryAnimation` - 5-second intro animation
- `Login` - Email authentication
- `UsernameSetup` - Username configuration
- `Dashboard` - Main user interface
- `Mining` - Mining engine with progress bar
- `Rewards` - Task completion system
- `BoostMining` - Referral system
- `Settings` - User profile management
- `AdminDashboard` - Admin controls

## 🎨 Customization

### Theme Colors
Update `tailwind.config.js` to modify the fire theme:
```javascript
colors: {
  'fire': {
    500: '#ef4444', // Main fire color
    600: '#dc2626', // Darker fire
    // ... more shades
  }
}
```

### Animations
Customize animations in `tailwind.config.js`:
```javascript
animation: {
  'fire': 'fire 2s ease-in-out infinite',
  'glow': 'glow 2s ease-in-out infinite alternate',
  // ... more animations
}
```

## 📊 Tokenomics

- **Token**: Fire (FIRE)
- **Total Supply**: 10 Billion
- **Distribution**:
  - Airdrop: 3B
  - Presale: 3B
  - Treasury: 2B
  - Contributors: 1B
  - Team: 1B
- **Mining Reward**: 36 FIRE per 24 hours
- **Referral Bonus**: 10% of referred user's first mining

## 🚀 Deployment

### Firebase Hosting
1. Build the project: `npm run build`
2. Deploy to Firebase: `firebase deploy`

### Custom Domain
1. Configure custom domain in Firebase Console
2. Update DNS settings
3. Wait for SSL certificate

## 🔒 Security Features

- **Email Authentication** - Secure login without passwords
- **Admin Access Control** - Restricted to approved emails
- **Input Validation** - Username format validation
- **Rate Limiting** - Profile edit restrictions
- **Secure Database Rules** - Firestore security

## 📱 Mobile Optimization

- **Responsive Design** - Works on all screen sizes
- **Touch-Friendly** - Optimized for mobile devices
- **PWA Ready** - Progressive Web App features
- **Mobile Navigation** - Collapsible menu system

## 🧪 Testing

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Build and preview
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Community**: Join our [Telegram group](https://t.me/fyranetwork)
- **Support**: Contact [@fyrasupportbot](https://t.me/fyrasupportbot)
- **Documentation**: Check our [whitepaper](whitepaper.pdf)

## 🔮 Future Features

- **Google & Telegram Login** - Additional authentication methods
- **KYC Verification** - Identity verification system
- **Token Withdrawal** - Withdraw earned tokens
- **Advanced Referrals** - Multi-level referral system
- **Staking & Governance** - Token utility expansion
- **Mobile App** - Native mobile applications

---

**Built with 🔥 by the Fyra Network Team**

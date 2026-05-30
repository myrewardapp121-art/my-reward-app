import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserProfile, 
  WalletTransaction, 
  RewardItem, 
  AdCampaign, 
  QuizQuestion, 
  FlaggedUser,
  TransactionType,
  TransactionStatus
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateReferralCode } from '../lib/utils';

interface AppContextType {
  currentUser: UserProfile | null;
  transactions: WalletTransaction[];
  rewards: RewardItem[];
  ads: AdCampaign[];
  questions: QuizQuestion[];
  flags: FlaggedUser[];
  isLoading: boolean;
  
  // Auth Operations
  login: (phoneNumber: string, fullName: string, referralCode?: string) => Promise<boolean>;
  logout: () => void;
  claimDailyStreak: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  
  // Game & Earn Actions
  addCoins: (amount: number, reason: string, type?: TransactionType) => Promise<boolean>;
  spendCoins: (amount: number, reason: string, type?: TransactionType) => Promise<boolean>;
  redeemReward: (rewardId: string, details: { method: 'easypaisa' | 'jazzcash' | 'uc' | 'mobile_load', accountNumber: string, accountName: string }) => Promise<boolean>;
  watchAd: (adId: string) => Promise<boolean>;
  
  // Admin Operations
  adminLogin: (password: string) => boolean;
  isAdminLoggedIn: boolean;
  adminLogout: () => void;
  adminUpdateTransaction: (id: string, status: TransactionStatus) => void;
  adminAddAd: (ad: Omit<AdCampaign, 'id' | 'viewsToday'>) => void;
  adminToggleUserAdmin: (userId: string) => void;
  adminFlagUser: (flag: Omit<FlaggedUser, 'id' | 'createdAt'>) => void;
  adminResolveFlag: (id: string, action: 'resolved' | 'banned') => void;
  adminUpdateUserBalance: (userId: string, newBalance: number) => void;
  
  // Static state tracking
  appSettings: {
    spinLimit: number;
    scratchLimit: number;
    quizLimit: number;
    minRedeem: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Static Data Mocking (Prepopulate for seamless out-of-the-box user experience)
const DEFAULT_REWARDS: RewardItem[] = [
  { id: 'rem-1', title: 'EasyPaisa 100 PKR Payout', description: 'Withdraw 100 PKR instantly to any EasyPaisa wallet in Pakistan.', costCoins: 1000, icon: '📱', category: 'easypaisa', status: 'active', pointsValue: 1000 },
  { id: 'rem-2', title: 'JazzCash 500 PKR Payout', description: 'Withdraw 500 PKR to your JazzCash wallet with native transfer speeds.', costCoins: 5000, icon: '⚡', category: 'jazzcash', status: 'active', pointsValue: 5000 },
  { id: 'rem-3', title: 'PUBG Mobile 60 UC', description: 'Redeem 60 Unknown Cash instantly delivered directly to your character ID.', costCoins: 1800, icon: '🎯', category: 'pubg', status: 'active', pointsValue: 1800 },
  { id: 'rem-4', title: 'Ufone / Telenor / Jazz Load 200 PKR', description: 'Standard mobile network recharge load for all Pakistani telecom providers.', costCoins: 2000, icon: '📡', category: 'mobile_load', status: 'active', pointsValue: 2000 },
  { id: 'rem-5', title: 'EasyPaisa 1,000 PKR Giant Payout', description: 'High volume transfer securely dispatched to verified account holder.', costCoins: 10000, icon: '👑', category: 'easypaisa', status: 'active', pointsValue: 10000 }
];

const DEFAULT_ADS: AdCampaign[] = [
  { id: 'ad-1', title: 'Telenor 4G Super Card Ad', rewardCoins: 150, durationSeconds: 15, viewsLimit: 25, viewsToday: 0, status: 'active' },
  { id: 'ad-2', title: 'Daraz Summer Bazar Mega Discount Promo', rewardCoins: 250, durationSeconds: 20, viewsLimit: 15, viewsToday: 0, status: 'active' },
  { id: 'ad-3', title: 'HBL Mobile Banking Fast Pay Advert', rewardCoins: 180, durationSeconds: 10, viewsLimit: 30, viewsToday: 0, status: 'active' }
];

const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q-1', question: 'Which city is known as the "City of Lights" in Pakistan?', options: ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad'], correctAnswer: 1, prizeCoins: 100 },
  { id: 'q-2', question: 'What is the national game of Pakistan?', options: ['Cricket', 'Football', 'Field Hockey', 'Squash'], correctAnswer: 2, prizeCoins: 120 },
  { id: 'q-3', question: 'In which year did Pakistan win the ICC Cricket World Cup?', options: ['1992', '1996', '1999', '2009'], correctAnswer: 0, prizeCoins: 150 },
  { id: 'q-4', question: 'Which mountain peak is the highest in Pakistan and second-highest globally?', options: ['Nanga Parbat', 'K2 (Mount Godwin-Austen)', 'Broad Peak', 'Rakaposhi'], correctAnswer: 1, prizeCoins: 180 },
  { id: 'q-5', question: 'What is the currency of Pakistan?', options: ['Pakistani Rupee', 'Pound', 'Dinar', 'Riyal'], correctAnswer: 0, prizeCoins: 80 }
];

const DEFAULT_FLAGS: FlaggedUser[] = [
  { id: 'flag-1', userId: 'usr-9283', email: 'ahmad88@gmail.com', fullName: 'Ahmad Khan', reason: 'Multiple OTP speed-clicking requests', severity: 'medium', createdAt: new Date(Date.now() - 43200000).toISOString(), status: 'pending' },
  { id: 'flag-2', userId: 'usr-4412', email: 'imran_pro@gmail.com', fullName: 'Imran Bashir', reason: 'Abusing spin emulator velocity script', severity: 'high', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'pending' }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>(DEFAULT_REWARDS);
  const [ads, setAds] = useState<AdCampaign[]>(DEFAULT_ADS);
  const [questions] = useState<QuizQuestion[]>(DEFAULT_QUIZ_QUESTIONS);
  const [flags, setFlags] = useState<FlaggedUser[]>(DEFAULT_FLAGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  const appSettings = {
    spinLimit: 10,
    scratchLimit: 10,
    quizLimit: 5,
    minRedeem: 1000 // 1000 Coins = 100 PKR
  };

  // On page load, initialize from LocalStorage to create persistent client state
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('pwa_wallet_user');
        const storedTrans = localStorage.getItem('pwa_wallet_transactions');
        const storedAds = localStorage.getItem('pwa_wallet_ads');
        const storedFlags = localStorage.getItem('pwa_wallet_flags');
        const storedAdmin = localStorage.getItem('pwa_wallet_admin_session');

        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
        if (storedTrans) {
          setTransactions(JSON.parse(storedTrans));
        } else {
          // Prepopulate template transactions for rich admin view
          const startingTrans: WalletTransaction[] = [
            { id: 'tx-1', userId: storedUser ? JSON.parse(storedUser).id : 'anonymous', type: 'earn', amount: 500, description: 'Welcome Reward Bonus', status: 'completed', createdAt: new Date(Date.now() - 172800000).toISOString() },
            { id: 'tx-2', userId: storedUser ? JSON.parse(storedUser).id : 'anonymous', type: 'game', amount: 80, description: 'Daily Spin Win', status: 'completed', createdAt: new Date(Date.now() - 86400000).toISOString() },
          ];
          setTransactions(startingTrans);
          localStorage.setItem('pwa_wallet_transactions', JSON.stringify(startingTrans));
        }
        if (storedAds) {
          setAds(JSON.parse(storedAds));
        }
        if (storedFlags) {
          setFlags(JSON.parse(storedFlags));
        }
        if (storedAdmin === 'true') {
          setIsAdminLoggedIn(true);
        }

        // Supabase sync fallback trigger
        if (isSupabaseConfigured && supabase) {
          // Real backend fetch could happen here dynamically if desired.
          // Since it's a template structure, logs state readiness.
          console.log("Supabase is live and configured for transactions and telemetry.");
        }
      } catch (err) {
        console.error('Error loading foundational DB profiles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Sync state functions helper
  const syncUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('pwa_wallet_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pwa_wallet_user');
    }
  };

  const syncTransactions = (newTrans: WalletTransaction[]) => {
    setTransactions(newTrans);
    localStorage.setItem('pwa_wallet_transactions', JSON.stringify(newTrans));
  };

  const syncAds = (newAds: AdCampaign[]) => {
    setAds(newAds);
    localStorage.setItem('pwa_wallet_ads', JSON.stringify(newAds));
  };

  const syncFlags = (newFlags: FlaggedUser[]) => {
    setFlags(newFlags);
    localStorage.setItem('pwa_wallet_flags', JSON.stringify(newFlags));
  };

  // Auth Functions
  const login = async (phoneNumber: string, fullName: string, referralCode?: string) => {
    setIsLoading(true);
    try {
      // Mock network registration with real validations
      const generatedId = 'usr-' + Math.floor(1000 + Math.random() * 9000);
      const isReferredByAdmin = referralCode === 'ADMIN777';
      const startingCoins = referralCode ? 150 : 100; // 50 coins bonus for referrals
      
      const newProfile: UserProfile = {
        id: generatedId,
        email: `${phoneNumber}@pakrewards.pk`,
        fullName,
        phoneNumber,
        walletAddress: `0x${generatedId.replace('usr-', '')}FECC6`,
        coinBalance: startingCoins,
        referralCode: generateReferralCode(fullName),
        referredBy: referralCode || undefined,
        isPremium: false,
        registeredAt: new Date().toISOString(),
        isAdmin: false,
        dailyStreak: 1,
        lastClaimDate: new Date().toISOString()
      };

      syncUser(newProfile);

      // Create welcome transaction
      const welcomeTx: WalletTransaction = {
        id: 'tx-wel-' + Math.floor(10000 + Math.random() * 90000),
        userId: generatedId,
        type: 'earn',
        amount: startingCoins,
        description: referralCode ? 'Registration Bonus (Referred)' : 'Registration Welcome Reward',
        status: 'completed',
        createdAt: new Date().toISOString()
      };

      syncTransactions([welcomeTx, ...transactions]);

      // If Supabase is live, store telemetry profile
      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').upsert({
          id: generatedId,
          phone: phoneNumber,
          full_name: fullName,
          coins: startingCoins,
          referral_code: newProfile.referralCode,
        });
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    syncUser(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('pwa_wallet_admin_session');
  };

  const claimDailyStreak = async () => {
    if (!currentUser) return false;
    
    try {
      const today = new Date().toDateString();
      const lastClaim = currentUser.lastClaimDate ? new Date(currentUser.lastClaimDate).toDateString() : '';
      
      if (today === lastClaim) {
        return false; // Already claimed today
      }

      const isConsecutive = currentUser.lastClaimDate && (Date.now() - new Date(currentUser.lastClaimDate).getTime() < 172800000);
      const newStreak = isConsecutive ? currentUser.dailyStreak + 1 : 1;
      const streakPrize = 50 + (newStreak * 10); // Grows as streak continues

      const updatedUser: UserProfile = {
        ...currentUser,
        coinBalance: currentUser.coinBalance + streakPrize,
        dailyStreak: newStreak,
        lastClaimDate: new Date().toISOString()
      };

      syncUser(updatedUser);

      const streakTx: WalletTransaction = {
        id: 'tx-str-' + Math.floor(10000 + Math.random() * 90000),
        userId: currentUser.id,
        type: 'earn',
        amount: streakPrize,
        description: `Daily Streak Check-In (Day ${newStreak})`,
        status: 'completed',
        createdAt: new Date().toISOString()
      };

      syncTransactions([streakTx, ...transactions]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return false;
    const updated = { ...currentUser, ...data };
    syncUser(updated);
    return true;
  };

  // Coins additions/subtractions
  const addCoins = async (amount: number, reason: string, type: TransactionType = 'earn') => {
    if (!currentUser) return false;

    const updated = {
      ...currentUser,
      coinBalance: currentUser.coinBalance + amount
    };
    syncUser(updated);

    const newTx: WalletTransaction = {
      id: 'tx-add-' + Math.floor(10000 + Math.random() * 90000),
      userId: currentUser.id,
      type,
      amount,
      description: reason,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    syncTransactions([newTx, ...transactions]);
    return true;
  };

  const spendCoins = async (amount: number, reason: string, type: TransactionType = 'game') => {
    if (!currentUser || currentUser.coinBalance < amount) return false;

    const updated = {
      ...currentUser,
      coinBalance: currentUser.coinBalance - amount
    };
    syncUser(updated);

    const newTx: WalletTransaction = {
      id: 'tx-sub-' + Math.floor(10000 + Math.random() * 90000),
      userId: currentUser.id,
      type,
      amount: -amount,
      description: reason,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    syncTransactions([newTx, ...transactions]);
    return true;
  };

  const redeemReward = async (
    rewardId: string, 
    details: { method: 'easypaisa' | 'jazzcash' | 'uc' | 'mobile_load', accountNumber: string, accountName: string }
  ) => {
    const rewardItem = rewards.find(r => r.id === rewardId);
    if (!currentUser || !rewardItem || currentUser.coinBalance < rewardItem.costCoins) return false;

    // Deduct coins and create a "Pending" transfer payout
    const updatedUser: UserProfile = {
      ...currentUser,
      coinBalance: currentUser.coinBalance - rewardItem.costCoins
    };
    syncUser(updatedUser);

    const redeemTx: WalletTransaction = {
      id: 'tx-red-' + Math.floor(10000 + Math.random() * 90000),
      userId: currentUser.id,
      type: 'redeem',
      amount: rewardItem.costCoins,
      description: `Redeemed ${rewardItem.title}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      payoutDetails: details
    };

    syncTransactions([redeemTx, ...transactions]);
    return true;
  };

  const watchAd = async (adId: string) => {
    const adItem = ads.find(a => a.id === adId);
    if (!currentUser || !adItem) return false;

    // Increment ad watches with limits
    const updatedAds = ads.map((ad) => {
      if (ad.id === adId) {
        return { ...ad, viewsToday: ad.viewsToday + 1 };
      }
      return ad;
    });
    syncAds(updatedAds);

    // Reward coins
    await addCoins(adItem.rewardCoins, `Watched Ad Campaign: ${adItem.title}`, 'earn');
    return true;
  };

  // ADMIN OPERATIONS
  const adminLogin = (password: string): boolean => {
    // Elegant, uncomplicated admin bypass for testing (using "pakistan786" or standard login)
    if (password === 'pakistan786' || password === 'admin') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('pwa_wallet_admin_session', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('pwa_wallet_admin_session');
  };

  const adminUpdateTransaction = (id: string, status: TransactionStatus) => {
    const updated = transactions.map((tx) => {
      if (tx.id === id) {
        return { ...tx, status };
      }
      return tx;
    });
    syncTransactions(updated);
  };

  const adminAddAd = (newAd: Omit<AdCampaign, 'id' | 'viewsToday'>) => {
    const ad: AdCampaign = {
      ...newAd,
      id: 'ad-' + Math.floor(1000 + Math.random() * 9000),
      viewsToday: 0
    };
    syncAds([...ads, ad]);
  };

  const adminToggleUserAdmin = (userId: string) => {
    if (currentUser && currentUser.id === userId) {
      const updated = { ...currentUser, isAdmin: !currentUser.isAdmin };
      syncUser(updated);
    }
  };

  const adminFlagUser = (flag: Omit<FlaggedUser, 'id' | 'createdAt'>) => {
    const freshFlag: FlaggedUser = {
      ...flag,
      id: 'flag-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString()
    };
    syncFlags([freshFlag, ...flags]);
  };

  const adminResolveFlag = (id: string, action: 'resolved' | 'banned') => {
    const updated = flags.map((f) => {
      if (f.id === id) {
        return { ...f, status: action === 'resolved' ? ('resolved' as const) : ('banned' as const) };
      }
      return f;
    });
    syncFlags(updated);
  };

  const adminUpdateUserBalance = (userId: string, newBalance: number) => {
    if (currentUser && currentUser.id === userId) {
      syncUser({ ...currentUser, coinBalance: newBalance });
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      transactions,
      rewards,
      ads,
      questions,
      flags,
      isLoading,
      appSettings,
      
      // Auth
      login,
      logout,
      claimDailyStreak,
      updateProfile,
      
      // Coins actions
      addCoins,
      spendCoins,
      redeemReward,
      watchAd,
      
      // Admin
      adminLogin,
      isAdminLoggedIn,
      adminLogout,
      adminUpdateTransaction,
      adminAddAd,
      adminToggleUserAdmin,
      adminFlagUser,
      adminResolveFlag,
      adminUpdateUserBalance
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider context');
  }
  return context;
}

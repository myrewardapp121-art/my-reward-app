export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  walletAddress?: string;
  coinBalance: number;
  referralCode: string;
  referredBy?: string;
  isPremium: boolean;
  registeredAt: string;
  isAdmin: boolean;
  avatarUrl?: string;
  fcmToken?: string;
  dailyStreak: number;
  lastClaimDate?: string;
}

export type TransactionType = 'earn' | 'redeem' | 'transfer' | 'game' | 'referral' | 'admin';
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  createdAt: string;
  payoutDetails?: {
    method: 'easypaisa' | 'jazzcash' | 'uc' | 'mobile_load';
    accountNumber: string;
    accountName: string;
  };
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  costCoins: number;
  icon: string;
  category: 'easypaisa' | 'jazzcash' | 'pubg' | 'mobile_load' | 'gadget';
  status: 'active' | 'out_of_stock';
  pointsValue: number;
}

export interface AdCampaign {
  id: string;
  title: string;
  rewardCoins: number;
  durationSeconds: number;
  videoUrl?: string;
  viewsLimit: number;
  viewsToday: number;
  status: 'active' | 'paused';
}

export interface GameState {
  dailyPlaysLeft: number;
  lastPlayedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index (0-3)
  prizeCoins: number;
}

export interface FlaggedUser {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'pending' | 'resolved' | 'banned';
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

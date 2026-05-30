import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import PageWrapper from './components/layout/PageWrapper';

// Auth Pages
import Login from './pages/auth/Login';
import Verify from './pages/auth/Verify';

// Onboarding Pages
import OnboardingProfile from './pages/onboarding/Profile';
import OnboardingWallet from './pages/onboarding/Wallet';

// Standard App Pages
import Home from './pages/app/Home';
import Earn from './pages/app/Earn';
import Rewards from './pages/app/Rewards';
import Referral from './pages/app/Referral';
import Profile from './pages/app/Profile';
import Games from './pages/app/Games';
import Notifications from './pages/app/Notifications';
import Premium from './pages/app/Premium';
import Terms from './pages/app/Terms';
import PrivacyPolicy from './pages/app/PrivacyPolicy';

// Sub games pages
import SpinGame from './pages/app/games/Spin';
import ScratchGame from './pages/app/games/Scratch';
import QuizGame from './pages/app/games/Quiz';

// Admin Core Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminFlags from './pages/admin/Flags';
import AdminAds from './pages/admin/Ads';
import AdminGames from './pages/admin/Games';
import AdminTasks from './pages/admin/Tasks';
import AdminSettings from './pages/admin/Settings';

// Helper Route Guard for authenticated user views
function UserRouteGuard({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Helper Route Guard for administrative panels
function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn } = useApp();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// Global Redirect Resolver Router entry block
function RootRouteRedirect() {
  const { currentUser } = useApp();
  
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <PageWrapper>
            <Routes>
              {/* Central Gatekeeper Gateway */}
              <Route path="/" element={<RootRouteRedirect />} />

              {/* Security Authorization Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<Verify />} />

              {/* Onboarding Steps */}
              <Route path="/onboarding/profile" element={<OnboardingProfile />} />
              <Route path="/onboarding/wallet" element={<OnboardingWallet />} />

              {/* Customer Base Application */}
              <Route path="/home" element={<UserRouteGuard><Home /></UserRouteGuard>} />
              <Route path="/earn" element={<UserRouteGuard><Earn /></UserRouteGuard>} />
              <Route path="/rewards" element={<UserRouteGuard><Rewards /></UserRouteGuard>} />
              <Route path="/referral" element={<UserRouteGuard><Referral /></UserRouteGuard>} />
              <Route path="/games" element={<UserRouteGuard><Games /></UserRouteGuard>} />
              <Route path="/premium" element={<UserRouteGuard><Premium /></UserRouteGuard>} />
              <Route path="/profile" element={<UserRouteGuard><Profile /></UserRouteGuard>} />
              <Route path="/notifications" element={<UserRouteGuard><Notifications /></UserRouteGuard>} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Sub-games Lobbies */}
              <Route path="/games/spin" element={<UserRouteGuard><SpinGame /></UserRouteGuard>} />
              <Route path="/games/scratch" element={<UserRouteGuard><ScratchGame /></UserRouteGuard>} />
              <Route path="/games/quiz" element={<UserRouteGuard><QuizGame /></UserRouteGuard>} />

              {/* Administrator Module Controls */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminRouteGuard><AdminDashboard /></AdminRouteGuard>} />
              <Route path="/admin/users" element={<AdminRouteGuard><AdminUsers /></AdminRouteGuard>} />
              <Route path="/admin/flags" element={<AdminRouteGuard><AdminFlags /></AdminRouteGuard>} />
              <Route path="/admin/ads" element={<AdminRouteGuard><AdminAds /></AdminRouteGuard>} />
              <Route path="/admin/games" element={<AdminRouteGuard><AdminGames /></AdminRouteGuard>} />
              <Route path="/admin/tasks" element={<AdminRouteGuard><AdminTasks /></AdminRouteGuard>} />
              <Route path="/admin/settings" element={<AdminRouteGuard><AdminSettings /></AdminRouteGuard>} />

              {/* Fallback route resolver */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageWrapper>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

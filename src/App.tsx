import { useState } from 'react';
import MobileShell from './mobile/MobileShell';
import { MobileSplashScreen } from './mobile/screens/MobileSplashScreen';
import { MobileAuthScreen } from './mobile/screens/MobileAuthScreen';
import { X, AlertCircle } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('terniva_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(() => {
    try {
      const saved = localStorage.getItem('terniva_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // State untuk modal login kontekstual
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const handleAuthSuccess = (userData: { name: string; email: string; phone: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setAuthReason(undefined);
    try {
      localStorage.setItem('terniva_logged_in', 'true');
      localStorage.setItem('terniva_user_profile', JSON.stringify(userData));
    } catch {
      // ignore
    }
    if (pendingCallback) {
      const cb = pendingCallback;
      setPendingCallback(null);
      cb();
    }
  };

  const handleRequireAuth = (reason?: string, onDone?: () => void) => {
    setAuthReason(reason);
    if (onDone) {
      setPendingCallback(() => onDone);
    } else {
      setPendingCallback(null);
    }
    setShowAuthModal(true);
  };

  const handleOpenLogin = () => {
    handleRequireAuth('Silakan masuk ke akun Terniva Anda untuk pengalaman penuh.');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem('terniva_logged_in');
    } catch {
      // ignore
    }
  };

  // 1. Splash Screen Mode (opsional jika diminta)
  if (showSplash) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl p-6">
          <MobileSplashScreen onComplete={() => setShowSplash(false)} />
        </div>
      </div>
    );
  }

  // 2. Default: Halaman utama langsung tampil (Home/Beranda) tanpa halaman login di awal!
  return (
    <>
      <MobileShell
        onLogout={handleLogout}
        onReplaySplash={() => setShowSplash(true)}
        user={user}
        isAuthenticated={isAuthenticated}
        onOpenLogin={handleOpenLogin}
        onRequireAuth={handleRequireAuth}
      />

      {/* Modal Login Interaktif: Muncul HANYA saat klik login, akan transaksi beli barang, atau akses data sensitif */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white shadow-2xl border border-stone-300 overflow-hidden my-auto animate-in fade-in duration-200">
            {/* Header Modal Login */}
            <div className="bg-emerald-950 text-white px-4 py-3 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-800 text-emerald-200 flex items-center justify-center text-xs font-bold font-mono">
                  T
                </div>
                <div>
                  <span className="text-sm font-bold tracking-tight">Masuk ke Akun Terniva</span>
                  <span className="text-[10px] text-emerald-300 ml-2 hidden sm:inline">
                    Smart Agritech & Escrow Platform
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setPendingCallback(null);
                  setAuthReason(undefined);
                }}
                className="text-stone-300 hover:text-white p-1 transition-colors cursor-pointer"
                title="Tutup / Lanjut Jelajah Sebagai Tamu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner Alasan Login jika dipicu oleh transaksi atau data */}
            {authReason && (
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Autentikasi Diperlukan:</strong>
                  <span>{authReason}</span>
                </div>
              </div>
            )}

            {/* Form Login / Register */}
            <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
              <MobileAuthScreen
                onAuthSuccess={handleAuthSuccess}
                onSkipGuest={() => {
                  setShowAuthModal(false);
                  setPendingCallback(null);
                  setAuthReason(undefined);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

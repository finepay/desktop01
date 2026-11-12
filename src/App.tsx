import { useState } from 'react';
import MobileShell from './mobile/MobileShell';
import { MobileSplashScreen } from './mobile/screens/MobileSplashScreen';
import { MobileAuthScreen } from './mobile/screens/MobileAuthScreen';
import { Sprout } from 'lucide-react';

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

  const handleAuthSuccess = (userData: { name: string; email: string; phone: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('terniva_logged_in', 'true');
      localStorage.setItem('terniva_user_profile', JSON.stringify(userData));
    } catch {
      // ignore
    }
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

  // 1. Splash Screen Mode (Responsive)
  if (showSplash) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl p-6">
          <MobileSplashScreen onComplete={() => setShowSplash(false)} />
        </div>
      </div>
    );
  }

  // 2. Authentication Screen (Responsive Desktop Split View)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col justify-between font-sans">
        {/* Top Desktop Bar */}
        <header className="bg-emerald-900 text-white border-b border-emerald-950 py-3 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white flex items-center justify-center text-emerald-800">
              <Sprout className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">Terniva</span>
              <span className="text-xs text-emerald-300 ml-2 font-mono hidden sm:inline">
                Smart Agritech Marketplace
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="text-xs font-bold text-emerald-200 hover:text-white underline cursor-pointer"
          >
            Masuk Sebagai Tamu (Guest) →
          </button>
        </header>

        {/* Desktop Split Auth Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 bg-white border border-stone-300 shadow-xl overflow-hidden">
            {/* Left Hero Banner (Desktop) */}
            <div className="hidden lg:flex lg:col-span-5 bg-emerald-950 text-white p-8 flex-col justify-between relative overflow-hidden">
              <img
                src="/src/assets/images/terniva_hero_landscape_1794449096818.jpg"
                alt="Terniva Agritech"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 space-y-3">
                <span className="bg-emerald-800 text-emerald-200 text-xs font-mono font-bold px-2 py-0.5">
                  Platform Agribisnis Terintegrasi
                </span>
                <h2 className="text-2xl font-bold leading-tight">
                  Jual Beli Komoditas, Kemitraan & Pantau Panen IoT Indonesia
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Menghubungkan kelompok tani & peternak langsung dengan jaringan hotel, restoran,
                  pasar induk, dan buyer ekspor dunia.
                </p>
              </div>

              <div className="relative z-10 pt-6 border-t border-white/20 text-xs space-y-2 text-emerald-200">
                <div className="flex items-center gap-1.5">
                  <span>✓</span>
                  <span>Pasar Domestik (Hotel, Resto, Pasar, UMKM) & Ekspor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>✓</span>
                  <span>Titip Tani & Ternak dengan CCTV IoT 24/7</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>✓</span>
                  <span>Konsultasi Dokter Hewan & Tanaman Bersertifikat</span>
                </div>
              </div>
            </div>

            {/* Right Auth Form */}
            <div className="lg:col-span-7 p-4 sm:p-8">
              <MobileAuthScreen
                onAuthSuccess={handleAuthSuccess}
                onSkipGuest={() => setIsAuthenticated(true)}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-stone-500 border-t border-stone-200 bg-white">
          © 2026 PT Terniva Agroteknologi Nusantara. Seluruh Hak Cipta Dilindungi.
        </footer>
      </div>
    );
  }

  // 3. Authenticated: Full Responsive Desktop App
  return (
    <MobileShell
      onLogout={handleLogout}
      user={user}
    />
  );
}

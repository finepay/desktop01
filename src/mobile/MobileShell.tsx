import { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Store,
  Bell,
  User,
  Radio,
  MapPin,
  ChevronRight,
  Stethoscope,
  Globe2,
  Handshake,
  Activity,
  Layers,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Truck,
  Leaf,
  LogOut,
  Play,
  ArrowLeft,
  X,
  Eye,
  CheckCircle2,
  Clock,
  Thermometer,
} from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import MobileHomeScreen from './screens/MobileHomeScreen';
import MobilePantauPanenScreen from './screens/MobilePantauPanenScreen';
import MobileMitraScreen from './screens/MobileMitraScreen';
import MobileEksporScreen from './screens/MobileEksporScreen';
import MobileKonsultasiScreen from './screens/MobileKonsultasiScreen';
import MobileCartScreen from './screens/MobileCartScreen';
import MobileCheckoutScreen from './screens/MobileCheckoutScreen';
import MobileOrderSuccessScreen from './screens/MobileOrderSuccessScreen';
import MobileProductDetailScreen from './screens/MobileProductDetailScreen';
import MobilePeluangEksporScreen from './screens/MobilePeluangEksporScreen';
import MobileLiveScreen from './screens/MobileLiveScreen';
import MobileNotificationScreen from './screens/MobileNotificationScreen';
import MobileAccountScreen from './screens/MobileAccountScreen';
import MobileSellerCenterScreen from './screens/MobileSellerCenterScreen';
import MobileSearchListingScreen from './screens/MobileSearchListingScreen';
import LiveChatModal from '../components/LiveChatModal';
import { MobileTab, MobileProduct, MobileCartItem, RestockLogItem } from './types';
import { MOBILE_PRODUCTS, INITIAL_ETALASES } from './mobileData';
import { DOCTORS_DATA } from '../data/ternivaData';
import { Doctor } from '../types';

interface MobileShellProps {
  onLogout?: () => void;
  onReplaySplash?: () => void;
  user?: { name: string; email: string; phone: string } | null;
}

export default function MobileShell({
  onLogout,
  onReplaySplash,
  user,
}: MobileShellProps = {}) {
  const [selectedTab, setSelectedTab] = useState<MobileTab>('home');
  const [activeSubScreen, setActiveSubScreen] = useState<
    | 'none'
    | 'pantau_panen'
    | 'mitra'
    | 'ekspor'
    | 'konsultasi'
    | 'cart'
    | 'checkout'
    | 'order_success'
    | 'product_detail'
    | 'seller_center'
    | 'search_listing'
  >('none');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Products state (persisted to localStorage)
  const [products, setProducts] = useState<MobileProduct[]>(() => {
    try {
      const saved = localStorage.getItem('terniva_products_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return MOBILE_PRODUCTS;
  });

  // Etalases state (persisted to localStorage)
  const [etalases, setEtalases] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('terniva_etalases_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ETALASES;
  });

  // Restock Logs state (persisted to localStorage)
  const [restockLogs, setRestockLogs] = useState<RestockLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('terniva_restock_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'rst-1',
        productId: 'prod-2',
        productName: 'Kopi Arabika Gayo Green Beans Specialty (Grade 1)',
        addedStock: 200,
        newStock: 1200,
        date: 'Kemarin, 14:15 WIB',
      },
      {
        id: 'rst-2',
        productId: 'prod-4',
        productName: 'Konsentrat Pakan Sapi Penggemukan High Protein (50kg)',
        addedStock: 50,
        newStock: 350,
        date: '3 hari lalu',
      },
    ];
  });

  // Product management operations
  const handleAddProduct = (newProd: MobileProduct) => {
    setProducts((prev) => {
      const updated = [newProd, ...prev];
      try {
        localStorage.setItem('terniva_products_catalog', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleUpdateProduct = (updatedProd: MobileProduct) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === updatedProd.id ? updatedProd : p));
      try {
        localStorage.setItem('terniva_products_catalog', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      try {
        localStorage.setItem('terniva_products_catalog', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleRestockProduct = (productId: string, addedStock: number) => {
    setProducts((prev) => {
      let restockedItemName = '';
      let calculatedNewStock = 0;
      const updated = prev.map((p) => {
        if (p.id === productId) {
          restockedItemName = p.name;
          calculatedNewStock = (p.stock || 0) + addedStock;
          return { ...p, stock: calculatedNewStock };
        }
        return p;
      });
      try {
        localStorage.setItem('terniva_products_catalog', JSON.stringify(updated));
      } catch {
        // ignore
      }

      if (restockedItemName) {
        const newLog: RestockLogItem = {
          id: `rst-${Date.now()}`,
          productId,
          productName: restockedItemName,
          addedStock,
          newStock: calculatedNewStock,
          date: 'Hari ini, Baru saja',
        };
        setRestockLogs((oldLogs) => {
          const updatedLogs = [newLog, ...oldLogs];
          try {
            localStorage.setItem('terniva_restock_logs', JSON.stringify(updatedLogs));
          } catch {
            // ignore
          }
          return updatedLogs;
        });
      }

      return updated;
    });
  };

  const handleAddEtalase = (name: string) => {
    setEtalases((prev) => {
      if (prev.includes(name)) return prev;
      const updated = [...prev, name];
      try {
        localStorage.setItem('terniva_etalases_list', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleDeleteEtalase = (name: string) => {
    setEtalases((prev) => {
      const updated = prev.filter((e) => e !== name);
      try {
        localStorage.setItem('terniva_etalases_list', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Cart and Order state
  const [cartItems, setCartItems] = useState<MobileCartItem[]>([
    { product: MOBILE_PRODUCTS[1], quantity: 2, isSelected: true },
    { product: MOBILE_PRODUCTS[3], quantity: 1, isSelected: true },
  ]);
  const [activeProductDetail, setActiveProductDetail] = useState<MobileProduct | null>(null);
  const [activeDoctorChat, setActiveDoctorChat] = useState<Doctor | null>(null);

  // Active completed order data for the payment page
  const [activeOrderData, setActiveOrderData] = useState<{
    orderNumber: string;
    items: MobileCartItem[];
    subtotal: number;
    shippingFee: number;
    totalPayment: number;
    courier: string;
    paymentMethod: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
  } | null>(null);

  // Cart operations
  const handleAddToCart = (product: MobileProduct, qty: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty, isSelected: true }];
    });
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleToggleSelectCart = (productId: string) => {
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, isSelected: !i.isSelected } : i))
    );
  };

  const handleToggleSelectAllCart = (selected: boolean) => {
    setCartItems((prev) => prev.map((i) => ({ ...i, isSelected: selected })));
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // Buy Now direct flow
  const handleBuyNowDirect = (product: MobileProduct, qty: number = 1) => {
    const directItem: MobileCartItem = { product, quantity: qty, isSelected: true };
    setActiveOrderData({
      orderNumber: `TRN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      items: [directItem],
      subtotal: product.price * qty,
      shippingFee: 25000,
      totalPayment: product.price * qty + 25000,
      courier: 'JNE Agri Cargo Dingin (Est. 1-2 hari)',
      paymentMethod: 'BCA Virtual Account',
      recipientName: 'Restoran Nusantara Rasa (Budi Santoso)',
      recipientPhone: '081234567890',
      recipientAddress: 'Jl. Thamrin No. 45, Menteng, Jakarta Pusat (10350)',
    });
    setActiveSubScreen('checkout');
  };

  // Video Buy direct flow
  const handleBuyFromVideo = (productName: string, price: number) => {
    const matched = MOBILE_PRODUCTS.find((p) => p.name.includes(productName)) || MOBILE_PRODUCTS[0];
    handleBuyNowDirect(matched, 1);
  };

  const renderActiveScreen = () => {
    // 1. Dedicated Subscreens & Full Purchase Flow
    if (activeSubScreen === 'cart') {
      return (
        <MobileCartScreen
          cartItems={cartItems}
          onBack={() => setActiveSubScreen('none')}
          onUpdateQty={handleUpdateCartQty}
          onToggleSelect={handleToggleSelectCart}
          onToggleSelectAll={handleToggleSelectAllCart}
          onCheckout={(selected) => {
            const sub = selected.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
            setActiveOrderData({
              orderNumber: `TRN-${Math.floor(10000000 + Math.random() * 90000000)}`,
              items: selected,
              subtotal: sub,
              shippingFee: 25000,
              totalPayment: sub + 25000,
              courier: 'JNE Agri Cargo Dingin (Est. 1-2 hari)',
              paymentMethod: 'BCA Virtual Account',
              recipientName: 'Restoran Nusantara Rasa (Budi Santoso)',
              recipientPhone: '081234567890',
              recipientAddress: 'Jl. Thamrin No. 45, Menteng, Jakarta Pusat (10350)',
            });
            setActiveSubScreen('checkout');
          }}
          onContinueShopping={() => setActiveSubScreen('none')}
        />
      );
    }

    if (activeSubScreen === 'checkout' && activeOrderData) {
      return (
        <MobileCheckoutScreen
          items={activeOrderData.items}
          onBack={() => setActiveSubScreen('cart')}
          onProceedPayment={(order) => {
            setActiveOrderData(order);
            // Remove checked out items from cart
            const checkedOutIds = order.items.map((i) => i.product.id);
            setCartItems((prev) => prev.filter((i) => !checkedOutIds.includes(i.product.id)));
            setActiveSubScreen('order_success');
          }}
        />
      );
    }

    if (activeSubScreen === 'order_success' && activeOrderData) {
      return (
        <MobileOrderSuccessScreen
          orderData={activeOrderData}
          onGoHome={() => {
            setActiveSubScreen('none');
            setSelectedTab('home');
          }}
          onViewMyOrders={() => {
            setActiveSubScreen('none');
            setSelectedTab('akun');
          }}
        />
      );
    }

    if (activeSubScreen === 'pantau_panen') {
      return (
        <MobilePantauPanenScreen
          onBack={() => setActiveSubScreen('none')}
          onNavigateToMitra={() => setActiveSubScreen('mitra')}
        />
      );
    }

    if (activeSubScreen === 'mitra') {
      return <MobileMitraScreen onBack={() => setActiveSubScreen('none')} />;
    }

    if (activeSubScreen === 'ekspor') {
      return (
        <MobilePeluangEksporScreen
          isSubScreen={true}
          onBack={() => setActiveSubScreen('none')}
        />
      );
    }

    if (activeSubScreen === 'konsultasi') {
      return (
        <MobileKonsultasiScreen
          onBack={() => setActiveSubScreen('none')}
          onOpenLiveChat={(doc) => setActiveDoctorChat(doc)}
          onAddToCart={(p, qty) => handleAddToCart(p, qty)}
          userWalletBalance={4850000}
        />
      );
    }

    if (activeSubScreen === 'seller_center') {
      return (
        <MobileSellerCenterScreen
          onBack={() => setActiveSubScreen('none')}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onRestockProduct={handleRestockProduct}
          etalases={etalases}
          onAddEtalase={handleAddEtalase}
          onDeleteEtalase={handleDeleteEtalase}
          restockLogs={restockLogs}
          onSelectProductPreview={(p) => {
            setActiveProductDetail(p);
            setActiveSubScreen('product_detail');
          }}
        />
      );
    }

    if (activeSubScreen === 'search_listing') {
      return (
        <MobileSearchListingScreen
          onBack={() => setActiveSubScreen('none')}
          products={products}
          initialQuery={searchQuery}
          onSelectProduct={(p) => {
            setActiveProductDetail(p);
            setActiveSubScreen('product_detail');
          }}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          cartCount={totalCartCount}
          onGoToCart={() => setActiveSubScreen('cart')}
        />
      );
    }

    if (activeSubScreen === 'product_detail' && activeProductDetail) {
      return (
        <MobileProductDetailScreen
          product={activeProductDetail}
          onBack={() => setActiveSubScreen('none')}
          onAddToCart={(p, qty) => handleAddToCart(p, qty)}
          onBuyNow={(p, qty) => handleBuyNowDirect(p, qty)}
          onSelectOtherProduct={(p) => setActiveProductDetail(p)}
          cartCount={totalCartCount}
          onGoToCart={() => setActiveSubScreen('cart')}
          allProducts={products}
        />
      );
    }

    // 2. Primary 5 Bottom Navigation Tabs
    switch (selectedTab) {
      case 'home':
        return (
          <MobileHomeScreen
            onNavigateToScreen={(screen) => setActiveSubScreen(screen)}
            onSelectProduct={(p) => {
              setActiveProductDetail(p);
              setActiveSubScreen('product_detail');
            }}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            searchFilter={searchQuery}
            products={products}
            onOpenSearchListing={() => setActiveSubScreen('search_listing')}
          />
        );
      case 'peluang':
        return <MobilePeluangEksporScreen />;
      case 'live':
        return <MobileLiveScreen onBuyProduct={handleBuyFromVideo} />;
      case 'notif':
        return (
          <MobileNotificationScreen
            onNavigateToPantauPanen={() => setActiveSubScreen('pantau_panen')}
            onNavigateToKonsultasi={() => setActiveSubScreen('konsultasi')}
            onNavigateToOrders={() => setActiveSubScreen('none')}
          />
        );
      case 'akun':
        return (
          <MobileAccountScreen
            onNavigateToOrders={() => {
              // Open cart/orders view
              setActiveSubScreen('none');
            }}
            onLogout={onLogout}
            onOpenSellerCenter={() => setActiveSubScreen('seller_center')}
            sellerProductsCount={products.length}
          />
        );
    }
  };


  const getSubscreenTitle = () => {
    switch (activeSubScreen) {
      case 'seller_center':
        return 'Pusat Penjual (Toko Saya)';
      case 'search_listing':
        return 'Pencarian & Katalog Komoditas';
      case 'pantau_panen':
        return 'Pantau Panen & Titip Tani (IoT & CCTV)';
      case 'mitra':
        return 'Kemitraan Petani & Peternak';
      case 'ekspor':
        return 'Peluang Pasar (Pasar Lokal & Ekspor Global)';
      case 'konsultasi':
        return 'Konsultasi Dokter Hewan & Tanaman';
      case 'cart':
        return 'Keranjang Belanja Pasokan';
      case 'checkout':
        return 'Pembayaran & Logistik Cold Chain';
      case 'order_success':
        return 'Pesanan Berhasil';
      case 'product_detail':
        return activeProductDetail ? activeProductDetail.name : 'Detail Produk';
      default:
        return '';
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSubScreen('search_listing');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 select-none">
      {/* 1. TOP UTILITY STRIP (Desktop & Responsive) */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden text-[11px]">
            <div className="flex items-center gap-1 shrink-0 text-emerald-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>Wilayah Kirim: Seluruh Indonesia (Rantai Dingin Cold-Chain)</span>
            </div>
            <span className="hidden lg:inline text-emerald-700">|</span>
            <div className="hidden lg:flex items-center gap-1.5 text-emerald-200">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-emerald-300">Live IoT Agro-Pulse:</span>
              <span>14.820 Ton Terdistribusi · Suhu Kandang 24.8°C</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <button
              onClick={() => setActiveDoctorChat(DOCTORS_DATA[0])}
              className="text-emerald-200 hover:text-white transition-colors cursor-pointer hidden sm:flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Pusat Bantuan & Live Chat</span>
            </button>
            <span className="hidden sm:inline text-emerald-800">|</span>
            <div className="flex items-center gap-1 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SKKH & Halal ID3211</span>
            </div>
            {onReplaySplash && (
              <button
                onClick={onReplaySplash}
                title="Putar ulang Intro Splash"
                className="text-amber-300 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 bg-emerald-900/60 border border-emerald-800"
              >
                Intro
              </button>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar / Ganti Akun"
                className="text-rose-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN DESKTOP HEADER (Brand + Prominent Search + Actions) */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8">
          {/* Brand Logo (Disembunyikan saat mode mobile, tampil pada desktop) */}
          <div
            onClick={() => {
              setActiveSubScreen('none');
              setSelectedTab('home');
            }}
            className="hidden md:flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 bg-emerald-800 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-emerald-900 transition-colors">
              <Leaf className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors font-mono">
                  TERNIVA
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 tracking-wider">
                  AGROMARITIM
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium hidden sm:block">
                Ekosistem Agroteknologi, Pasar & Monitoring IoT
              </p>
            </div>
          </div>

          {/* Prominent Search Bar (Desktop center) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative flex items-center"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari komoditas sapi limousin, kopi gayo, pakan konsentrat, pupuk hayati..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => {
                  if (activeSubScreen !== 'search_listing') {
                    setActiveSubScreen('search_listing');
                  }
                }}
                className="w-full bg-stone-50 border border-stone-300 focus:border-emerald-700 pl-9 pr-20 py-2 text-xs text-stone-900 focus:outline-none focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-emerald-800 hover:bg-emerald-900 text-white px-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Cari</span>
              </button>
            </div>
          </form>

          {/* Quick Header Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Toko Saya / Pusat Penjual Button */}
            <button
              onClick={() => setActiveSubScreen('seller_center')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border transition-all cursor-pointer ${
                activeSubScreen === 'seller_center'
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-stone-50 hover:bg-emerald-50 text-stone-800 border-stone-300 hover:border-emerald-700'
              }`}
              title="Buka Pusat Penjual (Toko Saya)"
            >
              <Store className="w-4 h-4 text-emerald-700" />
              <span className="hidden md:inline">Toko Saya</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-700 text-white rounded-full">
                {products.length}
              </span>
            </button>

            {/* Notifikasi Panen Button */}
            <button
              onClick={() => {
                setActiveSubScreen('none');
                setSelectedTab('notif');
              }}
              className={`relative p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer ${
                selectedTab === 'notif' && activeSubScreen === 'none' ? 'bg-stone-100 text-emerald-800' : ''
              }`}
              title="Notifikasi & Peringatan Panen"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full" />
            </button>

            {/* Keranjang Belanja Button */}
            <button
              onClick={() => setActiveSubScreen('cart')}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-bold border transition-all cursor-pointer ${
                activeSubScreen === 'cart'
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
              }`}
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-800" />
              <span className="hidden sm:inline">Keranjang</span>
              {totalCartCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.2">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Akun / Profile Button */}
            <button
              onClick={() => {
                setActiveSubScreen('none');
                setSelectedTab('akun');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                selectedTab === 'akun' && activeSubScreen === 'none'
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
              }`}
              title="Akun & Profil"
            >
              <User className="w-4 h-4 text-stone-600" />
              <span className="hidden lg:inline">{user?.name ? user.name.split(' ')[0] : 'Akun Saya'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. DESKTOP SECONDARY NAVBAR (Tabs & Quick Subsystem Links) */}
      <nav className="bg-emerald-900 text-white shadow-xs border-t border-emerald-800/80 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center">
            {/* Beranda */}
            <button
              onClick={() => {
                setActiveSubScreen('none');
                setSelectedTab('home');
              }}
              className={`px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                selectedTab === 'home' && activeSubScreen === 'none'
                  ? 'border-amber-400 text-amber-300 bg-emerald-950/60'
                  : 'border-transparent text-emerald-100 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <span>Beranda</span>
            </button>

            {/* Peluang Pasar (Lokal & Ekspor) */}
            <button
              onClick={() => {
                setActiveSubScreen('none');
                setSelectedTab('peluang');
              }}
              className={`px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                selectedTab === 'peluang' && activeSubScreen === 'none'
                  ? 'border-amber-400 text-amber-300 bg-emerald-950/60'
                  : 'border-transparent text-emerald-100 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Peluang Pasar (Lokal & Ekspor)</span>
            </button>

            {/* Pantau Panen & Titip Tani IoT */}
            <button
              onClick={() => setActiveSubScreen('pantau_panen')}
              className={`px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeSubScreen === 'pantau_panen'
                  ? 'border-amber-400 text-amber-300 bg-emerald-950/60'
                  : 'border-transparent text-emerald-100 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Pantau Panen & CCTV Kandang</span>
            </button>

            {/* Live Panen & Lelang */}
            <button
              onClick={() => {
                setActiveSubScreen('none');
                setSelectedTab('live');
              }}
              className={`px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                selectedTab === 'live' && activeSubScreen === 'none'
                  ? 'border-amber-400 text-amber-300 bg-emerald-950/60'
                  : 'border-transparent text-emerald-100 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Play className="w-3 h-3 text-emerald-300" />
              <span>Live Panen & Video Lelang</span>
            </button>

            {/* Notifikasi & Peringatan Panen */}
            <button
              onClick={() => {
                setActiveSubScreen('none');
                setSelectedTab('notif');
              }}
              className={`px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                selectedTab === 'notif' && activeSubScreen === 'none'
                  ? 'border-amber-400 text-amber-300 bg-emerald-950/60'
                  : 'border-transparent text-emerald-100 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Peringatan Panen</span>
              <span className="w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {/* Konsultasi Dokter Hewan & Tanaman */}
            <button
              onClick={() => setActiveSubScreen('konsultasi')}
              className={`px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeSubScreen === 'konsultasi'
                  ? 'border-amber-400 text-amber-300 bg-emerald-950/60'
                  : 'border-transparent text-emerald-100 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-sky-300" />
              <span>Konsultasi Dokter</span>
            </button>

            {/* Mitra & Investor */}
            <button
              onClick={() => setActiveSubScreen('mitra')}
              className={`px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                activeSubScreen === 'mitra'
                  ? 'border-amber-400 text-amber-300 bg-emerald-950/60'
                  : 'border-transparent text-emerald-100 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Handshake className="w-3.5 h-3.5 text-amber-300" />
              <span>Kemitraan Petani/Ternak</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-200 py-1.5 shrink-0">
            <span className="bg-emerald-800 px-2 py-0.5 border border-emerald-700 font-mono text-[10px]">
              🔒 Rekening Bersama Escrow Aktif
            </span>
          </div>
        </div>
      </nav>

      {/* 4. SUBSCREEN BREADCRUMBS & RETURN STRIP */}
      {activeSubScreen !== 'none' && (
        <div className="bg-white border-b border-stone-200 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <button
                onClick={() => {
                  setActiveSubScreen('none');
                  setSelectedTab('home');
                }}
                className="hover:text-emerald-800 font-semibold cursor-pointer flex items-center gap-1"
              >
                <span>Beranda</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-900 font-bold">{getSubscreenTitle()}</span>
            </div>

            <button
              onClick={() => setActiveSubScreen('none')}
              className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. MAIN RESPONSIVE CONTENT VIEWPORT */}
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6 flex-1 flex flex-col">
        {renderActiveScreen()}
      </main>

      {/* 6. MOBILE BOTTOM NAVIGATION (Only visible on small mobile screens < 768px) */}
      {activeSubScreen === 'none' && (
        <div className="md:hidden sticky bottom-0 z-30 bg-white border-t border-stone-200 shadow-lg">
          <MobileBottomNav
            selectedTab={selectedTab}
            onTabSelect={(tab) => {
              setSelectedTab(tab);
              setActiveSubScreen('none');
            }}
            unreadCount={2}
          />
        </div>
      )}

      {/* 7. FULL DESKTOP FOOTER */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 mt-12 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800">
            {/* Col 1: Brand & Overview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <Leaf className="w-4 h-4 text-emerald-200" />
                </div>
                <span className="text-lg font-black tracking-tight text-white font-mono">
                  TERNIVA INDONESIA
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Platform ekosistem agromaritim dan peternakan digital terpadu. Menghubungkan
                petani, peternak, eksportir, jaringan hotel dan pasar induk dengan monitoring sensor
                IoT dan transaksi escrow aman.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Terdaftar & Diawasi Kementan RI</span>
              </div>
            </div>

            {/* Col 2: Layanan & Solusi */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Layanan Utama
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => {
                      setActiveSubScreen('none');
                      setSelectedTab('peluang');
                    }}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Peluang Pasar Domestik (Hotel & Resto)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveSubScreen('ekspor');
                    }}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Tender Ekspor Internasional (FOB / CIF)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSubScreen('pantau_panen')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Pantau Panen & Titip Tani (CCTV Kandang)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSubScreen('konsultasi')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Tele-Konsultasi Dokter Hewan & Tanaman
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSubScreen('seller_center')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Pusat Penjual & Restok Komoditas
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Komoditas Unggulan */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Komoditas Unggulan
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>Sapi Pedaging Limousin & Brahman</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>Kopi Arabika Gayo & Robusta Temanggung</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>Vanili Organik Gourmet Grade A</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>Pakan Konsentrat Nutrisi Penggemukan</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>Pupuk Hayati & Probiotik Tanaman</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Keamanan & Kontak */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Keamanan & Escrow
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Setiap pembayaran ditampung aman di rekening bersama (escrow) hingga komoditas
                diterima sesuai spesifikasi mutu dan sertifikasi SKKH.
              </p>
              <div className="bg-stone-800 p-2.5 border border-stone-700 text-xs space-y-1">
                <div className="text-stone-300 font-bold">Layanan Pelanggan 24/7:</div>
                <div className="text-emerald-400 font-mono">0800-1-TERNIVA (Bebas Pulsa)</div>
                <div className="text-stone-400 text-[11px]">support@terniva.id</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <div>
              © 2025 PT Terniva Agromaritim Nusantara. Seluruh Hak Cipta Dilindungi.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-stone-300 cursor-pointer">Syarat & Ketentuan Escrow</span>
              <span>•</span>
              <span className="hover:text-stone-300 cursor-pointer">Kebijakan Mutu Cold-Chain</span>
              <span>•</span>
              <span className="hover:text-stone-300 cursor-pointer">Standar Sertifikasi Halal</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Live Doctor Chat Modal */}
      {activeDoctorChat && (
        <LiveChatModal
          doctor={activeDoctorChat}
          onClose={() => setActiveDoctorChat(null)}
        />
      )}
    </div>
  );
}

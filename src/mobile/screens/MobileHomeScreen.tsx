import { useState } from 'react';
import {
  Eye,
  Handshake,
  Globe2,
  Stethoscope,
  Star,
  MapPin,
  Plus,
  Flame,
  Clock,
  Radio,
  ArrowUpRight,
  TrendingUp,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Leaf,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { MOBILE_PRODUCTS } from '../mobileData';
import { MobileProduct } from '../types';

interface MobileHomeScreenProps {
  onNavigateToScreen: (
    screen: 'pantau_panen' | 'mitra' | 'ekspor' | 'konsultasi' | 'seller_center' | 'search_listing'
  ) => void;
  onSelectProduct: (product: MobileProduct) => void;
  onAddToCart: (product: MobileProduct) => void;
  searchFilter: string;
  products?: MobileProduct[];
  onOpenSearchListing?: () => void;
}

export default function MobileHomeScreen({
  onNavigateToScreen,
  onSelectProduct,
  onAddToCart,
  searchFilter,
  products,
  onOpenSearchListing,
}: MobileHomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = [
    { id: 'Semua', name: 'Semua Pasokan', icon: Layers, count: 16 },
    { id: 'Pertanian', name: 'Pertanian', icon: Leaf, count: 5 },
    { id: 'Peternakan', name: 'Peternakan', icon: Sparkles, count: 4 },
    { id: 'Pakan', name: 'Pakan Nutrisi', icon: TrendingUp, count: 3 },
    { id: 'Pupuk', name: 'Pupuk Hayati', icon: CheckCircle2, count: 2 },
    { id: 'Bibit', name: 'Bibit Unggul', icon: Star, count: 2 },
  ];

  const allProducts = products && products.length > 0 ? products : MOBILE_PRODUCTS;

  const filteredProducts = allProducts.filter((p) => {
    if (p.isActive === false) return false;
    const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchSearch =
      !searchFilter ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (p.etalase && p.etalase.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Beranda dibatasi tampil hanya 20 data sesuai instruksi
  const displayedProducts = filteredProducts.slice(0, 20);

  const getItemBadge = (index: number) => {
    switch (index % 4) {
      case 0:
        return { text: 'Bebas PMK · SKKH', bg: 'bg-emerald-700 text-white' };
      case 1:
        return { text: 'Spesialti Ekspor', bg: 'bg-amber-700 text-white' };
      case 2:
        return { text: 'Gourmet Grade A', bg: 'bg-purple-700 text-white' };
      default:
        return { text: 'Probiotik Alami', bg: 'bg-blue-700 text-white' };
    }
  };

  return (
    <div className="space-y-3 pb-8 bg-stone-100 min-h-full">
      {/* 1. Clean White Agritech Atmosphere & Live IoT Status Hub */}
      <div className="bg-white text-stone-900 px-3.5 pt-2.5 pb-3.5 border-b border-stone-200 shadow-xs">
        {/* Live Market & Agro-Climate Pulse Strip */}
        <div className="flex items-center justify-between py-1.5 border-b border-stone-200 text-[10px] text-stone-600 bg-stone-50 px-2.5 mb-2.5">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-bold text-emerald-800 uppercase tracking-wider text-[9px]">
              Live Agro-Sensor
            </span>
            <span className="text-stone-300">·</span>
            <span className="truncate text-stone-700">
              Panen Q2: 14.820 Ton Terdistribusi ke 14 Negara
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 font-mono text-[10px] text-emerald-800 ml-2 font-bold">
            <Thermometer className="w-3 h-3 text-emerald-700" />
            <span>24.8°C</span>
          </div>
        </div>

        {/* 2. Responsive Bento Hub: Pantau Panen + Mitra + Ekspor + Konsultasi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main Hero Bento Card: PANTAU PANEN (Preserved & Featured with Live IoT Telemetry) */}
          <div
            onClick={() => onNavigateToScreen('pantau_panen')}
            className="lg:col-span-7 group relative overflow-hidden bg-stone-900 border border-stone-300 shadow-xs cursor-pointer transition-all active:scale-[0.99] hover:border-emerald-700 rounded-none sm:rounded-sm"
          >
            {/* Background Image with Measured Contrast Scrim */}
            <div className="relative aspect-[16/8] sm:aspect-[16/7] lg:aspect-[16/9] w-full overflow-hidden">
              <img
                src="/src/assets/images/banner_pantau_panen_1794441162382.jpg"
                alt="Pantau Panen IoT Terniva"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            </div>

            {/* Live Floating Indicators on Card */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 shadow-xs">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>CCTV LIVE</span>
              </div>
              <div className="bg-stone-950/85 text-emerald-300 text-[9px] font-mono font-medium px-2 py-0.5 border border-emerald-500/30">
                Suhu 24.8°C · ADG +1.38 kg
              </div>
            </div>

            <div className="absolute top-2.5 right-2.5 bg-white/20 text-white p-1.5 group-hover:bg-emerald-600 transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>

            {/* Bottom Content within Pantau Panen Hero */}
            <div className="absolute bottom-0 inset-x-0 p-3.5 flex items-end justify-between">
              <div>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                  Program Unggulan IoT
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                  Pantau Panen: Titip Tani & Ternak
                </h3>
                <p className="text-[10px] sm:text-xs text-stone-300 line-clamp-1 mt-0.5">
                  Monitoring sensor suhu, bobot harian, & CCTV kandang 24/7.
                </p>
              </div>

              <span className="shrink-0 text-[10px] font-bold bg-emerald-600 group-hover:bg-emerald-500 text-white px-2.5 py-1 shadow-sm transition-colors">
                Buka Monitor &gt;
              </span>
            </div>
          </div>

          {/* 3 Companion Cards: Gabung Mitra, Ekspor, Konsultasi */}
          <div className="lg:col-span-5 grid grid-cols-3 lg:grid-cols-1 gap-2.5">
            {/* Card: Gabung Mitra */}
            <div
              onClick={() => onNavigateToScreen('mitra')}
              className="group relative p-3 bg-stone-50 hover:bg-emerald-50/60 border border-stone-200 hover:border-emerald-700 shadow-2xs cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <Handshake className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-800 transition-colors" />
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  Gabung Mitra
                </div>
                <div className="text-[10px] text-emerald-800 font-bold mt-0.5">
                  Bagi Hasil +28%
                </div>
                <div className="text-[9px] text-stone-500 line-clamp-1 mt-0.5">
                  Tani & Ternak Terbina
                </div>
              </div>
            </div>

            {/* Card: Peluang Pasar (Lokal & Ekspor) */}
            <div
              onClick={() => onNavigateToScreen('ekspor')}
              className="group relative p-3 bg-stone-50 hover:bg-teal-50/60 border border-stone-200 hover:border-teal-700 shadow-2xs cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 bg-teal-100 text-teal-800 flex items-center justify-center group-hover:bg-teal-800 group-hover:text-white transition-colors">
                  <Globe2 className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-teal-800 transition-colors" />
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  Peluang Pasar
                </div>
                <div className="text-[10px] text-teal-800 font-bold mt-0.5">
                  Lokal & Ekspor
                </div>
                <div className="text-[9px] text-stone-500 line-clamp-1 mt-0.5">
                  Hotel, Resto & Buyer Global
                </div>
              </div>
            </div>

            {/* Card: Konsultasi (Dok Hewan/Tanaman) */}
            <div
              onClick={() => onNavigateToScreen('konsultasi')}
              className="group relative p-3 bg-stone-50 hover:bg-sky-50/60 border border-stone-200 hover:border-sky-700 shadow-2xs cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 bg-sky-100 text-sky-800 flex items-center justify-center group-hover:bg-sky-800 group-hover:text-white transition-colors">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-sky-800 transition-colors" />
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  Konsultasi Dokter
                </div>
                <div className="text-[10px] text-sky-800 font-bold mt-0.5">
                  Hewan & Tanaman
                </div>
                <div className="text-[9px] text-stone-500 line-clamp-1 mt-0.5">
                  Dokter SIP & AI 24/7
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Clean White Segmented Category Controller */}
      <div className="bg-white py-2.5 px-3 sm:px-4 border-y border-stone-200 sticky top-0 z-10 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-800 text-white font-bold border-emerald-800 shadow-xs'
                    : 'bg-white text-stone-700 hover:text-stone-900 font-medium border-stone-300 hover:border-emerald-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`} />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] font-mono px-1 ${
                    isSelected ? 'bg-emerald-950 text-emerald-200' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Kilas Panen / Fresh Harvest Deal */}
      <div className="mx-2.5 sm:mx-0 bg-white border border-stone-200 p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-rose-100 text-rose-600 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
                <span>KILAS PANEN SEGAR</span>
                <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.2">
                  DISKON MITRA
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-stone-900 text-amber-300 text-[10px] font-mono px-2 py-0.5 border border-stone-800 font-bold">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>04 : 18 : 22</span>
          </div>
        </div>

        {/* Horizontal Deals Carousel on White Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {allProducts.slice(0, 6).map((item) => (
            <div
              key={`flash-${item.id}`}
              onClick={() => onSelectProduct(item)}
              className="bg-stone-50 border border-stone-200 p-2.5 cursor-pointer hover:border-emerald-800 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square bg-stone-200 mb-2 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 shadow-xs">
                    -{item.discountPercent}%
                  </span>
                </div>
                <div className="text-[11px] font-bold text-stone-900 line-clamp-1">
                  {item.name}
                </div>
                <div className="text-xs font-bold text-emerald-800 font-mono mt-0.5">
                  Rp {item.price.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="text-[9px] text-stone-500 mt-2 pt-1 border-t border-stone-200 flex items-center justify-between">
                <span>Tersisa 14 pack</span>
                <span className="text-emerald-700 font-bold font-mono">Cepat Habis</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Rekomendasi Produk & Pasokan (Responsive Multi-Column Grid Feed) */}
      <div className="px-2.5 sm:px-0 pt-2">
        <div className="px-1 py-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wide">
                Rekomendasi Produk & Pasokan
              </h4>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2">
                20 Pilihan Teratas
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-stone-500">
              Katalog kurasi mitra binaan (Menampilkan {displayedProducts.length} dari {filteredProducts.length} komoditas)
            </span>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            {displayedProducts.length} / {filteredProducts.length} Komoditas
          </span>
        </div>

        {/* Responsive Desktop Multi-Column Grid (Dibatasi 20 Data) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mt-2">
          {displayedProducts.map((product, idx) => {
            const badge = getItemBadge(idx);
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-700 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-square bg-stone-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 shadow-xs ${badge.bg}`}>
                        {badge.text}
                      </span>
                      {product.discountPercent && (
                        <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 shadow-xs">
                          -{product.discountPercent}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-3">
                    <div className="flex items-center justify-between text-[9px] text-emerald-800 font-bold uppercase tracking-wider mb-0.5">
                      <span>{product.category}</span>
                      <span className="text-stone-400 font-mono lowercase">min {product.minOrder}</span>
                    </div>

                    <h5 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
                      {product.name}
                    </h5>

                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-tight">
                      {product.description}
                    </p>

                    <div className="mt-2.5 flex items-baseline gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-emerald-800 font-mono">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-stone-400 line-through font-mono">
                          {product.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-stone-500">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{product.location}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-3 pb-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-stone-600 font-mono">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400">({product.soldCount})</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="p-1.5 bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors cursor-pointer"
                    title="Tambah ke Keranjang"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tombol Akses Seluruh Katalog Pasokan */}
        <div className="mt-6 p-4 bg-white border border-stone-200 text-center space-y-2 shadow-2xs">
          <div className="text-xs text-stone-600">
            Beranda menampilkan <strong>{displayedProducts.length}</strong> dari <strong>{filteredProducts.length}</strong> total komoditas panen.
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenSearchListing) {
                onOpenSearchListing();
              } else {
                onNavigateToScreen('search_listing');
              }
            }}
            className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>Buka Seluruh Katalog Pasokan ({filteredProducts.length} Komoditas)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

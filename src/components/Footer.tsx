import React from "react";
import { Leaf, Heart, ShieldAlert, MapPin, Mail, Phone } from "lucide-react";

interface FooterProps {
  onNavigate: (view: string, extra?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0e2c21] text-emerald-100/90 border-t border-emerald-900/60 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Food<span className="text-emerald-400">Rescue</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Platform marketplace makanan surplus yang menghubungkan pelaku
              usaha F&B dengan masyarakat. Bersama mengurangi potensi food
              waste, menghemat pengeluaran, dan menjaga kelestarian bumi.
            </p>
            <div className="text-xs text-emerald-300/80 space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Jakarta Selatan, DKI Jakarta, Indonesia</span>
              </div>
              <a
                href="https://wa.me/6285143214224"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-200 transition text-emerald-300 font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: +62 851-4321-4224</span>
              </a>
              <a
                href="https://www.instagram.com/foodrescue6?exln=c3g1dHh3dzVmZ2p0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-200 transition text-emerald-300 font-semibold"
              >
                <svg
                  className="w-3.5 h-3.5 text-emerald-400 shrink-0 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram: @foodrescue6</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>halo@foodrescue.id</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Jelajahi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate("catalog")}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Katalog Makanan Surplus
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("orders")}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Riwayat Pesanan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("merchant-portal")}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Portal Merchant
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Untuk Merchant F&B */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Mitra F&B
            </h4>
            <p className="text-xs text-emerald-200/80 mb-3 leading-relaxed">
              Punya sisa stok bakery, kafe, atau resto berkualitas yang belum
              terjual? Daftarkan usaha Anda dan ubah surplus menjadi nilai
              tambah.
            </p>
          </div>

          {/* Col 4: Keamanan & Kebijakan */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Keamanan Pangan
            </h4>
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-[11px] leading-relaxed text-emerald-200/80 space-y-2">
              <div className="flex items-start gap-1.5 text-emerald-300 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Pernyataan Keamanan Pangan:</span>
              </div>
              <p>
                Seluruh informasi alergen, batas waktu konsumsi terbaik
                (*best-before*), dan instruksi penyimpanan disediakan langsung
                oleh merchant mitra terverifikasi.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => onNavigate("terms")}
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  Ketentuan Layanan & Kebijakan Privasi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80 gap-3">
          <div>
            &copy; 2026 FoodRescue Indonesia. Hak cipta dilindungi
            undang-undang.
          </div>
          <div className="flex items-center gap-1 text-emerald-300">
            <span>Dibuat dengan kepedulian terhadap lingkungan</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 inline fill-rose-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};

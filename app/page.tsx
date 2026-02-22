"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Store,
  QrCode,
  Zap,
  Shield,
  ArrowRight,
  Coins,
  Smartphone,
  Globe,
  ChevronDown,
} from "lucide-react";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020202]">
      {/* Top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent z-[60] opacity-50" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="text-3xl transition-transform group-hover:rotate-12 duration-300">🥟</div>
            <span className="font-black text-xl text-white tracking-tighter">
              Pasal<span className="text-red-600 transition-colors group-hover:text-red-500">Points</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-[10px] text-zinc-500 font-black tracking-[0.2em] uppercase transition-opacity">
              <span className="hover:text-white cursor-pointer transition-colors">Vision</span>
              <span className="hover:text-white cursor-pointer transition-colors">Architecture</span>
              <span className="hover:text-white cursor-pointer transition-colors">Solana</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
            <WalletMultiButton />
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/[0.05] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center">
          {/* Badge */}
          <div className="reveal-1 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-10 glass-panel shadow-inner group cursor-default">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
              Built on Solana Token-2022
            </span>
          </div>

          {/* Floating Hero Branding */}
          <div className="reveal-1 relative mb-12">
            <div className="absolute -inset-10 bg-red-600/10 blur-[60px] rounded-full animate-pulse pointer-events-none" />
            <div className="text-8xl md:text-9xl mb-4 animate-float select-none drop-shadow-[0_20px_50px_rgba(220,38,38,0.3)]">
              🥟
            </div>
          </div>

          <h1 className="reveal-2 text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] text-center mb-8 drop-shadow-2xl">
            <span className="block mb-2">Rewards for the</span>
            <span className="block bg-gradient-to-r from-red-600 via-amber-400 to-red-600 bg-clip-text text-transparent text-glow-red">
              Streets of Kathmandu
            </span>
          </h1>

          <p className="reveal-3 text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto text-center mb-16 leading-relaxed font-medium">
            Soulbound loyalty points for local Nepalese businesses.
            <span className="text-white block sm:inline"> Instant. Gasless. Immutable.</span>
          </p>

          {/* Dual CTAs with Glass Effect */}
          <div className="reveal-3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mb-24">
            <Link href="/merchant" className="group">
              <div className="relative overflow-hidden rounded-[2rem] glass-card p-10 hover:border-red-500/40 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.3)] hover:-translate-y-1">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors" />
                <div className="relative flex flex-col items-center">
                  <div className="p-4 bg-red-600/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Store className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                    Merchant POS
                  </h2>
                  <p className="text-zinc-500 text-center text-sm mb-8 leading-snug">
                    Issue soulbound MOMO to loyal customers instantly.
                  </p>
                  <div className="flex items-center gap-2 text-red-500 text-[11px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                    Start Issuing <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/customer" className="group">
              <div className="relative overflow-hidden rounded-[2rem] glass-card p-10 hover:border-amber-500/40 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] hover:-translate-y-1">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
                <div className="relative flex flex-col items-center">
                  <div className="p-4 bg-amber-500/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    <QrCode className="w-8 h-8 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                    Customer Card
                  </h2>
                  <p className="text-zinc-500 text-center text-sm mb-8 leading-snug">
                    Track your points and redeem for free plates of momo.
                  </p>
                  <div className="flex items-center gap-2 text-amber-500 text-[11px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                    Open Wallet <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto relative pt-20 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Globe className="w-6 h-6 text-red-500" />,
                title: "No Downloads",
                desc: "100% web-based. Works in any mobile browser with a Solana wallet.",
              },
              {
                icon: <Shield className="w-6 h-6 text-amber-500" />,
                title: "Soulbound Points",
                desc: "Non-transferable tokens mean your loyalty is truly yours.",
              },
              {
                icon: <Zap className="w-6 h-6 text-green-500" />,
                title: "Gasless UX",
                desc: "Merchants sponsor ATA creation. Customers pay zero fees.",
              },
              {
                icon: <Smartphone className="w-6 h-6 text-blue-500" />,
                title: "POS Terminal",
                desc: "Complete merchant CRM designed for fast-paced street food stalls.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl glass-panel border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="p-3 bg-white/5 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform group-hover:bg-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥟</span>
            <span className="font-black text-sm text-white tracking-widest uppercase">
              PasalPoints
            </span>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
              Superteam Nepal 2026
            </span>
          </div>
          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.3em]">
            Built with ❤️ for the Nepal Hacker House
          </p>
        </div>
      </footer>
    </main>
  );
}

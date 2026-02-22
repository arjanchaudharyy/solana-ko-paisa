"use client";

import { useState, useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createBurnInstruction,
} from "@solana/spl-token";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MINT_ADDRESS, TOKEN_PROGRAM, REDEEM_THRESHOLD } from "@/lib/constants";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import {
  Copy,
  CheckCircle2,
  ExternalLink,
  Loader2,
  History,
  QrCode,
  ArrowLeft,
  Flame
} from "lucide-react";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

type RedeemStatus = "idle" | "signing" | "confirming" | "success" | "error";

export default function CustomerDashboard() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState<RedeemStatus>("idle");
  const [lastSignature, setLastSignature] = useState("");
  const [isCopying, setIsCopying] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(0);
      return;
    }

    setBalanceLoading(true);
    try {
      const userATA = getAssociatedTokenAddressSync(
        MINT_ADDRESS,
        publicKey,
        false,
        TOKEN_PROGRAM
      );
      const info = await connection.getTokenAccountBalance(userATA);
      setBalance(Number(info.value.amount));
    } catch {
      setBalance(0); // ATA doesn't exist yet
    } finally {
      setBalanceLoading(false);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    fetchBalance();

    // Poll every 15s for new points
    const interval = setInterval(fetchBalance, 15_000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  const copyToClipboard = async () => {
    if (!publicKey) return;
    try {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setIsCopying(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setIsCopying(false), 2000);
    } catch {
      toast.error("Failed to copy address");
    }
  };

  const progressPercent = Math.min((balance / REDEEM_THRESHOLD) * 100, 100);
  const canRedeem = balance >= REDEEM_THRESHOLD;

  const redeemMomo = async () => {
    if (!publicKey || !canRedeem) return;

    setRedeemStatus("signing");
    const toastId = toast.loading("Connecting to wallet...", {
      description: "Please sign the transaction to redeem your MOMO",
    });

    try {
      const userATA = getAssociatedTokenAddressSync(
        MINT_ADDRESS,
        publicKey,
        false,
        TOKEN_PROGRAM
      );

      const tx = new Transaction().add(
        createBurnInstruction(
          userATA,
          MINT_ADDRESS,
          publicKey,
          REDEEM_THRESHOLD,
          [],
          TOKEN_PROGRAM
        )
      );

      setRedeemStatus("confirming");
      toast.loading("Broadcasting transaction...", {
        id: toastId,
        description: "Burning tokens on-chain to claim your plate",
      });

      const signature = await sendTransaction(tx, connection);
      setLastSignature(signature);

      await connection.confirmTransaction(signature, "confirmed");

      setBalance((prev) => prev - REDEEM_THRESHOLD);
      setRedeemStatus("success");

      toast.success("MOMO Redeemed!", {
        id: toastId,
        description: "Your free plate of momo is waiting for you!",
        action: {
          label: "View on Solscan",
          onClick: () => window.open(`https://solscan.io/tx/${signature}?cluster=devnet`, "_blank")
        },
      });
    } catch (err) {
      setRedeemStatus("error");
      const message = err instanceof Error ? err.message : "Redemption failed";

      if (message.includes("User rejected")) {
        toast.error("Transaction Rejected", {
          id: toastId,
          description: "You cancelled the request in your wallet.",
        });
      } else {
        toast.error("Error", {
          id: toastId,
          description: message,
        });
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-20 px-4">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700 z-[60]" />

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 flex justify-between items-center z-50">
        <Link
          href="/"
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>
        <WalletMultiButton />
      </nav>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 drop-shadow-xl animate-bounce">🥟</div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Pasal<span className="text-red-500">Points</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-semibold">
            The Digital Loyalty Card
          </p>
        </div>

        {!publicKey ? (
          <div className="p-8 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl text-center shadow-2xl">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <QrCode className="text-zinc-500 w-8 h-8" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Connect Wallet</h2>
            <p className="text-zinc-500 mb-8 max-w-[200px] mx-auto text-sm">
              Flash your QR code to collect MOMO points at local shops
            </p>
            <WalletMultiButton />
          </div>
        ) : (
          <div className="space-y-6">
            {/* QR Section */}
            <div className="p-8 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                <QRCodeSVG
                  value={publicKey.toBase58()}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition-all border border-zinc-700/50 group"
                >
                  {isCopying ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                  )}
                  <span className="text-xs font-mono font-medium truncate max-w-[240px]">
                    {publicKey.toBase58()}
                  </span>
                </button>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  Scan this at the shop to earn points
                </p>
              </div>
            </div>

            {/* Balance Card */}
            <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black mb-1">
                      Available Balance
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-white tabular-nums drop-shadow-lg">
                        {balanceLoading ? (
                          <Loader2 className="w-10 h-10 text-zinc-700 animate-spin inline" />
                        ) : (
                          balance
                        )}
                      </span>
                      <span className="text-xl text-red-500 font-bold">MOMO</span>
                    </div>
                  </div>
                  <div className="bg-red-500/10 p-2 rounded-lg">
                    <Flame className="w-5 h-5 text-red-500" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-zinc-500">Milestone Progress</span>
                    <span className="text-zinc-300">
                      {balance}/{REDEEM_THRESHOLD}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-zinc-800/80 rounded-full border border-zinc-700/30 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out relative ${canRedeem
                        ? "bg-gradient-to-r from-green-600 to-green-400"
                        : "bg-gradient-to-r from-red-700 to-red-500"
                        }`}
                      style={{ width: `${progressPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>

                  {canRedeem ? (
                    <button
                      onClick={redeemMomo}
                      disabled={redeemStatus === "signing" || redeemStatus === "confirming"}
                      className="w-full mt-4 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 font-black py-4 rounded-xl transition-all shadow-xl text-lg flex items-center justify-center gap-2"
                    >
                      {redeemStatus === "signing" || redeemStatus === "confirming" ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        "REDEEM FREE PLATE"
                      )}
                    </button>
                  ) : (
                    <p className="text-zinc-600 text-[11px] text-center font-medium mt-4">
                      Collect <span className="text-red-500/80">{REDEEM_THRESHOLD - balance} More</span> points for your next reward
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity (Future Vision) */}
            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4 text-zinc-500" />
                  Recent Activity
                </h2>
                <span className="text-[10px] bg-red-500/10 text-red-500 font-black px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-tighter">
                  Vision
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { shop: "Momo Magic Thamel", points: "+10", date: "Today, 2:14 PM", icon: "🥟" },
                  { shop: "Boudha Bites", points: "+10", date: "Yesterday", icon: "🥟" },
                  { shop: "Everest Espresso", points: "+10", date: "2 days ago", icon: "🥟" },
                ].map((item, i) => (
                  <div key={i} className="glass-panel p-4 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white tracking-tight">{item.shop}</p>
                        <p className="text-[10px] text-zinc-500">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-green-500 font-black text-sm tracking-tighter">
                      {item.points} MOMO
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Soulbound Badges Vision */}
            <section className="mt-12 pb-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Soulbound Achievements
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Momo Starter", active: true, icon: "🥟" },
                  { label: "Regular", active: true, icon: "🏪" },
                  { label: "King", active: false, icon: "👑" },
                  { label: "Scout", active: false, icon: "🧭" },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-14 h-14 rounded-full glass-panel flex items-center justify-center text-2xl ${badge.active ? "opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.1)] border-white/20" : "opacity-20 grayscale"}`}>
                      {badge.icon}
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-tighter text-center ${badge.active ? "text-zinc-400" : "text-zinc-700"}`}>
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

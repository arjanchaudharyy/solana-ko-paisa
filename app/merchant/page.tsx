"use client";

import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MINT_ADDRESS, TOKEN_PROGRAM, POINTS_PER_ISSUE } from "@/lib/constants";
import { toast } from "sonner";
import {
  Store,
  ArrowLeft,
  UserPlus,
  Scan,
  Send,
  History,
  ShieldCheck,
  Loader2,
  Trophy
} from "lucide-react";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

type TxStatus = "idle" | "signing" | "confirming" | "success" | "error";

export default function MerchantDashboard() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [customerAddress, setCustomerAddress] = useState("");
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [issueCount, setIssueCount] = useState(0);

  const isValidAddress = useCallback((addr: string): boolean => {
    try {
      new PublicKey(addr);
      return addr.length >= 32;
    } catch {
      return false;
    }
  }, []);

  const issuePoints = async () => {
    if (!publicKey) return;
    if (!isValidAddress(customerAddress)) {
      toast.error("Invalid Address", {
        description: "Please enter a valid Solana wallet address.",
      });
      return;
    }

    setTxStatus("signing");
    const toastId = toast.loading("Preparing transaction...", {
      description: `Issuing ${POINTS_PER_ISSUE} MOMO to ${customerAddress.slice(0, 4)}...${customerAddress.slice(-4)}`,
    });

    try {
      const customerPubkey = new PublicKey(customerAddress);

      const customerATA = getAssociatedTokenAddressSync(
        MINT_ADDRESS,
        customerPubkey,
        false,
        TOKEN_PROGRAM
      );

      const tx = new Transaction().add(
        createAssociatedTokenAccountIdempotentInstruction(
          publicKey,
          customerATA,
          customerPubkey,
          MINT_ADDRESS,
          TOKEN_PROGRAM
        ),
        createMintToInstruction(
          MINT_ADDRESS,
          customerATA,
          publicKey,
          POINTS_PER_ISSUE,
          [],
          TOKEN_PROGRAM
        )
      );

      setTxStatus("confirming");
      toast.loading("Confirming on-chain...", {
        id: toastId,
        description: "Writing the loyalty points to the Solana ledger.",
      });

      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setIssueCount((c) => c + 1);
      setTxStatus("success");
      setCustomerAddress("");

      toast.success("Points Issued!", {
        id: toastId,
        description: `Successfully sent ${POINTS_PER_ISSUE} MOMO points.`,
        action: {
          label: "View Transaction",
          onClick: () => window.open(`https://solscan.io/tx/${signature}?cluster=devnet`, "_blank")
        },
      });
    } catch (err) {
      setTxStatus("error");
      const message = err instanceof Error ? err.message : "Transaction failed";

      if (message.includes("User rejected")) {
        toast.error("Process Cancelled", {
          id: toastId,
          description: "Transaction was rejected in your wallet.",
        });
      } else {
        toast.error("Issuance Failed", {
          id: toastId,
          description: message,
        });
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-20 px-4">
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

      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
              <Store className="text-red-500 w-10 h-10" />
              Merchant Portal
            </h1>
            <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-semibold">
              POS Terminal v2.0
            </p>
          </div>
          {issueCount > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-3">
              <Trophy className="text-yellow-500 w-5 h-5" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Issued Today</p>
                <p className="text-lg font-black leading-none">{issueCount * POINTS_PER_ISSUE}</p>
              </div>
            </div>
          )}
        </div>

        {!publicKey ? (
          <div className="p-12 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldCheck className="text-red-500 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Merchant Login Required</h2>
            <p className="text-zinc-500 mb-10 max-w-sm mx-auto">
              Please connect your authorized merchant wallet to start issuing soulbound MOMO points.
            </p>
            <WalletMultiButton />
          </div>
        ) : (
          <div className="space-y-6">
            {/* POS Input Section */}
            <div className="p-8 bg-zinc-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl">
              <div className="mb-10">
                <label className="block text-zinc-400 text-xs font-black uppercase tracking-[0.2em] mb-4 px-1">
                  Customer Wallet Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <UserPlus className="h-6 w-6 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter or paste address..."
                    value={customerAddress}
                    onChange={(e) => {
                      setCustomerAddress(e.target.value);
                      if (txStatus === "error") setTxStatus("idle");
                    }}
                    className="w-full pl-14 pr-6 py-6 bg-black/50 text-white rounded-3xl border border-zinc-800 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 font-mono text-xl placeholder:text-zinc-800 transition-all"
                    disabled={txStatus === "signing" || txStatus === "confirming"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => toast.info("Scanner vision", { description: "Coming soon to mobile app!" })}
                  className="flex items-center justify-center gap-3 py-5 px-6 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 font-bold rounded-2xl transition-all border border-zinc-700/30"
                >
                  <Scan className="w-5 h-5" />
                  Scan QR
                </button>
                <button
                  onClick={issuePoints}
                  disabled={txStatus === "signing" || txStatus === "confirming" || !customerAddress.trim()}
                  className="flex items-center justify-center gap-3 py-5 px-6 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-900/20"
                >
                  {txStatus === "signing" || txStatus === "confirming" ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Issue Points
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stats & Logs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Authority</h3>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 truncate">{publicKey.toBase58()}</p>
              </div>

              <div className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-4 h-4 text-blue-500" />
                  <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">System Status</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-xs font-bold text-zinc-400">Mainnet Proxy Active</p>
                </div>
              </div>
            </div>

            {/* Hint */}
            <div className="mt-8 text-center">
              <p className="text-zinc-600 text-xs font-medium bg-zinc-900/20 inline-block px-4 py-2 rounded-full border border-zinc-800/30">
                Tip: Each issuance burns a small amount of merchant SOL for ATA rent.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

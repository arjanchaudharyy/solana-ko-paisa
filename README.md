# 🥟 PasalPoints — Web3 Loyalty for Every Nepali Pasal

**PasalPoints** turns every momo plate sold on the streets of Kathmandu into soulbound loyalty points on Solana. No plastic cards, no app downloads, no middlemen — just crypto-native loyalty that actually works for neighborhood businesses. Built for the **Superteam Nepal 2026** bounty, PasalPoints proves that Web3 can serve the corner shop, not just the trading desk.

---

## 🏗️ Technical Architecture & Extension Deep-Dive

PasalPoints is a flagship implementation of **Solana Program Library (SPL) Token-2022**, specifically engineered to solve the "Web3 Onboarding Problem" for non-technical users.

### The Extension Stack

1.  **Non-Transferable (Soulbound)**:
    *   **The Logic**: Loyalty is a relationship, not a commodity. By using the `NonTransferable` extension, we ensure that MOMO points cannot be sold on secondary markets like Tensor or Magic Eden. This protects the merchant's unit economics and prevents "loyalty farming."
2.  **Idempotent ATA Creation**:
    *   **The Problem**: Native Solana UX requires a user to pay "Rent" (~0.002 SOL) for every new token account. In a local pasal, a customer won't spend $0.50 to earn 10 points.
    *   **The Solution**: We use `createAssociatedTokenAccountIdempotent`. If the account is missing, the **Merchant's transaction pays the rent**. The customer experiences 100% free onboarding.
3.  **On-Chain Metadata**:
    *   **The Result**: All token branding (Symbol, Logo, Description) is stored directly within the Mint account using the `Metadata` extension. This makes PasalPoints ultra-lightweight and independent of external metadata providers.

---

## 🇳🇵 The Vision: Digitizing the Streets of Nepal

Kathmandu is an economy built on "Pasals" (small corner shops). From the momo stalls of Thamel to the tea houses of Pokhara, the relationship between the *Dai* (shopkeeper) and the *Bhai/Bahini* (customer) is based on trust.

**PasalPoints digitizes that trust.** 

By replacing physical cardboard stamps with Soulbound tokens, we provide:
- **For Merchants**: Data-driven insights into customer frequency and retention for the first time.
- **For Customers**: A verifiable digital identity that proves their status in the community.

### 🛣️ Roadmap: Beyond the Hackathon
- **Localized NFT Artifacts**: Earn a "Thamel Legend" NFT after 500 MOMO points.
- **Merchant Liquidity**: Merchants can stake SOL to create temporary "Bonus Multipliers" during festivals like Dashain.
- **Mobile Vision Scanning**: Integrating native camera scanning for truly friction-less "Point of Sale" interactions.

---

## 🔥 Features

- **🛡️ Soulbound Loyalty** — Secured by Token-2022 `NonTransferable` extension.
- **🧧 Merchant-Funded Onboarding** — Zero gas fees for the Nepali customer.
- **🥟 'Local Pasal' UX** — High-contrast QR codes and clipboard-ready addresses.
- **📈 Real-Time Dashboards** — 15s polling for points, including automated polling status.
- **💅 Kathmandu Aesthetic** — A "Himalayan Dark" theme with Crimson and Gold accents.
- **🔔 Consumer-Grade Toasts** — Transaction feedback via Sonner with direct Solscan integration.
- **📜 Transaction Integrity** — Full handling for wallet rejections and on-chain errors.

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Solana CLI](https://docs.solana.com/cli/install) (for creating the mint keypair)
- A Solana wallet with Devnet SOL (use `solana airdrop 2`)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/pasalpoints.git
cd pasalpoints
npm install
```

### 2. Create the MOMO Mint

Generate a fresh Token-2022 mint with NonTransferable and Metadata extensions:

```bash
npm run create-mint
```

This will output a mint address. Copy it and paste into `lib/constants.ts`:

```ts
export const MINT_ADDRESS = new PublicKey("YOUR_MINT_ADDRESS_HERE");
```

### 3. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're live.

---

## 🎥 Demo

| Resource | Link |
|---|---|
| 🌐 **Live App** | [pasalpoints.vercel.app](https://pasalpoints.vercel.app) |
| 🎬 **Video Demo** | [Loom Walkthrough](https://loom.com/share/YOUR_LOOM_ID) |
| 🔍 **Solscan (Mint)** | [View Token on Devnet](https://solscan.io/token/YOUR_MINT_ADDRESS?cluster=devnet) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, Lucide Icons |
| **Blockchain** | Solana Devnet, Token-2022 Program |
| **Wallet** | Phantom (via `@solana/wallet-adapter`) |
| **Notifications** | Sonner (dark-themed toasts) |
| **QR Codes** | qrcode.react |

---

## 📁 Project Structure

```
pasalpoints/
├── app/
│   ├── page.tsx              # Landing page (Kathmandu theme)
│   ├── layout.tsx            # Root layout + Toaster
│   ├── providers.tsx         # Solana wallet providers
│   ├── globals.css           # Global styles + wallet overrides
│   ├── merchant/page.tsx     # Merchant POS dashboard
│   └── customer/page.tsx     # Customer loyalty dashboard
├── lib/
│   └── constants.ts          # Mint address, RPC, thresholds
├── scripts/
│   └── create-mint.ts        # Token-2022 mint creation script
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 📄 License

MIT — Build freely, earn momos.

---

<p align="center">
  <strong>🥟 PasalPoints — Built with ❤️ for Superteam Nepal 2026</strong>
</p>

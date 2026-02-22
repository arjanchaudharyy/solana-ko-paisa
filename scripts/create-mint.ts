import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  ExtensionType,
  createInitializeNonTransferableMintInstruction,
  createInitializeMetadataPointerInstruction,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

// Load the local Solana keypair (merchant authority)
const keypairPath = path.join(os.homedir(), ".config", "solana", "id.json");
const secret = JSON.parse(fs.readFileSync(keypairPath, "utf-8")) as number[];
const payer = Keypair.fromSecretKey(new Uint8Array(secret));
const mintKeypair = Keypair.generate();

const decimals = 0; // Loyalty points are whole numbers

async function main(): Promise<void> {
  console.log("Initializing PasalPoints (MOMO) Mint...");
  console.log(`Payer: ${payer.publicKey.toBase58()}`);
  console.log(`Mint:  ${mintKeypair.publicKey.toBase58()}`);

  // Token metadata stored directly on the mint account via Token-2022
  const metaData = {
    updateAuthority: payer.publicKey,
    mint: mintKeypair.publicKey,
    name: "Pasal Point",
    symbol: "MOMO",
    uri: "",
    additionalMetadata: [["Hackathon", "Superteam Nepal 2026"]] as [string, string][],
  };

  // --- Step 1: Calculate space ---
  // Mint space includes NonTransferable + MetadataPointer extension headers
  const mintLen = getMintLen([
    ExtensionType.NonTransferable,
    ExtensionType.MetadataPointer,
  ]);

  // Metadata is stored in the same account, after the mint data
  const metadataExtension = pack(metaData);
  const totalLen = mintLen + metadataExtension.length;
  const mintLamports = await connection.getMinimumBalanceForRentExemption(totalLen);

  console.log(`Space: ${totalLen} bytes | Rent: ${mintLamports / 1e9} SOL`);

  // --- Steps 2-5: Strict instruction ordering ---
  const transaction = new Transaction().add(
    // Step 2: Allocate account with rent
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLen,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),

    // Step 3a: Initialize NonTransferable extension (BEFORE mint init)
    createInitializeNonTransferableMintInstruction(
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),

    // Step 3b: Initialize MetadataPointer extension (BEFORE mint init)
    // Points to the mint itself as the metadata account
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey, // metadata lives on the mint account
      TOKEN_2022_PROGRAM_ID
    ),

    // Step 4: Initialize the Mint (AFTER all extensions, no freeze authority)
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      payer.publicKey, // mint authority
      null, // no freeze authority
      TOKEN_2022_PROGRAM_ID
    ),

    // Step 5: Initialize on-chain metadata (AFTER mint init)
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mintKeypair.publicKey,
      updateAuthority: payer.publicKey,
      mint: mintKeypair.publicKey,
      mintAuthority: payer.publicKey,
      name: metaData.name,
      symbol: metaData.symbol,
      uri: metaData.uri,
    })
  );

  const sig = await sendAndConfirmTransaction(connection, transaction, [
    payer,
    mintKeypair,
  ]);

  console.log("\n========================================");
  console.log("  PASALPOINTS MINT CREATED SUCCESSFULLY");
  console.log("========================================");
  console.log(`Mint Address: ${mintKeypair.publicKey.toBase58()}`);
  console.log(`Signature:    ${sig}`);
  console.log(`Explorer:     https://solscan.io/tx/${sig}?cluster=devnet`);
  console.log(`\nCopy the Mint Address above and paste it into lib/constants.ts`);
}

main().catch((err) => {
  console.error("Failed to create mint:", err);
  process.exit(1);
});

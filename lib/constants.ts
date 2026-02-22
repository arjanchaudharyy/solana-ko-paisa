import { PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

/**
 * After running `npm run create-mint`, paste the output mint address here.
 * This is the PasalPoints (MOMO) Token-2022 mint with NonTransferable + Metadata extensions.
 */
export const MINT_ADDRESS = new PublicKey(
  "11111111111111111111111111111111" // <-- REPLACE with your mint address after running create-mint
);

export const TOKEN_PROGRAM = TOKEN_2022_PROGRAM_ID;

export const POINTS_PER_ISSUE = 10;
export const REDEEM_THRESHOLD = 50;

export const DEVNET_RPC = "https://api.devnet.solana.com";

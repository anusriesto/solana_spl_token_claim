import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

//const network = clusterApiUrl('devnet'); // Change to 'mainnet-beta' for mainnet
export const connection = new Connection(clusterApiUrl('devnet'));
export const programId = new PublicKey('G15pAFExGrHqAeSLRPPrXzCXFqJpajhSaTic7pWzJEU7'); // Replace with your program ID


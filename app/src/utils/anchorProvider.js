import { AnchorProvider, Program } from '@project-serum/anchor';
import { connection, programId } from './connection';
import idl from './merkle_distributor.json';
import { PublicKey } from '@solana/web3.js';
import { useWallet, WalletProvider, ConnectionProvider, useConnection } from '@solana/wallet-adapter-react';

// const getProvider = () => {
//   if ('solana' in window) {
//     const provider = window.solana;
//     if (provider.isPhantom) {
//       return new AnchorProvider(connection, provider, {});
//     }
//   }
//   return null;
// };

const getProvider = () => {
  
const wallet = new useWallet();
const opts = {
  preflightCommitment: "processed"
};
    const provider = new AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
};


export const provider = getProvider();
export const program = new Program(idl, programId, provider);

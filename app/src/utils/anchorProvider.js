import { AnchorProvider, Program } from '@project-serum/anchor';
import { connection, programId } from './connection';
import idl from './merkle_distributor.json';
import { PublicKey } from '@solana/web3.js';

const getProvider = () => {
  if ('solana' in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return new AnchorProvider(connection, provider, {});
    }
  }
  return null;
};

export const provider = getProvider();
export const program = new Program(idl, programId, provider);

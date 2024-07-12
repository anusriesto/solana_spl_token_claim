
import './App.css';
import { useEffect, useState } from "react";
import { clusterApiUrl, PublicKey, Connection, TransactionInstruction, Transaction,SystemProgram } from '@solana/web3.js';
import {
  Program, AnchorProvider, web3,Instruction
} from '@project-serum/anchor';
import {RouterState} from "/home/anusriesto/solana/solana_spl_token_claim/api/src/router"
import idl from './merkle_distributor.json';
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress
} from "@solana/spl-token";
import * as anchor from '@project-serum/anchor';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');
import { sha256 } from 'crypto-hash';
import { invoke } from '@tauri-apps/api'

//**************************************************************** */
const wallets = [
  new PhantomWalletAdapter(),
]

const opts = {
  preflightCommitment: "processed"
}
const network = clusterApiUrl('devnet');
const programID = new PublicKey("G15pAFExGrHqAeSLRPPrXzCXFqJpajhSaTic7pWzJEU7");
// interface RouterState {
//   distributor_pubkey: Pubkey,
//   program_id: Pubkey,
//   rpc_client: RpcClient,
//   tree: HashMap<Pubkey, TreeNode>,
// }
function App() {
  
  const [userAddress, setUserAddress] = useState(null);
  const dist=new PublicKey('CtFnTySC3JaWTiM8EYz8uQAtqbgYWUxy9z96r93Grf3T');
  const { connection } = useConnection();
  const token= new PublicKey('ZdZED9GYzW41wSrydaqZJbsYFhprasmGHVTQF2725Db')
  
  
  const wallet = useWallet();
  async function getProvider() {
    const provider = new AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }
  
  
  async function handleClaim(){
    const [proof, setproof] = useState(null);
    try {
      
       

    }
    catch (err) {
          console.error('Error claiming tokens:', err);
         }


    


  };
  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className="App">
      <div>
        <h2>Claim Tokens</h2>
         
          <div>
            
            <p>Amount to claim: {claimAmount} tokens</p>
            <button onClick={handleClaim}>Claim Tokens</button>
          </div>
      </div>
      </div>
    );}
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint={network}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;
import './App.css';
import { useEffect, useState } from "react";
import { clusterApiUrl, PublicKey, Connection, TransactionInstruction, Transaction, SystemProgram} from '@solana/web3.js';
import {
  Program, AnchorProvider, web3,
} from '@project-serum/anchor';
import idl from './merkle_distributor.json';
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,getAccount
} from "@solana/spl-token";
import { SendSolanaSPLTokens, createSendSolanaSPLTokensInstruction } from './utils/helper.ts';
import { getOrCreateATA, u64 } from "@saberhq/token-utils";

import * as anchor from '@project-serum/anchor';
import {
  SolanaAugmentedProvider,
  SolanaProvider,
} from "@saberhq/solana-contrib";

import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  new PhantomWalletAdapter(),
]

const opts = {
  preflightCommitment: "processed"
}
const network = clusterApiUrl('devnet');
const programID = new PublicKey("G15pAFExGrHqAeSLRPPrXzCXFqJpajhSaTic7pWzJEU7");

function App() {
  const [userAddress, setUserAddress] = useState(null);
  const [claimAmount, setClaimAmount] = useState(null);
  const [proof, setProof] = useState(null); // Declare proof state here
  const dist = new PublicKey('CtFnTySC3JaWTiM8EYz8uQAtqbgYWUxy9z96r93Grf3T');
  const { connection } = useConnection();
  const token = new PublicKey('ZdZED9GYzW41wSrydaqZJbsYFhprasmGHVTQF2725Db');
  const wallet = useWallet();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const from_ata=new PublicKey('CoiC3ov6CN4rXvmhQ2ZEvBFaEWyFdtMcnufaCwFm1Gof')
  
  
  

  async function getProvider() {
    const provider = new AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }
  
  
  
 
  async function fetchClaimAmount() {
    try {
      const provider = await getProvider()
      
      const user=wallet.publicKey.toBase58().toString();
      // console.log(publicKey)
      // console.log(user)
      
      const distributor = await fetch('http://localhost:7001/distributor');
      const claim_status = await fetch('http://localhost:7001/status/'+user);
      const get_proof=await fetch ('http://localhost:7001/proof/'+user);
      const claim_status_data= await claim_status.json();
      const distributor_data=await distributor.json();
      
      const get_proof_data=await get_proof.json();
      console.log(claim_status_data)
      console.log(get_proof_data.amount_unlocked)
      // setClaimAmount(data.total_unlocked_staker);
      
      
    } catch (error) {
      console.error('Error fetching claim amount:', error);
    }
  }

  async function handleClaim() {
    try {
      const provider = await getProvider()
      const program = new Program(idl, programID, provider);
      const wal= provider.wallet.publicKey;
      const user=wallet.publicKey.toBase58().toString();
      const get_proof=await fetch ('http://localhost:7001/proof/'+user);
      const get_proof_data=await get_proof.json();
      const amnt_unlocked=await get_proof_data.amount_unlocked;
      
      const amnt_locked=await get_proof_data.amount_locked;
      const value = new anchor.BN(20000000);
      const proof=await get_proof_data.proof;
      console.log(amnt_unlocked)
      console.log(amnt_locked)
      console.log()



      // claim logic token here
      //distributorpda
      const claim_statusPda = await PublicKey.findProgramAddressSync(
        [
          Buffer.from('ClainStatus'),
          dist.toBuffer(),
          wal.toBuffer() // Replace version with your distributor version
        ],
        program.programId
      );
      const associatedTokenTo = await getAssociatedTokenAddress(
        token,
        wal
      );
      //const tx = new Transaction();
      // const preInstruction=await createSendSolanaSPLTokensInstruction(
      //   connection,
      //   provider.wallet.publicKey,
      //   provider.wallet.publicKey

      // )
        

    // const accounts = {
    //   distributor: dist,
    //   claimStatus:claim_statusPda,
    //   from: from_ata,
    //   to: associatedTokenTo,
    //   claimant:provider.wallet.publicKey,
    //   systemProgram: SystemProgram.programId,
    //   tokenProgram: TOKEN_PROGRAM_ID,
    // };
    // const tx=new Transaction(await program.methods.newClaim(amnt_unlocked,amnt_locked,proof)
    //   .accounts(accounts)
    //   .preInstructions(preInstruction)
    //   .instruction());

    //   //tx.add(tx1).add(tx2);
    // await provider.sendAndConfirm(tx);
    

      

    
    } catch (err) {
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
            <p>Amount to claim: tokens</p>
            <button onClick={handleClaim}>Claim Tokens</button>
          
          </div>
        </div>
      </div>
    );
  }
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
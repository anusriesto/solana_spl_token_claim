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
import{Countdown}from './utils/countdown.js'
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
  const [claimLockAmount, setClaimLockAmount] = useState(null);
  const [claimunLockAmount, setClaimunLockAmount] = useState(null);
  const [claim_status,setclaim_status]=useState(null);
  const [proof, setProof] = useState(null); // Declare proof state here
  //const dist = new PublicKey('2XvQtxhz2RadzfAi9kb4cZNYL2xqCaHCJYknU34ZZTWK');
  const dist_2=new PublicKey('CtFnTySC3JaWTiM8EYz8uQAtqbgYWUxy9z96r93Grf3T')
  const { connection } = useConnection();
  const token = new PublicKey('ZdZED9GYzW41wSrydaqZJbsYFhprasmGHVTQF2725Db');
  const wallet = useWallet();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  
  
  
  useEffect(() =>
     {
      fetchClaimAmount();
    })

  async function getProvider() {
    const provider = new AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }
  
  
  async function time_check(){
    

    try{
      const distributor=await fetch ('http://localhost:7001/distributor');
      const distributor_data=distributor.json();
      console.log(distributor_data)

    }catch (error) {
      console.error('Error getting time:', error);
    }

  };
 
  async function fetchClaimAmount() {
    try {
      const provider = await getProvider();
      const program = new Program(idl, programID, provider);
      const user=wallet.publicKey.toBase58().toString();
      const claim_status = await fetch('http://localhost:7001/status/'+user);
      const get_proof=await fetch ('http://localhost:7001/proof/'+user);
      const get_proof_data=await get_proof.json();
      const amnt_unlocked=await get_proof_data.amount_unlocked;
      const claim_status_data=await claim_status.json();
      const amnt_locked=await get_proof_data.amount_locked;
      const claim_status_data_status=claim_status_data.status
      
      setClaimLockAmount(amnt_locked/1000000000);
      setClaimunLockAmount(amnt_unlocked/1000000000);
      setclaim_status(claim_status_data_status);
      
      
      
    } catch (error) {
      console.error('Error fetching claim amount:', error);
    }
  };

  async function handleClaim() {
    try {
      
      const provider = await getProvider();
      const program = new Program(idl, programID, provider);
      const wal= provider.wallet.publicKey;
      const user=wallet.publicKey.toBase58().toString();
      const get_proof=await fetch ('http://localhost:7001/proof/'+user);
      const get_proof_data=await get_proof.json();
      const amnt_unlocked=await get_proof_data.amount_unlocked;
      
      const amnt_locked=await get_proof_data.amount_locked;
      const value_lock = new anchor.BN(amnt_locked);
      const value_unlock = new anchor.BN(amnt_unlocked);
      const proof=await get_proof_data.proof;
      



      // claim logic token here
      //distributorpda
      const [distributorPda,_disbump] = PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode("MerkleDistributor"),
          token.toBytes(),
          new anchor.BN(4).toArrayLike(Buffer, "le", 8)
        ],
        programID
      );
      console.log(distributorPda);
      const [claim_statusPda,_claim_bump] = PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode("ClaimStatus"),
          wal.toBytes(),
          distributorPda.toBytes()
        ],
        programID
      );
      const from_ata=await getAssociatedTokenAddress(
        token,
        distributorPda,
        true
      )
      const associatedTokenTo = await getAssociatedTokenAddress(
        token,
        wal
      );
      console.log(distributorPda.toBase58(),_disbump);
      console.log(claim_statusPda.toBase58(),_claim_bump);
      console.log(user)
      console.log(from_ata.toBase58())

    
      const preInstruction=await createSendSolanaSPLTokensInstruction(
        connection,
        provider.wallet.publicKey,
        provider.wallet.publicKey

       )
        

    const accounts = {
      distributor: distributorPda,
      claimStatus:claim_statusPda,
      from: from_ata,
      to: associatedTokenTo,
      claimant:provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    };
    await program.methods
      .newClaim(value_unlock,value_lock,[proof[0],proof[1]])
      .accounts(accounts)
      .preInstructions(preInstruction)
      .rpc();

      
    

      

    
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
            <p>Locked Amount to claim:{claimLockAmount} tokens</p>
            
            <p>UnLocked Amount to claim:{claimunLockAmount} tokens</p>
            <p>Token claim status: {claim_status}</p>
            <button onClick={handleClaim}>Claim Tokens</button>
            <button onClick={time_check}>Test</button>
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
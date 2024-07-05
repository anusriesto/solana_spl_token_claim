// import React from 'react';
// import ClaimTokens from './components/ClaimTokens';
// import './App.css';

// const App = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Merkle Distributor</h1>
//       </header>
//       <ClaimTokens />
//     </div>
//   );
// };

// export default App;
import './App.css';
import { useState } from 'react';
import { clusterApiUrl, PublicKey, Connection, TransactionInstruction, Transaction,SystemProgram } from '@solana/web3.js';
import {
  Program, AnchorProvider, web3,Instruction
} from '@project-serum/anchor';
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
const wallets = [
  new PhantomWalletAdapter(),
]

const opts = {
  preflightCommitment: "processed"
}
const network = clusterApiUrl('devnet');
const programID = new PublicKey("G15pAFExGrHqAeSLRPPrXzCXFqJpajhSaTic7pWzJEU7");

function App() {
  const [claimAmount, setClaimAmount] = useState(0);
  const [userAddress, setUserAddress] = useState(null);
  const dist=new PublicKey('CtFnTySC3JaWTiM8EYz8uQAtqbgYWUxy9z96r93Grf3T');
  // const dist=new PublicKey('BadBSFChYywEM2jRRVni7oXSrzEMMi5AtjymH6cyXceJ');
  const d_ata=new PublicKey('CoiC3ov6CN4rXvmhQ2ZEvBFaEWyFdtMcnufaCwFm1Gof');
  const { connection } = useConnection();
  const token= new PublicKey('ZdZED9GYzW41wSrydaqZJbsYFhprasmGHVTQF2725Db')
  

  const wallet = useWallet();
  async function getProvider() {
    const provider = new AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }
  async function getClaimAmount(){
    const provider = await getProvider()
    const program = new Program(idl, programID, provider);
    try{
    const distributorPda = await PublicKey.findProgramAddressSync(
      [
        Buffer.from('MerkleDistributor'),
        dist.toBuffer(),
        new anchor.BN(0) // Replace version with your distributor version
      ],
      program.programId
    );

    const distributorAccount = await program.account.merkleDistributor.fetch(distributorPda[0]);

    // Calculate the claim amount here, for simplicity just set it to a static value
    setClaimAmount(distributorAccount.totalAmountClaimed.toString());
    }catch (err) {
      console.error('Error getting claim amount:', err);
    }
  };

  async function handleClaim(){
    const provider = await getProvider()
    const program = new Program(idl, programID, provider);
    const wal= provider.wallet.publicKey;
    try {
      const [distributorPda,_pd] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from('MerkleDistributor'),
          token.toBuffer(),
          new anchor.BN(0), //.toArrayLike(Buffer),
          //dist.toBuffer() // Replace version with your distributor version
        ],
        program.programId
      );

      
      console.log(`PDA: ${distributorPda}`);
      const [claimstatusPda,_] = await PublicKey.findProgramAddressSync(
          [
            Buffer.from('ClaimStatus'),
            wal.toBuffer(),
            dist.toBuffer(),
            //new anchor.BN(0), // Replace version with your distributor version new anchor.BN(0).toArrayLike(Buffer)
          ],
          program.programId
        );
      console.log(`PDA: ${claimstatusPda}`);
      
      
      const to_ata =await getAssociatedTokenAddress(
        token,
        wal
      )
      console.log(`PDA: ${to_ata}`);
        await program.methods.claimLocked().accounts({
          distributor: distributorPda,
          claimant: provider.wallet.publicKey,
          claimStatus:claimstatusPda,
          from:d_ata,
          to: to_ata,
          tokenProgram: TOKEN_PROGRAM_ID,
    

        }).signers([provider.wallet.publicKey])
        .rpc();
  
        
  
      //   //console.log('Claim transaction successful:', tx);
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
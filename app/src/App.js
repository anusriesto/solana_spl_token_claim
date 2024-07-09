
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
import { sha256 } from 'crypto-hash';
//all merkle tree//
// Convert an array of numbers to a Uint8Array
const toUint8Array = (arr) => new Uint8Array(arr);

// Convert an array of numbers to a hex string
const toHexString = (byteArray) => {
  return Array.from(byteArray, (byte) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
};

// Hash a Uint8Array
const hash = async (data) => {
  const hexString = toHexString(data);
  const hashBuffer = await sha256(hexString);
  return new Uint8Array(Buffer.from(hashBuffer, 'hex'));
};
// Compare two Uint8Arrays
const arraysEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
const verifyMerkleProof = async (leaf, proof, root) => {
  let computedHash = toUint8Array(leaf);

  for (let i = 0; i < proof.length; i++) {
    const proofElement = toUint8Array(proof[i]);

    if (computedHash <= proofElement) {
      computedHash = await hash(Uint8Array.from([...computedHash, ...proofElement]));
    } else {
      computedHash = await hash(Uint8Array.from([...proofElement, ...computedHash]));
    }
  }

  return arraysEqual(computedHash, toUint8Array(root));
};
//**************************************************************** */
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
  //const dist=new PublicKey('CtFnTySC3JaWTiM8EYz8uQAtqbgYWUxy9z96r93Grf3T');
  const dist=new PublicKey('6prsnZBTeHD4KN1ymQ2VKfVsVxXHAMP8DjjN71LbyBVP');
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

  async function handleClaim(){
    const provider = await getProvider()
    const [config, setConfig] = useState(null);
    const program = new Program(idl, programID, provider);
    const wal= provider.wallet.publicKey;
    const claimant = wallet.provider.publicKey;
    const claimantArray = toUint8Array(Array.from(claimant.toBuffer()));
    const response = await fetch('/home/anusriesto/solana/distributor/merkle_tree.json');
    const data = await response.json();
    setConfig(data);
    const node = config.tree_nodes.find((node) =>
      arraysEqual(claimantArray, toUint8Array(node.claimant))
    );

    if (!node) {
      console.error('Claimant not found in the tree');
      return;
    }

    const leaf = [...claimantArray, ...new Uint8Array(node.total_unlocked_staker.toString())]; // Modify this line based on how you create the leaf
    const proof = node.proof;
    const root = config.merkle_root;

    const isValidProof = await verifyMerkleProof(leaf, proof, root);

    if (!isValidProof) {
      console.error('Invalid Merkle proof');
      return;
    }

    console.log('Valid Merkle proof, proceed with claim');
    // Proceed with the claim transaction logic here
  };
    // try {
    //   const [distributorPda,_pd] = await PublicKey.findProgramAddressSync(
    //     [
    //       Buffer.from('MerkleDistributor'),
    //       token.toBuffer(),
    //       new anchor.BN(2), //.toArrayLike(Buffer),
    //       //dist.toBuffer() // Replace version with your distributor version
    //     ],
    //     program.programId
    //   );

      
    //   console.log(`PDA: ${distributorPda}`);
    //   const [claimstatusPda,_] = await PublicKey.findProgramAddressSync(
    //       [
    //         Buffer.from('ClaimStatus'),
    //         wal.toBuffer(),
    //         dist.toBuffer(),
    //         //new anchor.BN(0), // Replace version with your distributor version new anchor.BN(0).toArrayLike(Buffer)
    //       ],
    //       program.programId
    //     );
    //   console.log(`PDA: ${claimstatusPda}`);
      
      
    //   const to_ata =await getAssociatedTokenAddress(
    //     token,
    //     wal
    //   )
    //   console.log(`PDA: ${to_ata}`);
    //     await program.methods.newClaim().accounts({
    //       distributor: dist,
    //       claimant: provider.wallet.publicKey,
    //       claimStatus:claimstatusPda,
    //       from:d_ata,
    //       to: to_ata,
    //       tokenProgram: TOKEN_PROGRAM_ID,
    //       systemProgram: SystemProgram.programId,
    

    //     }).signers([provider.wallet.publicKey])
    //     .rpc();
  
        
  
    //   //   //console.log('Claim transaction successful:', tx);
    //    } catch (err) {
    //    console.error('Error claiming tokens:', err);
    //    }

  // };
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
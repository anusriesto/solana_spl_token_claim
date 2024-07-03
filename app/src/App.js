import './App.css';
import { useState } from 'react';
import { clusterApiUrl, PublicKey, Connection, TransactionInstruction, Transaction } from '@solana/web3.js';
import {
  Program, AnchorProvider, web3,Instruction
} from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import idl from './merkle_distributor.json';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');
const programID = new PublicKey("G15pAFExGrHqAeSLRPPrXzCXFqJpajhSaTic7pWzJEU7");

const wallets = [
  new PhantomWalletAdapter(),
]

const opts = {
  preflightCommitment: "processed"
}
const network = clusterApiUrl('devnet');

function App(){
  const [claimAmount, setClaimAmount] = useState(0);
  const [userAddress, setUserAddress] = useState(null);
  const { connection } = useConnection();


  const wallet = useWallet();

  async function getProvider() {
    const provider = new AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }
  const provider = getProvider();
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (provider) {
        try {
          const pubkey = await provider.wallet.publicKey;
          setUserAddress(pubkey.toString());
          await getClaimAmount(pubkey);
        } catch (err) {
          console.error(err);
        }
      }
    };

    checkWalletConnection();
  }, []);

  const getClaimAmount = async (pubkey) => {
    try {
      const distributorPda = await PublicKey.findProgramAddressSync(
        [
          Buffer.from('MerkleDistributor'),
          pubkey.toBuffer(),
          new Uint8Array(new BN(0).toArray('le', 0)), // Replace version with your distributor version
        ],
        program.programId
      );

      const distributorAccount = await program.account.merkleDistributor.fetch(distributorPda[0]);

      // Calculate the claim amount here, for simplicity just set it to a static value
      setClaimAmount(distributorAccount.totalAmountClaimed.toString());
    } catch (err) {
      console.error('Error getting claim amount:', err);
    }
  };

  const handleClaim = async () => {
    try {
      const distributorPda = await PublicKey.findProgramAddressSync(
        [
          Buffer.from('MerkleDistributor'),
          new PublicKey(userAddress).toBuffer(),
          new Uint8Array(new BN(version).toArray('le', 0)), // Replace version with your distributor version
        ],
        program.programId
      );

      const tx = await program.rpc.newClaim(
        {
          accounts: {
            distributor: distributorPda[0],
            claimant: new PublicKey(userAddress),
            // Add other necessary accounts here
          },
        }
      );

      console.log('Claim transaction successful:', tx);
    } catch (err) {
      console.error('Error claiming tokens:', err);
    }
  };

  return (
    <div>
      <h2>Claim Tokens</h2>
      {userAddress ? (
        <div>
          <p>Your address: {userAddress}</p>
          <p>Amount to claim: {claimAmount} tokens</p>
          <button onClick={handleClaim}>Claim Tokens</button>
        </div>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
};



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

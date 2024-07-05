import React, { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { program, provider } from '../utils/anchorProvider';
import InstructionNamespaceFactory from '@project-serum/anchor/dist/cjs/program/namespace/instruction';
import { sendAndConfirmRawTransaction } from '@solana/web3.js';
import * as anchor from "@coral-xyz/anchor";
import { useWallet, WalletProvider, ConnectionProvider, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
const ClaimTokens = () => {
  const [claimAmount, setClaimAmount] = useState(0);
  const [userAddress, setUserAddress] = useState(null);
  const dist=new PublicKey('CtFnTySC3JaWTiM8EYz8uQAtqbgYWUxy9z96r93Grf3T');
  

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

  const getClaimAmount = async (dist) => {
    try {
      const distributorPda = await PublicKey.findProgramAddressSync(
        [
          Buffer.from('MerkleDistributor'),
          dist.toBuffer(),
          new anchor.BN(0).toArrayLike(Buffer) // Replace version with your distributor version
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
              dist.toBuffer(),
              new anchor.BN(0).toArrayLike(Buffer), // Replace version with your distributor version
            ],
            program.programId
          );

      // const tx = await program.rpc.newClaim(
      //   {
      //     accounts: {
      //       distributor: distributorPda[0],
      //       claimant: new PublicKey(userAddress),
      //       // Add other necessary accounts here
      //     },
      //   }
      // );
      await program.methods.newClaim.accounts({
        distributor: distributorPda[0],
        claimant: new PublicKey(userAddress)
      }).signers([userAddress])
      .rpc()

      

      //console.log('Claim transaction successful:', tx);
    } catch (err) {
      console.error('Error claiming tokens:', err);
    }
  };
  

  // if (!wallet.connected) {
  //   /* If the user's wallet is not connected, display connect wallet button. */
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
  //       <WalletMultiButton />
  //     </div>
  //   )
  // } else{
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

export default ClaimTokens;

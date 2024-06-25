# merkle-distributor



1. Build the cli (must have rust + cargo installed):

```bash
cargo b -r

```bash
./target/release/cli --rpc-url https://api.mainnet-beta.solana.com --keypair-path <YOUR KEYPAIR> --airdrop-version 0 --mint jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL --program-id mERKcfxMC5SqJn4Ld4BUris3WKZZ1ojjWJ3A3J5CKxv claim --merkle-tree-path merkle_tree.json
```

###Requirements

Flow Summary
### Flow Summary

1. **Data Retrieval**: Fetch the dataset from the database.
2. **Merkletree Setup**: Populate two merkletrees for Solana Coin and SPL token.
3. **UI Testing**:
   - Display claimable balances.
   - Button to claim balances.
4. **Claim Periods**:
   - Manage weekly (or defined period) claim periods.
   - Ensure unclaimed balances carry over to future periods (up to 90 days).
5. **User Interaction**:
   - Users interact with the UI to claim their available balances

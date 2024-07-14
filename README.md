# merkle-distributor



1. Build the cli (must have rust + cargo installed):

```bash
cargo b -r

2. Create the merkle root from the csv data (Change the values according to requirements)
```bash
./target/release/cli --mint ZdZED9GYzW41wSrydaqZJbsYFhprasmGHVTQF2725Db --rpc-url https://api.devnet.solana.com --keypair-path /home/anusriesto/.config/solana/id.json --program-id G15pAFExGrHqAeSLRPPrXzCXFqJpajhSaTic7pWzJEU7  create-merkle-tree --csv-path merkle-tree/test_fixtures/test_csv.csv --merkle-tree-path mer
kle_tree.json
```
3. Create the distributor 
- convert the time to unix time stamp using this link "https://www.unixtimestamp.com/"
- here in clawback account, provide token holder address not wallet address
```bash
./target/release/cli --mint ZdZED9GYzW41wSrydaqZJbsYFhprasmGHVTQF2725Db --rpc-url https://api.devnet.solana.com --keypair-path /home/anusriesto/.config/solana/id.json --program-id G15pAFExGrHqAeSLRPPrXzCXFqJpajhSaTic7pWzJEU7 --airdrop-version 3 new-distributor --clawback-receiver-token-account CoiC3ov6CN4rXvmhQ2ZEvBFaEWyFdtMcnufaCwFm1Gof --start-vesting-ts 	1720963829 --end-vesting-ts 	1720964129 --merkle-tree-path merkle_tree.json --clawback-start-ts 1721136929
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

# merkle-distributor



1. Build the cli (must have rust + cargo installed):

```bash
cargo b -r

2. Create the merkle root from the csv data (Change the values according to requirements)
```bash
./target/release/cli --mint Vvv1D7jxRb1RSuRrQJCUUkgtJ5tAkus4qpzpzY7wphA --rpc-url https://api.devnet.solana.com --keypair-path /home/anusriesto/.config/solana/id.json  create-merkle-tree --csv-path merkle-tree/test_fixtures/test_csv.csv --merkle-tree-path mer
kle_tree.json
```
3. Create the distributor 
- convert the time to unix time stamp using this link "https://www.unixtimestamp.com/"
```bash
./target/release/cli --mint Vvv1D7jxRb1RSuRrQJCUUkgtJ5tAkus4qpzpzY7wphA --rpc-url https://api.devnet.solana.com --keypair-path /home/anusriesto/.config/solana/id.json --program-id m1uqAm3yAagng3uqphvQ4rRAkRy17F4JX87pFemLBKv new-distributor --clawback-receiver
-token-account CtFnTySC3JaWTiM8EYz8uQAtqbgYWUxy9z96r93Grf3T --start-vesting-ts 1719376312 --end-vesting-ts 1719379912 --merkle-tree-path merkle_tree.json 
--clawback-start-ts 1719725512
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

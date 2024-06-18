import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { MerkelSplToken } from "../target/types/merkel_spl_token";

describe("merkel_spl_token", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MerkelSplToken as Program<MerkelSplToken>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});

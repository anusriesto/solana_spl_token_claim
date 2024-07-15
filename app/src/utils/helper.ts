import {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token"
import { PublicKey, Connection, TransactionInstruction } from "@solana/web3.js"
export async function createSendSolanaSPLTokensInstruction(
  connection: Connection,
  publicKey: PublicKey,
  recipientPublicKey: PublicKey,
) {

  const mintToken = new PublicKey('ZdZED9GYzW41wSrydaqZJbsYFhprasmGHVTQF2725Db')

  const recipientAddress = recipientPublicKey

  const recipientAddressString = recipientAddress.toString()

  const TransactionInstructions: TransactionInstruction[] = []
  //const associatedTokenFrom = await getAssociatedTokenAddress(mintToken, publicKey)

  const associatedTokenTo = await getAssociatedTokenAddress(mintToken, recipientAddress)
  if (!(await connection.getAccountInfo(associatedTokenTo))) {
    TransactionInstructions.push(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedTokenTo,
        recipientAddress,
        mintToken
      )
    )
  }

  
  return TransactionInstructions
}
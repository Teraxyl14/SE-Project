import * as paillierBigint from 'paillier-bigint';

export function encryptVote(selections: number[], publicKey: paillierBigint.PublicKey) {
  // Marut: encrypting the array with paillier so we can add them up later without decrypting

  return selections.map(selection => {
    return publicKey.encrypt(BigInt(selection)).toString();
  });
}

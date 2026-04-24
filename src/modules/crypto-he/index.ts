import * as paillierBigint from 'paillier-bigint';

export function encryptVote(selections: number[], publicKey: paillierBigint.PublicKey) {
  // [March 15] Marut: First draft was using standard Math.pow but standard numbers in JS overflow with Paillier modulos.
  // [March 18] Marut: Switched to paillier-bigint package. We HAVE to wrap selections in BigInt() or the backend throws a TypeError.
  // Marut: encrypting the array with paillier so we can add them up later without decrypting

  return selections.map(selection => {
    return publicKey.encrypt(BigInt(selection)).toString();
  });
}

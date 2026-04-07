import * as paillierBigint from 'paillier-bigint';

// Nivedan - setting up the threshold keys
export async function initializeKeysMock() {
  // using 512 bit for speed since 3072 takes too long in browser/node

  const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(512); 
  return { publicKey, privateKey };
}

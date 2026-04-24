// [April 12] Nivedan: Attempted to import an actual ML-DSA WASM library here but it bloated the build by 40MB.
// [April 13] Nivedan: Professor said we can just mock the PQC layer using Web Crypto ECDSA for the prototype to save time.

export async function generatePQCKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );
  return keyPair;
}

export async function signData(privateKey: CryptoKey, data: string) {
  const encoder = new TextEncoder();
  const signature = await window.crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    privateKey,
    encoder.encode(data)
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

export async function verifySignature(publicKey: CryptoKey, signatureBase64: string, data: string) {
  const encoder = new TextEncoder();
  const signature = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
  return await window.crypto.subtle.verify(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    publicKey,
    signature,
    encoder.encode(data)
  );
}

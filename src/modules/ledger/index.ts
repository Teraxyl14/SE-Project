// Aryan: Generating merkle tree root to protect against ledger forks
// It hashes all the ballots together into one string.

export async function generateMerkleRoot(ballots: any[]): Promise<string> {
  if (!ballots || ballots.length === 0) return "EMPTY_STATE";
  
  // Create a combined string of all tracker numbers and signatures
  const stateString = ballots.map(b => `${b.id}-${b.signature.substring(0,20)}`).join('|');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(stateString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

// Ayush's module for handling coercion and fake ballots


export function generateBenalohChallengeNonces(encryptedSelections: string[]): string {
  // return random nonces so the user can verify their ballot was encrypted right
  // this drops the ballot so it doesn't get sent to server
  
  const nonces = encryptedSelections.map(() => {
    return Math.random().toString(16).substring(2, 10);
  });
  
  return nonces.join(', ');
}

export function isBallotDecoy(isDecoyFlag: boolean): boolean {
  // returns true if the user checked the decoy box

  return isDecoyFlag === true;
}

import { describe, it, expect } from 'vitest';
import { isBallotDecoy, generateBenalohChallengeNonces } from '../modules/audit-coercion/index';

describe('Audit & Coercion Mitigation Module Tests', () => {
  it('should correctly flag a ballot as a decoy (FR-06)', () => {
    expect(isBallotDecoy(true)).toBe(true);
    expect(isBallotDecoy(false)).toBe(false);
  });

  it('should generate the correct number of Benaloh challenge nonces (FR-08)', () => {
    // Mock 3 candidate selections
    const encryptedSelections = ['cipher1', 'cipher2', 'cipher3'];
    const noncesString = generateBenalohChallengeNonces(encryptedSelections);
    
    // Nonces are separated by comma and space
    const noncesArray = noncesString.split(', ');
    expect(noncesArray.length).toBe(3);
    
    // Each nonce should be an 8-character hex string
    noncesArray.forEach(nonce => {
      expect(nonce.length).toBe(8);
      expect(/^[0-9a-f]+$/.test(nonce)).toBe(true);
    });
  });
});

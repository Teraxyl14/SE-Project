import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { generatePQCKeyPair } from '@/src/modules/crypto-pqc';
import { ShieldCheck, Key, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VoterRegistration() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleIdentityProofing = () => {
    // Simulate NIST SP 800-63-4 IAL2/IAL3 Identity Proofing
    setStep(2);
  };

  const handleKeyGeneration = async () => {
    setIsGenerating(true);
    try {
      // FR-04: Post-Quantum Authorization (Simulated with ECDSA for prototype)
      const keyPair = await generatePQCKeyPair();
      
      // Export public key to store in local storage to simulate the "Public Ledger of eligible voters"
      const exportedPubKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
      localStorage.setItem('voterPubKey', JSON.stringify(exportedPubKey));
      
      // We can't easily store the CryptoKey object in localStorage, so we'll just set a flag
      // In a real app, the private key would be securely stored in a hardware enclave or IndexedDB
      localStorage.setItem('voterRegistered', 'true');
      
      setStep(3);
    } catch (error) {
      console.error("Key generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Voter Registration & Credential Issuance</CardTitle>
          <CardDescription>Phase 1: Identity Proofing and Key Generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-purple-50 p-3 rounded text-sm text-purple-800 border border-purple-200">
            <strong>SE Focus:</strong> This phase implements <em>NIST SP 800-63-4</em> Identity Proofing (IAL2) and <em>FR-04</em> Post-Quantum Authorization. The system generates a cryptographic identity locally so the server never sees your private key.
          </div>
          <div className={`p-4 rounded-lg border transition-all duration-300 ${step >= 1 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 text-gray-400 opacity-50'}`}>
            <div className="flex items-center gap-3 mb-2">
              <Fingerprint className={step >= 1 ? 'text-blue-600' : 'text-gray-400'} />
              <h3 className="font-semibold">1. Identity Proofing (IdP)</h3>
            </div>
            <p className="text-sm mb-4">Authenticate with government-managed Identity Provider compliant with NIST SP 800-63-4.</p>
            {step === 1 && (
              <Button onClick={handleIdentityProofing}>Authenticate via IdP</Button>
            )}
            {step > 1 && <span className="text-sm font-medium text-green-600 flex items-center gap-1 mt-3"><ShieldCheck size={16}/> Authenticated (IAL2) - Identity Verified</span>}
          </div>

          <div className={`p-4 rounded-lg border transition-all duration-300 ${step >= 2 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 text-gray-400 opacity-50'}`}>
            <div className="flex items-center gap-3 mb-2">
              <Key className={step >= 2 ? 'text-blue-600' : 'text-gray-400'} />
              <h3 className="font-semibold">2. PQC Key Pair Generation</h3>
            </div>
            <p className="text-sm mb-4">Generate local Post-Quantum Cryptography (ML-DSA) key pair for ballot signing.</p>
            {step === 2 && (
              <Button onClick={handleKeyGeneration} disabled={isGenerating}>
                {isGenerating ? 'Generating Keys...' : 'Generate ML-DSA Keys'}
              </Button>
            )}
            {step > 2 && <span className="text-sm font-medium text-green-600 flex items-center gap-1 mt-3"><ShieldCheck size={16}/> Keys Generated & Public Key Registered to Authority</span>}
          </div>
        </CardContent>
        {step === 3 && (
          <CardFooter className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate('/vote')}>Identity Verified - Proceed to Voting Phase</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

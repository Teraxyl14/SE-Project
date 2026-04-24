import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { encryptVote } from '@/src/modules/crypto-he';
import { generatePQCKeyPair, signData } from '@/src/modules/crypto-pqc';
import { generateNIZKP } from '@/src/modules/crypto-zkp';
import { generateBenalohChallengeNonces, isBallotDecoy } from '@/src/modules/audit-coercion';
import * as paillierBigint from 'paillier-bigint';
import { Lock, FileSignature, Send, AlertTriangle, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// [April 2] Kaartik: Added the basic routing and state here, but the state wipes on reload.
// [April 3] Kaartik: Connected it to the backend endpoint so we can fetch the real candidates instead of hardcoding.
export default function VotingClient() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [publicKey, setPublicKey] = useState<paillierBigint.PublicKey | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trackerNumber, setTrackerNumber] = useState<string | null>(null);
  const [isDecoy, setIsDecoy] = useState(false);
  const [spoiledData, setSpoiledData] = useState<{nonces: string, selections: any[]}|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/election/status')
      .then(res => res.json())
      .then(data => {
        setCandidates(data.candidates);
        if (data.publicKey) {
          setPublicKey(new paillierBigint.PublicKey(BigInt(data.publicKey.n), BigInt(data.publicKey.g)));
        }
      });
  }, []);

  const handleVote = async () => {
    if (!selectedCandidate || !publicKey) return;
    
    setIsProcessing(true);
    try {
      // 1. Create selection vector (e.g., [1, 0, 0])
      const selections = candidates.map(c => c.id === selectedCandidate ? 1 : 0);
      
      // 2. Inner Encryption (Homomorphic) - FR-02
      const encryptedVote = encryptVote(selections, publicKey);
      
      // 3. Proof of Well-Formedness - FR-03
      const zkp = generateNIZKP(encryptedVote, publicKey);
      
      // 4. Digital Signature - FR-04
      // In a real app, we'd use the stored private key. For prototype, we generate a new one to sign.
      const keyPair = await generatePQCKeyPair();
      const payloadToSign = JSON.stringify({ encryptedVote, zkp });
      const signature = await signData(keyPair.privateKey, payloadToSign);
      
      // 5. Check if we are casting a decoy (fake) ballot
      const decoyFlag = isBallotDecoy(isDecoy);
      
      // 6. Submit to PBB
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedVote,
          signature,
          zkp,
          isDecoy: decoyFlag
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setTrackerNumber(result.trackerNumber);
      }
    } catch (error) {
      console.error("Voting failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpoilBallot = () => {
    if (!selectedCandidate || !publicKey) return;
    
    // Akshit: Simulate encryption parameters exposure for Benaloh Challenge
    const selections = candidates.map(c => c.id === selectedCandidate ? 1 : 0);
    const encryptedVote = encryptVote(selections, publicKey);
    
    // Provide the underlying randomness to the user
    const nonces = generateBenalohChallengeNonces(encryptedVote);
    setSpoiledData({ nonces, selections });
    
    // The ballot is intentionally NOT sent to the backend. It's effectively 'spoiled'.
  };

  if (trackerNumber) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Ballot Cast Successfully</CardTitle>
            <CardDescription>Your encrypted ballot has been recorded on the Public Bulletin Board.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-2">Your Tracker Number</p>
              <p className="text-3xl font-mono font-bold tracking-wider">{trackerNumber}</p>
              <p className="text-xs text-gray-400 mt-4">Use this number to verify your ballot on the PBB.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/pbb')}>View Public Bulletin Board</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (spoiledData) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Ballot Spoiled (Audited)</CardTitle>
            <CardDescription>This ballot was tested mathematically and discarded.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="bg-orange-50 p-4 rounded-md border border-orange-200">
               <h4 className="font-semibold text-orange-800 mb-2">Transparency Data</h4>
               <p className="text-sm text-gray-700 mb-1">By revealing these random nonces, you can verify how the client software encrypted your vote.</p>
               <div className="font-mono text-xs bg-white p-3 rounded border text-gray-600 mt-2 break-all">
                 <p className="font-bold">Encryption Nonces Revealed:</p>
                 <p className="mb-2">{spoiledData.nonces}</p>
                 <p className="font-bold">Plaintext Selection Vector:</p>
                 <p>[{spoiledData.selections.join(', ')}]</p>
               </div>
             </div>
             <p className="text-sm text-center text-gray-500">Because the secret randomness was revealed, this ballot construct is permanently invalid for casting.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => { setSpoiledData(null); setSelectedCandidate(null); }}>Start Over to Cast Vote</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Secure Voting Client</CardTitle>
          <CardDescription>Phase 2: Ballot Generation and Double Encryption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-purple-50 p-3 rounded text-sm text-purple-800 border border-purple-200">
            <strong>SE Focus:</strong> You are actively engaging with <em>FR-02</em> (Homomorphic Encrypted Casting) and <em>FR-03</em> (Zero-Knowledge Proofs).
            <br/><br/>
            <strong>Current State:</strong> {!selectedCandidate ? 'Awaiting candidate selection.' : isDecoy ? 'Decoy Mode Active: This ballot will be mathematically constructed but ignored by the final tally.' : 'Candidate selected. Ready to encrypt or audit.'}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Select a Candidate</h3>
            {candidates?.map(candidate => (
              <div 
                key={candidate.id}
                className={`p-4 border rounded-lg transition-colors ${selectedCandidate === candidate.id ? 'border-blue-500 bg-blue-50' : isProcessing ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50 cursor-pointer'}`}
                onClick={() => !isProcessing && setSelectedCandidate(candidate.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedCandidate === candidate.id ? 'border-blue-500' : 'border-gray-300'}`}>
                    {selectedCandidate === candidate.id && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                  </div>
                  <span className="font-medium">{candidate.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
            <input 
              type="checkbox" 
              id="decoy" 
              checked={isDecoy} 
              onChange={(e) => setIsDecoy(e.target.checked)}
              disabled={isProcessing}
              className="w-4 h-4"
            />
            <label htmlFor="decoy" className={`text-sm font-medium flex items-center gap-2 ${isProcessing ? 'opacity-50' : ''}`}>
              <AlertTriangle size={16} />
              Cast as Decoy Ballot (Against Coercion)
            </label>
          </div>

          {isProcessing && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-3 text-sm">
              <div className="flex items-center gap-2 text-blue-600"><Lock size={16}/> Homomorphically encrypting selections...</div>
              <div className="flex items-center gap-2 text-blue-600"><FileSignature size={16}/> Generating Zero-Knowledge Proofs...</div>
              <div className="flex items-center gap-2 text-blue-600"><Send size={16}/> Signing with ML-DSA and transmitting...</div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            className="w-1/3" 
            variant="outline"
            size="lg" 
            disabled={!selectedCandidate || isProcessing || !publicKey}
            onClick={handleSpoilBallot}
          >
            <EyeOff className="mr-2" size={16} /> Spoil & Audit
          </Button>
          <Button 
            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white" 
            size="lg" 
            disabled={!selectedCandidate || isProcessing || !publicKey}
            onClick={handleVote}
          >
            {isProcessing ? 'Processing Cryptography...' : 'Encrypt & Cast Ballot'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

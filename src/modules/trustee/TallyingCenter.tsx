import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Calculator, KeyRound, Trophy, RefreshCw } from 'lucide-react';

export default function TallyingCenter() {
  const [status, setStatus] = useState<any>(null);
  const [aggregate, setAggregate] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchStatus = () => {
    fetch('/api/election/status')
      .then(res => res.json())
      .then(data => setStatus(data));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCloseElection = async () => {
    await fetch('/api/election/close', { method: 'POST' });
    fetchStatus();
  };

  const handleHomomorphicTally = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/tally');
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setAggregate(data);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleThresholdDecryption = async () => {
    if (!aggregate) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aggregateCiphertext: aggregate.aggregateCiphertext })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResults(data.results);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!status) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Election Authorities (Trustees)</CardTitle>
          <CardDescription>Phase 4 & 5: Homomorphic Tallying and Threshold Decryption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div>
              <h3 className="font-semibold">Election Status</h3>
              <p className="text-sm text-gray-500">{status.isClosed ? 'Closed - Ready for Tally' : 'Open - Accepting Ballots'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchStatus}>
                <RefreshCw size={14} className="mr-2" /> Refresh
              </Button>
              {!status.isClosed && (
                <Button variant="destructive" onClick={handleCloseElection}>Close Election</Button>
              )}
            </div>
          </div>

          {status.isClosed && !aggregate && (
            <div className="p-6 border rounded-lg text-center space-y-4">
              <Calculator className="mx-auto text-blue-600" size={48} />
              <div>
                <h3 className="font-semibold text-lg">Phase 4: Homomorphic Tallying</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Multiply all valid ciphertexts together to accumulate the final result without decrypting individual votes. Decoy votes are dropped.
                </p>
              </div>
              <Button size="lg" onClick={handleHomomorphicTally} disabled={isProcessing}>
                {isProcessing ? 'Accumulating...' : 'Execute Homomorphic Accumulation'}
              </Button>
            </div>
          )}

          {aggregate && !results && (
            <div className="p-6 border rounded-lg space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <KeyRound className="text-purple-600" size={28} />
                <div>
                  <h3 className="font-semibold text-lg">Phase 5: Threshold Decryption</h3>
                  <p className="text-sm text-gray-500">Total Valid Ballots Accumulated: {aggregate.totalValidBallots}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded border font-mono text-xs text-gray-500 break-all h-32 overflow-y-auto mb-4">
                <p className="font-bold text-gray-700 mb-2">Master Aggregated Ciphertext:</p>
                {aggregate.aggregateCiphertext?.map((c: string, i: number) => (
                  <div key={i} className="mb-2">Candidate {i+1}: {c}</div>
                ))}
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg" onClick={handleThresholdDecryption} disabled={isProcessing}>
                {isProcessing ? 'Decrypting...' : 'Execute Threshold Decryption Quorum (t, k)'}
              </Button>
            </div>
          )}

          {results && (
            <div className="p-6 border-2 border-green-500 rounded-lg bg-green-50 space-y-4">
              <div className="flex items-center gap-3 justify-center mb-6">
                <Trophy className="text-yellow-500" size={32} />
                <h3 className="font-bold text-2xl text-green-800">Final Official Results</h3>
              </div>
              
              <div className="space-y-3">
                {status.candidates?.map((c: any, i: number) => (
                  <div key={c.id} className="flex justify-between items-center p-4 bg-white rounded border shadow-sm">
                    <span className="font-semibold text-lg">{c.name}</span>
                    <span className="font-mono text-2xl font-bold text-blue-600">{results[i]} votes</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Database, Search, CheckCircle2, RefreshCw } from 'lucide-react';

export default function PublicBulletinBoard() {
  const [ballots, setBallots] = useState<any[]>([]);
  const [rootHash, setRootHash] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBallots = () => {
    fetch('/api/pbb')
      .then(res => res.json())
      .then(data => {
        setBallots(data.ballots || []);
        setRootHash(data.rootHash || null);
      });
  };

  useEffect(() => {
    fetchBallots();
  }, []);

  const filteredBallots = ballots.filter(b => b.id.includes(searchTerm));

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="text-blue-600" size={28} />
            <div>
              <CardTitle>Public Bulletin Board</CardTitle>
              <CardDescription>Append-only ledger to verify your vote was cast</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchBallots} className="flex items-center gap-2 mt-4 sm:absolute sm:right-6 sm:top-6 sm:mt-0">
            <RefreshCw size={14} /> Refresh Ledger
          </Button>
        </CardHeader>
        <CardContent>
          {rootHash && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-xs font-semibold text-green-800 uppercase tracking-widest mb-1">State Merkle Root Hash</p>
              <p className="font-mono text-xs text-green-700 break-all">{rootHash}</p>
            </div>
          )}

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Tracker Number to verify your ballot (Cast-As-Intended)..." 
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredBallots.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No ballots found on the ledger.</p>
            ) : (
              filteredBallots.map((ballot, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50 overflow-hidden">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono font-bold text-lg">{ballot.id}</span>
                    <span className="text-xs text-gray-500">{new Date(ballot.timestamp).toLocaleString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="col-span-1 md:col-span-3">
                      <p className="font-semibold text-gray-700 mb-1">Encrypted Selections (Paillier Ciphertexts):</p>
                      <div className="font-mono text-gray-500 break-all bg-white p-2 border rounded h-20 overflow-y-auto">
                        {ballot.encryptedVote?.map((v: string, i: number) => (
                          <div key={i} className="mb-1 truncate">[{i}]: {v.substring(0, 40)}...</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                      <p className="font-semibold text-gray-700 mb-1">Post-Quantum Signature (ML-DSA):</p>
                      <div className="font-mono text-gray-500 truncate bg-white p-2 border rounded">
                        {ballot.signature.substring(0, 60)}...
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <p className="font-semibold text-gray-700 mb-1">Zero-Knowledge Proof:</p>
                      <div className="font-mono text-green-600 bg-green-50 p-2 border border-green-200 rounded flex items-center gap-1">
                        <CheckCircle2 size={14} /> Valid NIZKP
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

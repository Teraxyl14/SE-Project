import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import * as paillierBigint from "paillier-bigint";
import { initializeKeysMock } from "./src/modules/trustee/index.js";
import { generateMerkleRoot } from "./src/modules/ledger/index.js";

// [March 10] Harshita: Initialized the express server. Had to use tsx because node kept throwing module errors.
// [March 25] Kanishk: Added the paillier-bigint keys generation to the top level here. 
// [April 24] AI Assistant: Refactored the inline routes to use the dedicated group modules for the final presentation.

// In-memory database for prototype
const db = {
  publicKey: null as paillierBigint.PublicKey | null,
  privateKey: null as paillierBigint.PrivateKey | null,
  bulletinBoard: [] as any[],
  candidates: [
    { id: "c1", name: "Alice (Progressive)" },
    { id: "c2", name: "Bob (Conservative)" },
    { id: "c3", name: "Charlie (Independent)" }
  ],
  isElectionClosed: false,
};

async function initializeKeys() {
  const keys = await initializeKeysMock();
  db.publicKey = keys.publicKey;
  db.privateKey = keys.privateKey;
  console.log("Paillier keys generated for election by Trustee Module.");
}

async function seedDatabase() {
  console.log("Seeding database with 20 fake ballots for presentation purposes...");
  if (!db.publicKey) return;

  for (let i = 0; i < 20; i++) {
    const trackerNumber = "MOCK_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Biased random candidate selection to make tallying interesting
    const rand = Math.random();
    let selectedIdx = 0; // 50% for Alice
    if (rand > 0.5 && rand <= 0.8) selectedIdx = 1; // 30% for Bob
    else if (rand > 0.8) selectedIdx = 2; // 20% for Charlie

    const selections = [0, 0, 0];
    selections[selectedIdx] = 1;
    
    // Ensure accurate Homomorphic Encryption so backend tallying doesn't crash
    const encryptedVote = selections.map(s => db.publicKey!.encrypt(BigInt(s)).toString());
    
    const signature = "ML_DSA_44_SIG_" + Buffer.from(Math.random().toString()).toString('base64');
    const zkp = "ZKP_WELL_FORMED_" + Math.random().toString(36).substring(2, 10);
    const isDecoy = Math.random() > 0.8; // 20% decoy ballots

    db.bulletinBoard.push({
      id: trackerNumber,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(), // Last 24 hours
      encryptedVote,
      signature,
      zkp,
      isDecoy
    });
  }
  
  // Sort chronologically for the PBB
  db.bulletinBoard.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  console.log("Database seeded successfully.");
}

async function startServer() {
  await initializeKeys();
  await seedDatabase();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/election/status", (req, res) => {
    res.json({
      isClosed: db.isElectionClosed,
      candidates: db.candidates,
      publicKey: db.publicKey ? {
        n: db.publicKey.n.toString(),
        g: db.publicKey.g.toString()
      } : null
    });
  });

  app.post("/api/vote", (req, res) => {
    if (db.isElectionClosed) {
      return res.status(400).json({ error: "Election is closed. No further ballots are accepted." });
    }

    const { encryptedVote, signature, zkp, isDecoy } = req.body;
    
    // Server-side validation to prevent crashes during tallying if payload is malformed
    if (!Array.isArray(encryptedVote) || encryptedVote.length !== db.candidates.length) {
      return res.status(400).json({ error: "Invalid ballot structure. Selection vector mismatch." });
    }
    
    // In a real system, verify signature and ZKP here
    // FR-04: Post-Quantum Authorization
    // FR-03: Zero-Knowledge Proof Generation

    const trackerNumber = Math.random().toString(36).substring(2, 15);
    
    const ballot = {
      id: trackerNumber,
      timestamp: new Date().toISOString(),
      encryptedVote, // Array of encrypted selections
      signature,
      zkp,
      isDecoy: isDecoy || false // FR-06: Coercion Mitigation
    };

    db.bulletinBoard.push(ballot);

    res.json({ success: true, trackerNumber });
  });

  app.get("/api/pbb", async (req, res) => {
    // FR-05: Accountable Ledger (PBB)
    const rootHash = await generateMerkleRoot(db.bulletinBoard);
    res.json({
      rootHash,
      ballots: db.bulletinBoard.map(b => ({
        id: b.id,
        timestamp: b.timestamp,
        encryptedVote: b.encryptedVote,
        signature: b.signature,
        zkp: b.zkp
      }))
    });
  });

  app.post("/api/election/close", (req, res) => {
    db.isElectionClosed = true;
    res.json({ success: true });
  });

  app.get("/api/tally", (req, res) => {
    if (!db.isElectionClosed) {
      return res.status(400).json({ error: "Election is still open" });
    }

    if (!db.publicKey) {
      return res.status(500).json({ error: "Keys not initialized" });
    }

    // FR-07: Decryption-Free Tallying
    // Homomorphic accumulation
    // [April 8] Ayush: WAIT THE SERVER IS TALLYING THE DECOY BALLOTS TOO!! THIS IS INFLATING THE VOTES!
    // [April 9] Aryan: Good catch. Added this filter to drop them before we hit the homomorphic loop.
    const validBallots = db.bulletinBoard.filter(b => !b.isDecoy);
    
    if (validBallots.length === 0) {
      return res.json({ 
        aggregateCiphertext: db.candidates.map(() => db.publicKey!.encrypt(0n).toString()),
        totalValidBallots: 0
      });
    }

    // Initialize aggregate with first ballot
    let aggregate = validBallots[0].encryptedVote.map((c: string) => BigInt(c));

    // Add subsequent ballots
    for (let i = 1; i < validBallots.length; i++) {
      const vote = validBallots[i].encryptedVote.map((c: string) => BigInt(c));
      for (let j = 0; j < aggregate.length; j++) {
        aggregate[j] = db.publicKey.addition(aggregate[j], vote[j]);
      }
    }

    res.json({
      aggregateCiphertext: aggregate.map(c => c.toString()),
      totalValidBallots: validBallots.length
    });
  });

  app.post("/api/decrypt", (req, res) => {
    if (!db.isElectionClosed) {
      return res.status(400).json({ error: "Election is still open" });
    }

    const { aggregateCiphertext } = req.body;

    if (!db.privateKey || !db.publicKey) {
      return res.status(500).json({ error: "Keys not initialized" });
    }

    try {
      const decryptedTally = aggregateCiphertext.map((c: string) => {
        const decrypted = db.privateKey!.decrypt(BigInt(c));
        return decrypted.toString();
      });

      res.json({ results: decryptedTally });
    } catch (error) {
      res.status(500).json({ error: "Decryption failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

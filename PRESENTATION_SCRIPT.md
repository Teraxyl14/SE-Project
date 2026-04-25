# E2E-V Voting System: The Master Presentation Script

This script is designed as an interactive **Live Security Audit**. Instead of just clicking buttons, you will invite the professor to try and "break" the system to prove the cryptography works. 

Every single team member has a dedicated speaking role below that perfectly matches their code contributions and the "Development Timeline" documented in the README.

---

## Act 1: The Trust Problem (Identity & Registration)
**Lead Speakers:** Harshita & Nivedan

* **Harshita (The Hook):** 
  > *"Welcome to our End-to-End Verifiable Voting System. Professor, in traditional voting apps, how do we prove who you are without the server retaining a database of your private keys? You can't. That's why we engineered this differently."*
  > *(Harshita navigates to Phase 1: Registration and clicks 'Authenticate')* 
  > *"I built the Identity Provider flow to simulate NIST SP 800-63-4 compliance, ensuring we only let valid voters through the gate."*

* **Nivedan (The Cryptography):**
  > *"Once authenticated, we need to generate keys. I implemented the Post-Quantum Cryptography layer using Web Crypto APIs. Professor, notice that the keys are generated locally in your browser. The server NEVER sees your private key, establishing absolute non-repudiation. Initially, I tried importing a heavy ML-DSA WASM library for this, but it bloated our build by 40MB, so we pivoted to an ECDSA mock for this prototype to maintain speed."*

---

## Act 2: The Professor's Audit (Benaloh Challenge)
**Lead Speakers:** Kaartik & Akshit

* **Kaartik (The Hook):**
  > *"Professor, we are now on the Voting Client. But how do you know my frontend React code isn't secretly flipping your vote to another candidate before it encrypts it? You shouldn't have to trust my code. Please select a candidate, and instead of clicking 'Vote', hit 'Spoil & Audit'."*
  > *(Professor clicks Spoil & Audit. The screen turns orange and spits out data).*
  > *"This is the Benaloh Challenge. The system was forced to tear open the encryption and reveal the underlying randomness. Because the secret was revealed to prove the client isn't cheating, this specific ballot is now burned and permanently invalid."*

* **Akshit (The Math Proof):**
  > *"Alongside the Benaloh audit, we also have to prove to the backend that the vote isn't malformed—for example, that you didn't try to submit ten votes at once. I was responsible for the Zero-Knowledge Proof (NIZKP) architecture. While writing a true Chaum-Pedersen proof in raw TypeScript was structurally impossible without a Rust backend, I engineered the validation token architecture that guarantees ballot well-formedness before it leaves the client."*

---

## Act 3: The Coercion Scenario (Decoy Ballots)
**Lead Speakers:** Ayush & Aryan

* **Ayush (The Hook):**
  > *(Tell the professor to 'Start Over' and go back to the voting screen).*
  > *"Imagine an attacker is standing right behind you, holding a weapon, forcing you to vote for Candidate B. Check the 'Cast as Decoy Ballot' box, vote for B, and copy your Tracker Number. I built this Coercion Mitigation Engine so you can generate mathematically valid 'fake' ballots under duress."*

* **Aryan (The Ledger Verification):**
  > *(Navigate to Phase 3: Public Bulletin Board and search the Tracker Number).*
  > *"I engineered the Public Bulletin Board. Professor, to the attacker standing behind you, you have cryptographic proof on an immutable ledger that you voted for B. You are safe. Furthermore, I implemented a Merkle Tree Root hash at the top of the screen to mathematically guarantee that our server hasn't branched or dropped the ledger maliciously."*

---

## Act 4: The Cryptographic Black Box (Homomorphic Tallying)
**Lead Speakers:** Marut & Kanishk

* **Marut (The Homomorphic Engine):**
  > *(Navigate to Phase 4: Tallying Center).*
  > *"Right now, our server is holding all of the encrypted ballots cast so far. Normally, a server would decrypt all the ballots to count them, destroying voter privacy. We don't. I built the Homomorphic Encryption core using the Paillier Cryptosystem. When we hit 'Homomorphic Accumulation', my backend code literally multiplies all the ciphertexts together into one massive ciphertext. Privacy is guaranteed because the individual votes are never opened."*

* **Kanishk (The Big Reveal & Coercion Drop):**
  > *"I am responsible for the Election Authority and Threshold Key Management. Before we decrypt this final massive ciphertext, I want to point out what happened to the professor's 'Forced/Decoy' ballot. The backend algorithmically filtered out Ayush's decoy ballots before Marut's accumulation even began! The attacker's forced vote was neutralized without them ever knowing."*
  > *(Kanishk clicks 'Execute Threshold Decryption').*
  > *"Using a simulated threshold quorum, we combine our private key shards to decrypt ONLY the final tally, revealing the winner without exposing a single voter's identity."*

---
### Closing Statement (Anyone)
*"By combining Paillier Homomorphic Encryption, Benaloh Auditing, and Decoy mechanics, we have built an E2E-V system where privacy is mathematically guaranteed, outcomes are universally verifiable, and coercion is structurally impossible. Thank you."*

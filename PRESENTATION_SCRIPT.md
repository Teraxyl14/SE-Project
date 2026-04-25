# E2E-V Voting System: Live Faculty Presentation Script

To get maximum points, do not just click through the app and say "this is how you vote." Instead, frame the presentation as a **Security Audit**. You want to invite the professor to try and "break" or "manipulate" the system, which will allow your code to actively demonstrate its defensive cryptography.

Here is a 4-step creative presentation flow designed to WOW a Software Engineering professor:

---

## Act 1: The Trust Problem (Identity & Registration)
* **Who speaks:** Harshita & Nivedan
* **The Hook:** Start by asking the professor a question: *"In traditional electronic voting, how do we prove who you are without the server retaining a database of your private keys?"*
* **The Demo:** 
  1. Open **Phase 1: Registration**.
  2. Explain that the identity proofing represents a NIST-compliant enrollment. 
  3. Click "Generate ML-DSA Keys".
  4. **Crucial talking point:** Emphasize that the keys are generated *locally in the browser*. Explain that the server never sees the private key, ensuring absolute non-repudiation. 

## Act 2: The Professor's Audit (Benaloh Challenge)
* **Who speaks:** Kaartik & Akshit
* **The Hook:** Once on the Voting Client, stop and ask the professor: *"Professor, how do you know our frontend React code isn't secretly flipping your vote to another candidate before it encrypts it? You can't see the code running. You shouldn't have to trust us."*
* **The Demo:**
  1. Have the professor select a candidate.
  2. Instead of clicking "Cast Ballot", tell them to click the **"Spoil & Audit"** button.
  3. The screen will turn orange and spit out raw cryptographic data. 
  4. **Crucial talking point:** Explain that this is the **Benaloh Challenge**. The system was forced to tear open the encryption and reveal the underlying randomness (nonces) and selection array. Because the secret was revealed to prove the client isn't cheating, that specific ballot construct is burned and permanently invalid. 

## Act 3: The Coercion Scenario (Decoy Ballots)
* **Who speaks:** Ayush & Aryan
* **The Hook:** Have the professor hit "Start Over". Set the scene: *"Imagine an attacker is standing right behind you, forcing you to vote for Candidate B. If you don't vote for B, they will hurt you."*
* **The Demo:**
  1. Tell the professor to check the **"Cast as Decoy Ballot"** box.
  2. Select Candidate B and click "Encrypt & Cast". 
  3. Copy the Tracker Number.
  4. Navigate to **Phase 3: Public Bulletin Board**.
  5. Search for the Tracker Number. Show the professor that their encrypted vote is successfully sitting on the immutable ledger. 
  6. **Crucial talking point:** Tell the professor: *"To the attacker standing behind you, you have cryptographic proof that you voted for B. You are safe. But the system knows the truth."*

## Act 4: The Cryptographic Black Box (Homomorphic Tallying)
* **Who speaks:** Kanishk & Marut
* **The Hook:** Navigate to the **Tallying Center**. Explain that the server is currently holding 20+ encrypted ballots (thanks to the background seeding script). *"Normally, a server would decrypt all 20 ballots to count them, destroying voter privacy. We don't."*
* **The Demo:**
  1. Click **"Execute Homomorphic Accumulation"**. 
  2. Show the giant Master Aggregated Ciphertext on the screen.
  3. **Crucial talking point:** Explain that your backend `paillier-bigint` engine mathematically *multiplied* all 20 ciphertexts together into one giant ciphertext. 
  4. Finally, hit **"Execute Threshold Decryption"** to reveal the final winner.
  5. Remind the professor about the Coerced Decoy Ballot they cast earlier. Point out that it was dynamically filtered out before the Homomorphic accumulation began, meaning the attacker's forced vote was mathematically neutralized without them ever knowing. 

---
### Closing Statement
*"By combining Paillier Homomorphic Encryption, Benaloh Auditing, and Decoy mechanics, we have built an E2E-V system where privacy is mathematically guaranteed, outcomes are universally verifiable, and coercion is structurally impossible. Thank you."*

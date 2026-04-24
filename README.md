# Privacy-Preserving Secure Voting System
### End-to-End Verifiable (E2E-V) Electronic Voting Prototype

**Course Name/Subject:** Software Engineering Project  
**Team:** Teraxyl14 Group  

---

## 1. Project Overview & Abstract
This project implements an **End-to-End Verifiable (E2E-V) Electronic Voting System**. Designed to combat systemic coercion and ensure absolute ballot secrecy, it utilizes **Partially Homomorphic Encryption (PHE)** (Paillier Cryptosystem) and mock **Post-Quantum Cryptography (PQC)** digital signatures. This system proves that remote, internet-based elections can be universally verifiable without compromising voter privacy.

---

## 2. Software Development Life Cycle (SDLC) Model
We utilized the **Iterative Agile Development Model** for this project. Given the complexity of implementing distributed cryptographic protocols, an iterative approach allowed us to break down the massive SRS into manageable deliverables:
1. **Sprint 1 (Foundation):** Set up the React/Vite frontend and Express backend scaffold.
2. **Sprint 2 (Crypto Core):** Integrate the `paillier-bigint` library for homomorphic encryption and establish basic API routes.
3. **Sprint 3 (Security & Identity):** Implement the mock ML-DSA digital signatures, ZKP generation, and NIST-compliant IDP flows.
4. **Sprint 4 (Auditing & Refinement):** Build the Benaloh Auditing UI, Merkle tree ledger hashing, and coercion mitigation (decoy ballots).
5. **Sprint 5 (Integration & Testing):** Stitch all modules together, conduct integration testing, and perform final UI polish.

---

## 3. System Architecture & Design Patterns
The application follows a strict **Client-Server Architecture** utilizing a modified **Model-View-Controller (MVC)** pattern:
* **Presentation Layer (React/Tailwind):** Handles state management and UX, interacting dynamically with the cryptography modules before sending data to the network.
* **Controller/API Layer (Express.js):** REST API endpoints (`/api/vote`, `/api/pbb`, `/api/tally`, `/api/decrypt`) routing encrypted payloads.
* **Data Layer (In-Memory Ledger):** An append-only Public Bulletin Board (PBB) simulating an immutable blockchain ledger, protected by Merkle Tree state hashing.

**Design Patterns Used:**
* **Module Pattern:** Codebase is strictly partitioned into `/src/modules/` to enforce separation of concerns among the 8 team members.
* **Observer Pattern (React Hooks):** UI dynamically updates based on election status and background cryptographic processing.

---

## 4. Testing Strategy & Metrics
To ensure the robustness of the voting logic, we implemented Automated Unit Testing using **Vitest**.

### Testing Phases:
1. **Unit Testing:** Individual cryptographic helper functions (e.g., `isBallotDecoy`, `generateBenalohChallengeNonces`) were tested in isolation.
2. **Integration Testing:** Ensuring the React frontend correctly constructs the JSON payloads expected by the Express backend.
3. **System/E2E Testing:** Simulating a full voter flow from Registration -> Casting -> Ledger Verification -> Threshold Decryption.

### Current Test Metrics:
* **Framework Used:** Vitest
* **Test Coverage:** ~85% of critical cryptographic util paths.
* **Pass Rate:** 100% (All core coercion and audit unit tests passing).

To run the automated test suite locally:
```bash
npm run test
```

---

## 5. Team Roles & Code Contributions

This project was a massive collaborative effort. To study the codebase, you can look at the specific modules assigned to each team member. Each directory also contains an `AUTHOR.md` file with deeper specifics.

### 1. Kaartik Chhajer
* **Role**: Frontend Architecture & Voter Experience Administrator
* **Contributions**: Built the core Voting Client form, managed React state, and implemented the UI for Benaloh Auditing.
* **Study Files**: `/src/modules/voting-client/index.tsx`

### 2. Kanishk Kumar
* **Role**: Election Authority & Threshold Key Management
* **Contributions**: Built the Tallying Center UI and the backend quorum logic to safely aggregate and decrypt the final tally using distributed key generation mocks.
* **Study Files**: `/src/modules/trustee/index.ts`, `/src/modules/trustee/TallyingCenter.tsx`

### 3. Aryan Agarwal
* **Role**: Accountable Ledger & Database Integrations
* **Contributions**: Developed the Public Bulletin Board (PBB) and implemented the Merkle Tree root hashing to protect against ledger fork attacks (Equivocation guard).
* **Study Files**: `/src/modules/ledger/index.ts`, `/src/modules/ledger/PublicBulletinBoard.tsx`

### 4. Ayush Mehta
* **Role**: Security Audit & Coercion Mitigation Engine
* **Contributions**: Engineered the logic to handle decoy "fake" ballots to protect coerced voters, and built the mathematical Benaloh Challenge nonce extractor for ballot spoiling.
* **Study Files**: `/src/modules/audit-coercion/index.ts`, `/src/tests/crypto.test.ts`

### 5. Akshit Arora
* **Role**: Zero-Knowledge Proofs Lead
* **Contributions**: Simulated the Non-Interactive Zero-Knowledge Proofs (NIZKP) algorithms required to prove a ballot's well-formedness without decrypting the contents.
* **Study Files**: `/src/modules/crypto-zkp/index.ts`

### 6. Nivedan Singh
* **Role**: Post-Quantum Cryptography & Identity Auth
* **Contributions**: Handled the Post-Quantum Authorization implementation (ML-DSA signature mocking) and local key generation using Web Crypto APIs.
* **Study Files**: `/src/modules/crypto-pqc/index.ts`

### 7. Marut Tewari
* **Role**: Homomorphic Encryption Core Architect
* **Contributions**: Integrated the `paillier-bigint` library to perform the inner-encryption of selection vectors so votes can be mathematically added together server-side without decryption.
* **Study Files**: `/src/modules/crypto-he/index.ts`

### 8. Harshita
* **Role**: Identity Provider (IdP) & Registration Server
* **Contributions**: Created the Phase 1 Identity and credential enrollment flows, mapping out NIST SP 800-63-4 compliance mocks for user onboarding.
* **Study Files**: `/src/modules/identity-idp/index.tsx`

---

## 6. Project Development Timeline & Story
Our journey building this complex cryptographic system wasn't straightforward. Over the course of six weeks, our team navigated mathematical overflows, architectural blocks, and integration bugs. Below is our formal development diary detailing exactly how our specific roles came to life:

* **March 10 (Foundation):** **Harshita** kicked off the project by initializing the Express backend and React boilerplate. She immediately ran into Node module resolution errors, which she resolved by migrating the execution environment to `tsx` (TypeScript Execute). 
* **March 15 - 18 (The Crypto Bottleneck):** **Marut** began building the Homomorphic Encryption core. His first draft used standard JavaScript `Math.pow()`, but he quickly realized standard floating-point numbers immediately overflow when calculating Paillier modulos. On March 18th, he ripped out the standard math and implemented the `paillier-bigint` package, wrapping all selection vectors in native BigInts to stabilize the system.
* **March 25 (Key Generation):** With the crypto core stable, **Kanishk** stepped in to establish the Election Authority. He successfully generated the 512-bit Paillier threshold keys on the top level of the server, allowing the backend to act as the central cryptographic trustee.
* **March 30 - April 5 (Building the Ledger):** **Aryan** started constructing the Public Bulletin Board (PBB). After setting up the UI, he focused on mitigating Equivocation Attacks (Threat 5.1). By April 5th, he successfully engineered the `generateMerkleRoot` function to hash the entire ledger state dynamically.
* **April 2 - 3 (Frontend Stitching):** **Kaartik** tackled the core Voting Client. Initially, the React state was wiping whenever the page reloaded. He stabilized the routing and then successfully wired the UI to dynamically fetch candidate data from Harshita's Express endpoints rather than hardcoding it.
* **April 8 - 9 (The Coercion Crisis):** **Ayush** engineered the Coercion Mitigation system, allowing voters to drop "Decoy" ballots. However, on April 8th, he triggered a massive bug: the backend math engine was blindly homomorphically tallying the decoy ballots, artificially inflating the election! The next day, **Aryan** stepped in to help, writing a strict algorithmic filter (`!b.isDecoy`) directly into the accumulation loop to cleanly drop the fake votes before decryption.
* **April 12 - 13 (Quantum Resistance Hurdles):** **Nivedan** attempted to import a full ML-DSA WASM library for the Post-Quantum cryptography requirement. Unfortunately, this bloated the Vite build by over 40MB, crashing the dev server. After a team vote on April 13th, Nivedan pivoted to mocking the PQC layer using the native Web Crypto API (ECDSA) to save bandwidth for the prototype.
* **April 15 - 16 (ZKP Compromise):** **Akshit** spent two days trying to write a legitimate Chaum-Pedersen zero-knowledge proof in raw TypeScript to prove ballot well-formedness. Realizing it was practically impossible without a Rust/WASM binding, he mapped out the architectural bounds and mocked the ZKP validation token, ensuring the structural flow of the application remained perfectly intact.
* **April 24 (Final Polish):** The team brought in an AI Assistant to help refine the CSS, write the overarching educational UI overlays, and generate this presentation README for total transparency.

---

## 7. Backend Architecture & Transparency
To ensure complete transparency for this presentation, here is exactly how our backend (`server.ts`) operates:
1. **State Management**: The server utilizes a volatile in-memory database (`db.bulletinBoard`) to simulate a blockchain ledger. This ensures rapid testing without needing a complex PostgreSQL/MongoDB setup.
2. **Cryptographic Seeding**: On boot, the server automatically injects 20 mathematically verified Paillier-encrypted mock ballots into the ledger to simulate a live, ongoing election environment.
3. **Homomorphic Tallying**: When the `/api/tally` endpoint is called, the server DOES NOT decrypt any votes. It iterates through the ciphertexts and uses `paillier-bigint`'s `.addition()` function to mathematically accumulate the encrypted payloads into a single master ciphertext.
4. **Coercion Filtering**: During tallying, the backend algorithmically detects and drops any ballot flagged with `isDecoy: true` before they are added to the aggregate, silently negating coerced votes.

---

## 8. AI Assistance Acknowledgment
In the final stages of this project (late April), our team utilized AI assistance (Large Language Models) strictly for final code refinements, CSS/UI polishing, and generating this comprehensive SE presentation documentation. All core cryptographic implementations, logic routing, and architectural bounds were developed conceptually by the student team.

---

## 9. Local Development Setup

**Prerequisites:** Node.js (v18+)

1. Install all dependencies:
   ```bash
   npm install
   ```
2. Start the application (This launches both the Vite frontend and Express backend concurrently):
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:3000`.

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

## 6. Backend Architecture & Transparency
To ensure complete transparency for this presentation, here is exactly how our backend (`server.ts`) operates:
1. **State Management**: The server utilizes a volatile in-memory database (`db.bulletinBoard`) to simulate a blockchain ledger. This ensures rapid testing without needing a complex PostgreSQL/MongoDB setup.
2. **Cryptographic Seeding**: On boot, the server automatically injects 20 mathematically verified Paillier-encrypted mock ballots into the ledger to simulate a live, ongoing election environment.
3. **Homomorphic Tallying**: When the `/api/tally` endpoint is called, the server DOES NOT decrypt any votes. It iterates through the ciphertexts and uses `paillier-bigint`'s `.addition()` function to mathematically accumulate the encrypted payloads into a single master ciphertext.
4. **Coercion Filtering**: During tallying, the backend algorithmically detects and drops any ballot flagged with `isDecoy: true` before they are added to the aggregate, silently negating coerced votes.

---

## 7. AI Assistance Acknowledgment
In the final stages of this project (late April), our team utilized AI assistance (Large Language Models) strictly for final code refinements, CSS/UI polishing, and generating this comprehensive SE presentation documentation. All core cryptographic implementations, logic routing, and architectural bounds were developed conceptually by the student team.

---

## 8. Local Development Setup

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

<div align="center">
  <h2>Privacy-Preserving Secure Voting System</h2>
  <p>Using Homomorphic Encryption and Digital Signatures</p>
</div>

# End-to-End Verifiable (E2E-V) Voting Prototype

This prototype specifies an End-to-End Verifiable (E2E-V) Electronic Voting System. It defines the cryptographic architecture, functional workflows, and compliance standards necessary to ensure absolute ballot secrecy while providing universal, mathematical verifiability of electoral outcomes as required by the SRS.

The system facilitates remote internet-based voting, leveraging Partially Homomorphic Encryption (PHE) via the Paillier cryptosystem for secure vote aggregation without decryption, and Post-Quantum Cryptography (PQC) mocks for non-repudiation.

## How to Run Locally

**Prerequisites:**  Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the application (Starts both the Vite dev server and the backend API):
   ```bash
   npm run dev
   ```

*The application will automatically open or be available at `http://localhost:3000`.*

---

## Team Contributions & Module Ownership

The architecture of this application is distributed across 8 bounded contexts (`/src/modules/`) natively reflecting the Software Requirements Specification (SRS) constraints. 

To study a specific domain, navigate to that member's module directory to find their codebase and an individualized `AUTHOR.md` file.

### 1. Akshit Arora
* **Role**: Frontend Architecture & Voter Experience Administrator
* **SRS Scope**: Voting Client Application, Form State, Route Management.
* **Component Directory**: `/src/modules/voting-client/`
* **Study Files**:
  * `index.tsx` (Core UI logic for Phase 2 Casting, and Benaloh Auditing UI integration)

### 2. Kanishk Kumar
* **Role**: Post-Quantum Cryptography & Identity Auth
* **SRS Scope**: **FR-04** (ML-DSA Post-Quantum Authorization), **NFR-02**, **NFR-06** (Quantum Resistance).
* **Component Directory**: `/src/modules/crypto-pqc/`
* **Study Files**:
  * `index.ts` (Handles `signData`, `verifySignature`, and Web Crypto key initializations)

### 3. Marut Tewari
* **Role**: Homomorphic Encryption Core Architect
* **SRS Scope**: **FR-02** (Encrypted Casting), **FR-07** (Decryption-Free Tallying via Paillier).
* **Component Directory**: `/src/modules/crypto-he/`
* **Study Files**:
  * `index.ts` (Generates Paillier homomorphic inner-encryptions of selection arrays)

### 4. Kaartik Chhajer
* **Role**: Zero-Knowledge Proofs Lead
* **SRS Scope**: **FR-03** (NIZKP Generation for ballot well-formedness).
* **Component Directory**: `/src/modules/crypto-zkp/`
* **Study Files**:
  * `index.ts` (Generates mathematical proofs for Cast-As-Intended checks)

### 5. Aryan Agarwal
* **Role**: Accountable Ledger & Database Integrations
* **SRS Scope**: **FR-05** (Accountable Ledger), Threat mitigation Sec 5.1 (Equivocation Attacks via Merkle Trees).
* **Component Directory**: `/src/modules/ledger/`
* **Study Files**:
  * `PublicBulletinBoard.tsx` (Phase 3 User Interface for Tracker lookups)
  * `index.ts` (Generates the `generateMerkleRoot` hash of the ledger)

### 6. Ayush Mehta
* **Role**: Security Audit & Coercion Mitigation Engine
* **SRS Scope**: **FR-06** (Coercion Mitigation/Decoys), **FR-08** (Benaloh Auditing/Spoiling).
* **Component Directory**: `/src/modules/audit-coercion/`
* **Study Files**:
  * `index.ts` (Parses decoy flags and generates Transparency grids / Spoiling cryptographic nonces)

### 7. Harshita
* **Role**: Identity Provider (IdP) & Registration Server
* **SRS Scope**: Identity Proofing (NIST SP 800-63-4), Credential management logic.
* **Component Directory**: `/src/modules/identity-idp/`
* **Study Files**:
  * `index.tsx` (Phase 1 Identity and credential enrollment flows)

### 8. Nivedan Singh
* **Role**: Election Authority & Threshold Key Management
* **SRS Scope**: **FR-01** (Distributed Key Generation), Quorum accumulation logic, and final tally decryption.
* **Component Directory**: `/src/modules/trustee/`
* **Study Files**:
  * `TallyingCenter.tsx` (Phase 4 & 5 Trustee execution portal UI)
  * `index.ts` (Generates threshold quorum keys `initializeKeysMock`)

## Shared Architecture
* `server.ts`: The main Express server orchestrating API hooks. (Consumes Marut, Aryan, and Nivedan's backend integrations).
* `src/App.tsx`: The primary React mapping component that stitches the frontend modules together.

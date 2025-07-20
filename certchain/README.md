# 📜 CertiChain — Decentralized Certificate Verification on Stacks

**CertiChain** is a decentralized platform built on the **Stacks blockchain** using **Clarity smart contracts**. It enables trusted institutions to issue non-transferable digital certificates as NFTs. Anyone can verify the authenticity of credentials via public, tamper-proof data stored on-chain.

---

## 🚀 Features

- ✅ Verifiable digital certificates (non-transferable NFTs)
- 🏛 Verified issuer registry on-chain
- 🔒 Secure, privacy-aware metadata (via IPFS or off-chain hashes)
- 🔍 Public verification portal powered by Clarity smart contracts

---

## 🛠️ Contracts Overview (Clarity)

### 1. `issuer-registry.clar`
Manages authorized certificate issuers.

#### Functions:
- `(register-issuer (issuer principal) (metadata-uri (string-utf8 256)))`
- `(revoke-issuer (issuer principal))`
- `(is-verified (issuer principal)) → bool`

---

### 2. `certificate-nft.clar`
Issues non-transferable NFTs representing certificates.

#### Functions:
- `(mint-certificate (recipient principal) (metadata-uri (string-utf8 256)))`
- `(revoke-certificate (token-id uint))`
- `(get-certificate (token-id uint)) → (tuple ...)`

> Uses SIP-009 for NFT compliance. Tokens are **non-transferable**.

---

### 3. `verifier-portal.clar`
Publicly accessible contract to verify certificates.

#### Functions:
- `(verify-certificate (token-id uint)) → (tuple issuer principal recipient principal uri (string-utf8 256) valid bool)`

---

## 🧪 Running Locally (Clarinet)

### Prerequisites:
- [Clarinet](https://docs.hiro.so/clarinet/get-started/installation)
- Node.js (for frontend, optional)

### Steps:

```bash
# Clone and enter project
git clone https://github.com/your-handle/certichain-clarity.git
cd certichain-clarity

# Build and test contracts
clarinet check
clarinet test

## 🔐 Security Notes
- Only verified issuers (via issuer-registry) can mint certificates.
- Certificates are soulbound — no transfer methods exposed.
- Use off-chain storage like IPFS for sensitive metadata and store hashes on-chain.

## 🧠 Future Plans
- DAO-based issuer onboarding via voting
- zk-SNARKs or Stacks-based privacy enhancements
- UI dashboard for certificate management and verification

## 📄 License
MIT License
# EinClaw × Solana — Hackathon Form Answers

> Draft answers for the Solana Frontier Hackathon submission form.
> Tone: crypto-native, meme-friendly, concrete.

---

## Q1. 简要介绍一下我们的项目 / What are you building, and who is it for?

EinClaw is a voice-first Solana agent — a 4G-connected hardware mic (and companion app) that turns spoken intent into onchain action. Press the button, say "send 0.1 SOL to vitalik.sol" or "dust that ngmi guy 0.0001 SOL with a memo", and the agent plans, confirms, and signs the transaction in seconds.

Who it's for: crypto-native users who already live onchain — traders, founders, degens, KOLs — but are tired of context-switching to Phantom every time they want to tip, transfer, settle a bet, or send a meme transaction. It's ambient crypto UX for people whose wallet is their daily driver, not a once-a-month tool.

The wedge: voice removes the 30-second tax of unlocking phone → opening wallet → pasting address → reviewing → signing. EinClaw collapses it to press → speak → confirm. Same security model (you still sign), 10x lower friction.

---

## Q2. Why did you decide to build this, and why build it now?

We built it because we kept catching ourselves in the same loop: idea hits, want to send SOL / tip a friend / settle a bet / dust someone for fun — and by the time the phone is unlocked, Phantom is open, the address is pasted, and the gas is reviewed, the moment is gone. Onchain is supposed to be instant, but the UX around it still feels like 2017. If your wallet is your daily driver, the daily friction adds up to hours a month.

Why now, three things converged in the last 12 months:

One — the AI layer finally works. Voice-to-structured-intent used to be a science project. With Qwen ASR Flash, Claude/GPT-class planners, and 400ms Solana finality, the full loop (speak → parse → plan → sign → confirm) lands in under 5 seconds. A year ago this was a demo. Today it's a product.

Two — Solana hit consumer-grade UX. Phantom mobile, Solana Pay reference keys, sub-cent fees, instant settlement. The rails are no longer the bottleneck — the input method is. We don't need a new chain; we need a new way to talk to it.

Three — hardware got cheap. ESP32-S3 + 4G module is ~60 RMB BOM. Voice-first wearables stopped being a Humane-style $700 moonshot and became a button you can ship at scale. EinClaw already has the hardware path; bolting Solana onto it is the natural next move.

The personal reason: we're crypto-native builders who got tired of waiting for someone else to fix this. The "AI pin" category failed because Humane and Rabbit tried to replace the phone. We're not replacing anything — we're giving the wallet a voice. Narrow scope, clear job, ship it.

---

## Q3. What technologies are you using or integrating with to build your product?

Hardware. EinClaw Mic — a 4G-connected wearable mic with a single button. Click once to start speaking, click again to send. That's the whole interaction. No screen, no voice reply, no per-transaction confirmation — within the scope the user has pre-authorized, the agent just executes.

Agent. The backend runs on OpenClaw, our agent harness (skills-based, tool-calling, the same shape as Claude Code's). ASR handles speech-to-text, then OpenClaw parses the transcript into a typed Solana intent and dispatches it to the right skill. Trust is established once at pairing time (per-skill spending caps, per-recipient allowlists, daily limits) — after that, voice goes straight to onchain action.

Solana stack today. @solana/web3.js for transaction construction, @solana/wallet-adapter with Phantom for the initial trust setup, and Solana Pay reference-key pattern for verifiable settlement — every action generates a unique reference pubkey so we can confirm the onchain result without a custom program. SystemProgram.transfer, SPL token transfers, and the Memo Program cover every demo we ship. SNS resolution for .sol names. Devnet today, mainnet path is identical.

Solana ecosystem skills (built or on the near roadmap). Because OpenClaw is skill-based, every Solana protocol becomes a one-skill add. Concretely we're integrating or planning:

- Jupiter — voice-driven swaps ("swap 1 SOL for JUP")
- Jito — bundle-aware sends for tip/MEV-sensitive flows
- Helius — webhook + enhanced tx parsing for reliable confirmations and balance queries
- Squads — multisig proposals by voice for team treasuries
- Tensor / Magic Eden — voice-driven floor sweeps and listings
- Pump.fun / Meteora — memecoin discovery and one-shot buys
- Marinade / Kamino — staking and lending in plain speech
- Bonfida / SNS — first-class .sol name resolution everywhere
- Drift / Mango — perps and risk queries by voice for active traders

Skipped on purpose for hackathon scope: custom Anchor programs, NFT minting, decentralized storage. Each shortcut has a one-line production path in the README.

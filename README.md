# KeeperKit

> **The TypeScript SDK + ElizaOS Plugin for KeeperHub Blockchain Automation**

KeeperKit solves a fundamental problem: developers had no ergonomic way to build on KeeperHub. Every integration required hand-rolling HTTP calls, writing custom retry logic, and managing error handling manually. We built KeeperKit to change that — a fully typed SDK, an AI-ready ElizaOS plugin, and a production consumer application proving it all works end-to-end.

---

## 🎯 What is KeeperHub?

KeeperHub is a blockchain automation protocol that enables you to build complex on-chain workflows. Think of it as the execution engine for decentralized finance: you design a directed graph of triggers, conditions, and actions, then KeeperHub handles the actual execution on-chain across multiple EVM-compatible chains.

**KeeperKit is your gateway to KeeperHub** — for developers building integrations, for AI agents executing autonomously, and for end users enjoying invisible abstraction layers.

---

## 🚀 Key Highlights

### For Developers

✅ **Fully Typed TypeScript SDK** — No more hand-rolling fetch calls. Import `KeeperKit`, authenticate, get typed methods.  
✅ **Automatic Retry Logic** — Failed GET requests retry with exponential backoff. Configurable for your use case.  
✅ **Semantic Error Handling** — HTTP errors map to TypeScript types (`NotFoundError`, `UnauthorizedError`, etc.).  
✅ **First-Class Pagination** — List operations support `page` and `limit`. No cursor parsing.  
✅ **Execution Polling** — Trigger a workflow and poll status/logs with built-in retry handling for natural indexing delays.  

### For AI Agents

✅ **ElizaOS Plugin** — 22 native actions + 3 context providers. Register once, get full KeeperHub access.  
✅ **Natural Language → On-Chain** — "Transfer 100 USDC" becomes a multi-step execution.  
✅ **x402 Payment Support** — Automatic handling of marketplace payment challenges.  

### For End Users  

✅ **Consumer Apps** — Build Keeper University-style applications on top of KeeperKit.  
✅ **Hidden Complexity** — Let users describe intent; the SDK handles the rest.  

---

## 📊 Architecture Overview

<img width="1408" height="768" alt="Workflow" src="https://github.com/user-attachments/assets/a2f5086b-1735-4e02-8f7d-982a8fcda963" />

---

## 📂 Repository Structure

```
KeeperKit/
├── SDK/                          # Main TypeScript SDK (v0.1.2)
│   ├── src/
│   │   ├── keeperkit.ts         # Main client class
│   │   ├── client/              # HTTP, auth, retry, errors
│   │   ├── modules/             # workflows, executions, chains, etc.
│   │   ├── helpers/             # Graph builders, validation
│   │   ├── models/              # TypeScript types
│   │   └── __tests__/           # 211 unit tests
│   ├── dist/                    # Built: CJS, ESM, .d.ts
│   └── package.json
│
├── plugin-elizaos/              # ElizaOS plugin (@keeperhub/plugin-keeperkit)
│   ├── src/
│   │   ├── index.ts            # Plugin entry + action exports
│   │   ├── services/           # KeeperKit client setup
│   │   ├── actions/            # 22 action handlers (organized by domain)
│   │   ├── providers/          # 3 context providers (dynamic injection)
│   │   ├── evaluators/         # Action evaluation logic
│   │   └── types/              # Plugin-specific interfaces
│   ├── __tests__/              # Plugin unit tests
│   └── package.json
│
├── frontend/                     # Local Gemini-powered chat agent
│   ├── server.js               # HTTP server (intent → SDK calls)
│   ├── characters/
│   │   └── keeper-agent.json   # LLM system prompt + settings
│   ├── elizaos.config.ts       # ElizaOS configuration
│   ├── public/
│   │   ├── app.js              # Chat UI client code
│   │   ├── index.html          # Chat interface
│   │   └── styles.css          # Styling
│   ├── .env                    # Environment config (not committed)
│   └── package.json
│
├── stitch_keeperhub_academic_defi_workflows/  # Consumer app: Keeper University
│   ├── index.html              # Landing page (hero + features)
│   ├── dashboard.html          # Execution dashboard
│   ├── chat.html               # AI Workflow Builder (hard-coded + live)
│   ├── app.js                  # Application logic
│   ├── app.css                 # Full design system
│   ├── assistant.js            # Agent bridge
│   └── academic_precision/
│       └── DESIGN.md           # Design documentation
│
├── docs/                        # Developer documentation
│   └── docs_mdfiles/
│       ├── README.md           # Docs index
│       ├── QUICKSTART.md       # Get running in 5 minutes
│       ├── API.md              # SDK module reference
│       ├── PROTOCOL.md         # End-to-end protocol flow
│       ├── ENVIRONMENT.md      # Configuration variables
│       └── DESIGN.md           # Design tokens
│
├── docs_frontend/              # Multi-page HTML docs site
│   ├── index.html              # Overview
│   ├── getting-started.html    # Onboarding
│   ├── sdk.html                # SDK surface
│   ├── workflows.html          # Workflow graph API
│   ├── executions.html         # Status polling & logs
│   ├── direct-execute.html     # One-off on-chain operations
│   ├── ecosystem.html          # Chains, integrations, marketplace
│   ├── protocol.html           # Flow diagrams
│   ├── troubleshooting.html    # Common issues
│   └── scripts.js              # Navigation & interactivity
│
├── AGENTS.md                   # Autonomous agent guide
├── demo_script.html            # 5-minute demo video script (ETHGlobal)
├── LICENSE
├── package.json                # Monorepo root (pnpm workspaces)
└── pnpm-workspace.yaml
```

---

## 🎬 ETHGlobal Submission

This project addresses **two focus areas simultaneously**:

**Focus Area 2: Integration Bridge**  
→ KeeperKit SDK + `@keeperhub/plugin-keeperkit` give every TypeScript developer and ElizaOS agent first-class programmatic access to KeeperHub.

**Focus Area 1: Consumer Application**  
→ Keeper University — a complete academic DeFi payment platform proving the SDK works end-to-end in production.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (native `fetch` required)
- **pnpm** (or npm)
- **KeeperHub API Key** — get one at [app.keeperhub.com](https://app.keeperhub.com) → Settings → API Keys

### 1. Clone & Install

```bash
git clone https://github.com/PhAnToMxSD/KeeperKit.git
cd KeeperKit
pnpm install
```

### 2. Configure Environment

Create `frontend/.env`:

```env
KEEPERHUB_API_KEY=kh_your_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
KEEPERHUB_BASE_URL=https://app.keeperhub.com/api
SERVER_PORT=3000
```

### 3. Build & Run

```bash
# Build the SDK (required first)
pnpm build:sdk

# Start the frontend agent
cd frontend
pnpm run dev
```

Visit **http://localhost:3000** in your browser. Try these commands:

- `"List my workflows"`
- `"Execute workflow Savings Vault Performance Tracker"`
- `"What chains are supported?"`
- `"Transfer 100 USDC to 0xRecipient on Base"`

---

## 📚 SDK Usage

### Initialize

```typescript
import { KeeperKit } from "keeperkit";

const client = new KeeperKit({
  apiKey: process.env.KEEPERHUB_API_KEY,  // must start with kh_
});
```

### List & Execute Workflows

```typescript
const workflows = await client.workflows.list();

const executionId = await client.workflows.execute("wf_abc123");
const status = await client.executions.getStatus(executionId);
```

### Create Workflows with Graph Builders

```typescript
import { 
  createTriggerNode, 
  createActionNode, 
  createEdge,
  validateWorkflowGraph 
} from "keeperkit";

const workflow = await client.workflows.create({
  name: "Fee Collection",
  nodes: [
    createTriggerNode({ id: "t1", triggerType: "schedule", ... }),
    createActionNode({ id: "a1", actionType: "uniswap-swap", ... }),
  ],
  edges: [createEdge({ source: "t1", target: "a1" })],
  enabled: true,
});
```

### Direct On-Chain Operations

```typescript
// No workflow needed — execute immediately
const transfer = await client.directExecute.transfer({
  chainId: 8453,
  to: "0xRecipient",
  amount: "1000000",
  tokenAddress: "0xUSDC_on_base",
});
```

### Marketplace with x402 Payments

```typescript
const result = await client.listedWorkflows.call("yield-optimizer", {
  address: "0xUserAddress",
});

if ("paymentRequired" in result) {
  console.log("Price:", result.paymentRequired.priceUsdcPerCall, "USDC");
  // Auto-pays via agent wallet if available
}
```

### Error Handling

```typescript
import { NotFoundError, AuthError, KeeperKitError } from "keeperkit";

try {
  await client.workflows.get("wf_invalid");
} catch (err) {
  if (err instanceof NotFoundError) {
    console.error("Workflow not found");
  } else if (err instanceof AuthError) {
    console.error("Invalid API key");
  }
}
```

---

## 🤖 ElizaOS Plugin

### Installation

```bash
npm install @keeperhub/plugin-keeperkit
```

### Configuration

```typescript
import { keeperKitPlugin } from '@keeperhub/plugin-keeperkit';

const agent = {
  plugins: [keeperKitPlugin],
  settings: {
    KEEPERHUB_API_KEY: process.env.KEEPERHUB_API_KEY,
  },
};
```

### 22 Built-in Actions

**Workflows** — List, get, create, update, delete, enable, disable (7)  
**Executions** — Trigger, status, history, logs, wait (5)  
**Direct Execute** — Token transfer, contract call, conditional execution (3)  
**Marketplace** — Search, call with x402 support (2)  
**Integrations** — List, create, delete (3)  
**Chains & Schemas** — List chains, fetch ABI, discover MCP schemas (3)  

### Example Prompts

```
"List all my active workflows"
"Execute the balance monitor workflow"
"Transfer 100 USDC to 0xAddr on Base"
"What chains does KeeperHub support?"
"Call the yield-optimizer from the marketplace"
```

---

## 🏫 Consumer App: Keeper University

**Keeper University** is a real, production-ready application built entirely on KeeperKit. It demonstrates how to hide blockchain complexity and surface intent-based workflows to end users.

### The Problem

Students have crypto scattered across:
- 🪙 MetaMask, Phantom, Ledger wallets
- 📊 Aave, Uniswap positions  
- 🏦 Coinbase, Kraken accounts
- 💰 Staked SOL, delegated assets

Universities need to split incoming tuition across:
- 🏨 Hostel fees (35%)
- 🎓 Lecture halls (20%)
- 🍽️ Dining (18%)
- 🔬 Labs (12%)
- 👥 Student services (10%)
- 🆘 Emergency reserve (5%)

**Neither party can do this easily without complex code.**

### Solution

**Keeper University uses KeeperKit to:**

1. **Student Fee Collection** — Aggregate crypto from multiple sources into tuition payment
2. **University Fund Distribution** — Auto-split payments across departments
3. **Scholarship & Refund Routing** — Conditional payouts with audit trails
4. **AI Workflow Builder** — Natural language: *"Collect my Aave position and pay tuition"* → Automatic execution

### How It Works

```
User types:
"Collect my ETH from Aave and pay my Fall semester fee"
                    ↓
          Keeper Agent (Gemini)
                    ↓
        KeeperKit SDK resolves:
    - Find Aave position (Lending Pool ABI)
    - Withdraw ETH
    - Swap ETH → USDC
    - Bridge to destination chain
    - Send to university account
                    ↓
        KeeperHub executes on-chain
                    ↓
    User sees: "✅ Tuition paid! Execution ID: exec_001"
```

### Pages

- **index.html** — Landing page with hero, features, SDK code sample
- **dashboard.html** — Metrics ($4.2M processed, 142 workflows), transaction history
- **chat.html** — AI Workflow Builder with 4 hard-coded examples + live chat

### Run Keeper University

```bash
# No build step — plain HTML/CSS/JS
python3 -m http.server 8124 --directory stitch_keeperhub_academic_defi_workflows
# → http://localhost:8124

# For live AI chat, also run the agent:
# cd frontend && pnpm run dev
```

---

## 📖 Documentation

### Developer Docs (Static HTML)

```bash
python3 -m http.server 8123 --directory docs_frontend
# → http://localhost:8123
```

9 comprehensive pages covering:
- Protocol flow diagrams
- Onboarding (3-step quickstart)
- Full SDK surface  
- Workflow graph API
- Execution polling
- Direct on-chain operations
- Chains, integrations, marketplace
- Troubleshooting & common errors

### Markdown Docs

- [QUICKSTART.md](docs/docs_mdfiles/QUICKSTART.md) — Get running in 5 minutes
- [API.md](docs/docs_mdfiles/API.md) — SDK module reference
- [PROTOCOL.md](docs/docs_mdfiles/PROTOCOL.md) — End-to-end flow
- [ENVIRONMENT.md](docs/docs_mdfiles/ENVIRONMENT.md) — Configuration

### Agent Guide

[AGENTS.md](AGENTS.md) — Complete guide for autonomous agents or developers modifying the system. Covers architecture, commands, workflows, and gotchas.

---

## 🛠️ Development

### Build All Packages

```bash
pnpm build              # entire workspace
pnpm build:sdk          # SDK only
pnpm build:plugin       # plugin only (SDK must be built first)
```

### Run Tests

```bash
pnpm test               # all packages
pnpm test:sdk           # SDK: 211 tests
pnpm test:plugin        # Plugin tests
pnpm type-check         # TypeScript validation
```

### Development Workflow

1. **Edit SDK** in `SDK/src/`
2. **Rebuild**: `pnpm build:sdk`
3. **Restart frontend**: `cd frontend && pnpm run dev`
4. **Smoke test**:

```bash
curl -s http://localhost:3000/api/agents/keeper-agent/message \
  -H 'Content-Type: application/json' \
  -d '{"text":"List my workflows","userId":"user","roomId":"keeperchat"}'
```

---

## 🧪 Testing

### SDK Tests (211 tests, 20 files)

```bash
cd SDK
pnpm test
```

Coverage includes:
- HTTP client, retries, error mapping
- Auth & token handling
- Each API module
- Helper functions
- TypeScript types

### Plugin Tests

```bash
cd plugin-elizaos
pnpm test
```

Coverage includes:
- Action evaluation & execution
- Service initialization
- Provider context injection
- x402 payment flow

---

## 🔑 Key Implementation Details

### Execution Status 404 Handling

KeeperHub's API sometimes takes a few seconds to index execution records. The SDK handles this gracefully:

```typescript
// Automatically retries on 404 for a short window
const status = await client.executions.getStatus(executionId);
// If still missing, returns "accepted/running" state
```

### Typed Errors

Every HTTP error maps to a semantic TypeScript type:

```typescript
try {
  await client.workflows.get("wf_missing");
} catch (error) {
  if (error instanceof NotFoundError) { /* 404 */ }
  if (error instanceof AuthError) { /* 401/403 */ }
  if (error instanceof RateLimitError) { /* 429 */ }
  if (error instanceof PaymentRequiredError) { /* 402 */ }
}
```

### Pagination

All list operations support pagination:

```typescript
const page1 = await client.workflows.list({ page: 1, limit: 20 });
const page2 = await client.workflows.list({ page: 2, limit: 20 });
```

### Configurable Retries

```typescript
const client = new KeeperKit({
  apiKey: "kh_...",
  retry: {
    maxAttempts: 5,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
    retryWrites: false,  // set true for POST/PATCH/DELETE
  },
});
```

---

## 📦 Packages

| Package | Version | NPM |
|---------|---------|-----|
| `keeperkit` | 0.1.2 | [@npm](https://www.npmjs.com/package/keeperkit) |
| `@keeperhub/plugin-keeperkit` | 0.1.0 | [@npm](https://www.npmjs.com/package/@keeperhub/plugin-keeperkit) |

All packages exported as ESM + CJS with full TypeScript definitions.

---

## 🎯 Getting Started Checklist

- [ ] Clone: `git clone https://github.com/PhAnToMxSD/KeeperKit.git`
- [ ] Install: `pnpm install`
- [ ] Configure: Create `frontend/.env` with API keys
- [ ] Build: `pnpm build:sdk`
- [ ] Run: `cd frontend && pnpm run dev`
- [ ] Test: Visit `http://localhost:3000`
- [ ] Read: [PROTOCOL.md](docs/docs_mdfiles/PROTOCOL.md) for internals

---

## 🤝 Contributing

Contributions are welcome! Areas to explore:

- **New API modules** — Extend `SDK/src/modules/`
- **Plugin actions** — Add handlers in `plugin-elizaos/src/actions/`
- **Consumer apps** — Build new applications on KeeperKit
- **Documentation** — Improve guides and tutorials

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 👥 Credits

Built with ❤️ for **ETHGlobal Hackathon** by **PhAnToMxSD**, **Tathagat98** and **Okheer**.

**KeeperHub API Reference:** [docs.keeperhub.com](https://docs.keeperhub.com)  
**ElizaOS Framework:** [elizaos.ai](https://elizaos.ai)

---

**Last Updated:** May 2026  
**Status:** Production Ready ✅

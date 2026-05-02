# KeeperKit
KeeperKit is a TypeScript SDK for the [KeeperHub](https://keeperhub.com) blockchain automation protocol. It gives developers a typed, ergonomic interface for managing workflows, triggering executions, querying chains, and connecting integrations — all without hand-rolling HTTP calls against the raw API.

**Features:**
- 🎯 **Type-safe API** — Full TypeScript support with comprehensive type definitions
- 🚀 **Two API styles** — Flat API for common operations + namespaced API for advanced use cases
- 🔄 **Workflow Management** — Create, update, enable/disable, and monitor workflows
- ⚡ **Direct Execution** — One-off on-chain operations (transfers, contract calls, conditional execution)
- 💰 **Marketplace Integration** — Search and call listed workflows with x402 payment support
- 🔗 **Multi-chain** — Support for 50+ EVM-compatible chains
- 🛡️ **Error Handling** — Comprehensive error types with structured information
- 📦 **ElizaOS Plugin** — AI agent integration via `@keeperhub/plugin-keeperkit`

## Repository Structure

This monorepo contains two independent packages:

| Package | Path | Description |
|---------|------|-------------|
| `developer documentation` | `docs_frontend` | The web documentation of the KeeperKit |
| `keeperkit` | `./SDK/` | Platform-agnostic TypeScript SDK for KeeperHub |
| `@keeperhub/plugin-keeperkit` | `./plugin-elizaos/` | ElizaOS plugin wrapping the SDK for AI agents |

---

## Quick Start

### Clone the Repository

```bash
git clone https://github.com/KeeperHub/KeeperKit.git
cd KeeperKit
```

### Install Dependencies

```bash
pnpm install
```

### Build the Project

```bash
pnpm build
```

This produces:
- `SDK/dist/index.js` (CommonJS)
- `SDK/dist/index.mjs` (ESM)
- `SDK/dist/index.d.ts` (TypeScript declarations)

### For Node.js/TypeScript Projects

```typescript
import { KeeperKit } from "keeperkit";

const client = new KeeperKit({
  apiKey: process.env.KEEPERHUB_API_KEY,
});

// List workflows
const workflows = await client.listWorkflows();

// Execute a workflow
const { executionId } = await client.executeWorkflow(workflows[0].id);

// Wait for completion
const result = await client.waitForExecution(workflows[0].id, executionId);
console.log("Status:", result.status);
```

### For ElizaOS Agents

```typescript
import { keeperKitPlugin } from '@keeperhub/plugin-keeperkit';

// Register in your ElizaOS agent configuration
const agent = {
  plugins: [keeperKitPlugin],
  settings: {
    KEEPERHUB_API_KEY: process.env.KEEPERHUB_API_KEY,
  },
};

// Agents now have 22 built-in KeeperHub actions
```
---

## Initialization

Create a client instance by passing your API key. All API keys start with the `kh_` prefix.

```typescript
import { KeeperKit } from "keeperkit";

const client = new KeeperKit({
  apiKey: process.env.KEEPERHUB_API_KEY,
});
```

The client connects to `https://app.keeperhub.com/api` by default. You can override this for local development or staging environments:

```typescript
const client = new KeeperKit({
  apiKey: "kh_test_your_key_here",
  baseUrl: "http://localhost:3000/api",
  timeout: 15000, // request timeout in ms (default: 30000)
});
```

### Retry Configuration

The SDK automatically retries failed GET requests with exponential backoff. You can customize this behavior:

```typescript
const client = new KeeperKit({
  apiKey: process.env.KEEPERHUB_API_KEY,
  retry: {
    maxAttempts: 3,       // default: 5
    baseDelayMs: 500,     // default: 1000
    maxDelayMs: 10000,    // default: 30000
    retryWrites: false,   // set true to retry POST/PATCH/DELETE too
  },
});
```

---

## API Reference

### Workflows

Workflows are the core building blocks of KeeperHub. Each workflow is a directed graph of trigger, action, and condition nodes connected by edges.

### List Workflows

```typescript
const workflows = await client.listWorkflows();

// With pagination
const page2 = await client.listWorkflows({ page: 2, limit: 10 });
```

### Get a Single Workflow

```typescript
const workflow = await client.getWorkflow("wf_abc123");
console.log(workflow.name, workflow.enabled);
```

### Create a Workflow

A workflow definition requires a name, an array of nodes, and an array of edges connecting them. Here is a complete example that creates a workflow to monitor a wallet balance on Sepolia and send a Discord notification:

```typescript
import {
  KeeperKit,
  createTriggerNode,
  createActionNode,
  createConditionNode,
  createEdge,
  createConditionEdges,
  templateRef,
} from "keeperkit";

const client = new KeeperKit({ apiKey: process.env.KEEPERHUB_API_KEY });

// Step 1: Define the nodes

const trigger = createTriggerNode({
  id: "trigger_1",
  label: "Every 5 Minutes",
  triggerType: "schedule",
  config: { interval: "*/5 * * * *" },
});

const checkBalance = createActionNode({
  id: "check_balance",
  label: "Check Wallet Balance",
  actionType: "wallet-balance",
  config: {
    chainId: 11155111, // Sepolia
    address: "0xYourWalletAddress",
  },
  position: { x: 250, y: 150 },
});

const condition = createConditionNode({
  id: "balance_check",
  label: "Balance Below Threshold",
  expression: `${templateRef("check_balance", "Check Wallet Balance", "result.balance")} < 0.1`,
  position: { x: 250, y: 300 },
});

const notifyDiscord = createActionNode({
  id: "discord_notify",
  label: "Send Discord Alert",
  actionType: "discord-send-message",
  config: {
    channelId: "123456789",
    message: `Low balance alert: ${templateRef("check_balance", "Check Wallet Balance", "result.balance")} ETH remaining`,
  },
  position: { x: 100, y: 450 },
});

const noOp = createActionNode({
  id: "no_action",
  label: "Balance OK",
  actionType: "no-op",
  position: { x: 400, y: 450 },
});

// Step 2: Connect nodes with edges

const edges = [
  createEdge({ source: "trigger_1", target: "check_balance" }),
  createEdge({ source: "check_balance", target: "balance_check" }),
  ...createConditionEdges("balance_check", "discord_notify", "no_action"),
];

// Step 3: Submit to KeeperHub

const workflow = await client.createWorkflow({
  name: "Sepolia Balance Monitor",
  description: "Alerts when wallet balance drops below 0.1 ETH",
  nodes: [trigger, checkBalance, condition, notifyDiscord, noOp],
  edges,
  enabled: true,
});

console.log("Created workflow:", workflow.id);
```

### Update a Workflow

```typescript
const updated = await client.updateWorkflow("wf_abc123", {
  name: "Updated Balance Monitor",
  enabled: false,
});
```

### Enable and Disable

```typescript
await client.enableWorkflow("wf_abc123");
await client.disableWorkflow("wf_abc123");
```

### Delete a Workflow

```typescript
await client.deleteWorkflow("wf_abc123");
```

---

## Executions

Once a workflow exists, you can trigger it manually and monitor its progress.

### Trigger a Workflow

```typescript
const { executionId } = await client.executeWorkflow("wf_abc123");
console.log("Execution started:", executionId);
```

### Wait for Completion

The `waitForExecution` method polls the execution status until it reaches a terminal state (`success`, `error`, or `cancelled`):

```typescript
const result = await client.waitForExecution("wf_abc123", executionId, {
  timeoutMs: 60000,      // max wait time (default: 5 minutes)
  pollIntervalMs: 2000,  // poll frequency (default: 2 seconds)
});

console.log(result.status);  // "success" | "error" | "cancelled"
console.log(result.output);  // workflow output data
```

### Get Execution Details

```typescript
const execution = await client.getExecution("wf_abc123", executionId);
console.log(execution.completedSteps, "/", execution.totalSteps);
```

### List Execution History

```typescript
const history = await client.listExecutions("wf_abc123", {
  page: 1,
  limit: 20,
});
```

### Execution Logs (Namespaced API)

For per-node execution logs, use the namespaced `executions` module:

```typescript
const logs = await client.executions.getLogs(executionId);
for (const log of logs) {
  console.log(`${log.nodeName} (${log.nodeType}): ${log.status}`);
  if (log.error) console.error("  Error:", log.error);
}
```

---

## Chains

KeeperHub supports multiple EVM-compatible chains. You can query the supported chains programmatically:

```typescript
const chains = await client.listChains();

for (const chain of chains) {
  console.log(`${chain.name} (Chain ID: ${chain.chainId})`);
}
```

Each chain object includes `id`, `name`, `chainId` (the EVM chain ID), `rpcUrl`, `explorerUrl`, `nativeCurrency`, and whether it is a `testnet`.

### Fetch a Contract ABI

The SDK can fetch and resolve ABIs for verified contracts, including automatic proxy resolution (EIP-1967, EIP-1822):

```typescript
const abi = await client.chains.getAbi(1, "0xContractAddress");
```

---

## Integrations

Integrations represent stored credentials and connections (wallets, DeFi protocols, notification services). Workflows reference integrations by ID to authenticate with external services.

### List Integrations

```typescript
const integrations = await client.listIntegrations();
```

### Create an Integration

```typescript
const integration = await client.createIntegration({
  name: "My Safe Wallet",
  type: "safe",
  config: {
    chainId: 1,
    safeAddress: "0xYourSafeAddress",
  },
});
```

Supported integration types include: `web3`, `safe`, `aave-v3`, `morpho`, `uniswap`, `aerodrome`, `compound-v3`, `cow-swap`, `curve`, `lido`, `pendle`, `discord`, `telegram`, `slack`, `sendgrid`, `webhook`, and more.

### Delete an Integration

```typescript
await client.deleteIntegration(integration.id);
```

---

## Direct Execution

For one-off on-chain operations that do not need a full workflow, the SDK provides direct execution methods through the namespaced `directExecute` module.

### Token Transfer

```typescript
const transfer = await client.directExecute.transfer({
  chainId: 8453, // Base
  to: "0xRecipientAddress",
  amount: "1000000", // in smallest token unit
  tokenAddress: "0xTokenAddress", // omit for native currency
});

const result = await client.directExecute.waitForCompletion(transfer.id);
console.log("Transaction hash:", result.transactionHash);
```

### Smart Contract Call

```typescript
const call = await client.directExecute.contractCall({
  chainId: 1,
  contractAddress: "0xContractAddress",
  functionName: "approve",
  abi: [/* ABI array */],
  args: ["0xSpender", "1000000000000000000"],
});
```

### Check-and-Execute

Read a value on-chain, evaluate a condition, and execute a write call only if the condition is met:

```typescript
const result = await client.directExecute.checkAndExecute({
  chainId: 1,
  check: {
    contractAddress: "0xTokenAddress",
    functionName: "balanceOf",
    abi: [/* ABI */],
    args: ["0xYourAddress"],
  },
  condition: {
    operator: "gt",
    value: "1000000000000000000", // 1 token
  },
  execute: {
    contractAddress: "0xTokenAddress",
    functionName: "transfer",
    abi: [/* ABI */],
    args: ["0xRecipient", "500000000000000000"],
  },
});
```

---

## Listed Workflows (Marketplace)

KeeperHub has a marketplace of publicly listed workflows that you can search and invoke. These are accessed through the namespaced `listedWorkflows` module.

### Search the Marketplace

```typescript
const listed = await client.listedWorkflows.search({
  query: "balance monitor",
  category: "defi",
  chain: "ethereum",
});
```

### Call a Listed Workflow

```typescript
const result = await client.listedWorkflows.call("balance-check-slug", {
  address: "0xWalletAddress",
  chainId: 1,
});

if ("paymentRequired" in result) {
  // Workflow requires payment -- result.paymentRequired contains the challenge
  console.log("Price:", result.paymentRequired.priceUsdcPerCall, "USDC");
} else {
  console.log("Result:", result.data);
}
```

---

## MCP Schema Discovery

The SDK provides access to the complete schema of all available actions, triggers, and chains through the MCP schemas endpoint. This is useful for building dynamic UIs or validating workflow configurations:

```typescript
const schemas = await client.mcpSchemas.get();

console.log("Available actions:", schemas.actions.length);
console.log("Available triggers:", schemas.triggers.length);
console.log("Supported chains:", schemas.chains.length);

// Inspect a specific action's config fields
const aaveAction = schemas.actions.find((a) => a.pluginId === "aave-v3");
if (aaveAction) {
  for (const field of aaveAction.configFields) {
    console.log(`  ${field.key} (${field.type}): ${field.description}`);
  }
}
```

---

## Helper Utilities

The SDK ships with helper functions for building workflow graphs programmatically.

### Node Builders

```typescript
import {
  createTriggerNode,
  createActionNode,
  createConditionNode,
} from "keeperkit";

const trigger = createTriggerNode({
  label: "On New Block",
  triggerType: "block",
  config: { chainId: 1 },
});

const action = createActionNode({
  label: "Swap Tokens",
  actionType: "uniswap-swap",
  pluginId: "uniswap",
  config: { tokenIn: "WETH", tokenOut: "USDC" },
});

const condition = createConditionNode({
  label: "Price Above Threshold",
  expression: "result.price > 2000",
});
```

### Edge Builders

```typescript
import { createEdge, createConditionEdges } from "keeperkit";

// Simple edge
const edge = createEdge({ source: trigger.id, target: action.id });

// Condition branches (true path and false path)
const [trueEdge, falseEdge] = createConditionEdges(
  condition.id,
  "action_if_true",
  "action_if_false",
);
```

### Template References

Nodes can reference outputs from previous nodes using template strings. The `templateRef` helper builds these references:

```typescript
import { templateRef } from "keeperkit";

const ref = templateRef("node_1", "Check Balance", "result.balance");
// Produces: "{{@node_1:Check Balance.result.balance}}"
```

You can also parse and extract template references:

```typescript
import { parseTemplateRef, extractTemplateRefs, hasTemplateRefs } from "keeperkit";

const parsed = parseTemplateRef("{{@node_1:Check Balance.result.balance}}");
// { nodeId: "node_1", label: "Check Balance", field: "result.balance" }

const allRefs = extractTemplateRefs("Balance is {{@n1:A.x}} and price is {{@n2:B.y}}");
// Returns an array of ParsedTemplateRef objects

const containsRefs = hasTemplateRefs("some text {{@node:Label.field}}");
// true
```

### Workflow Validation

Before submitting a workflow to the API, you can validate its graph structure locally:

```typescript
import { validateWorkflowGraph, validateNodeConfig } from "keeperkit";

const result = validateWorkflowGraph(nodes, edges);
if (!result.valid) {
  for (const error of result.errors) {
    console.error(`${error.nodeId ?? error.edgeId}: ${error.message}`);
  }
}

// Validate required fields on a specific node
const nodeResult = validateNodeConfig(actionNode, ["chainId", "address"]);
```

The validator checks for: missing triggers, orphan nodes, self-loops, dangling edge references, and missing condition branch edges.

---

## Error Handling

All SDK errors extend `KeeperKitError`, which carries structured information about what went wrong:

```typescript
import { KeeperKit, KeeperKitError } from "keeperkit";

try {
  await client.getWorkflow("nonexistent-id");
} catch (err) {
  if (err instanceof KeeperKitError) {
    console.error("Status:", err.status);    // HTTP status code (e.g. 404)
    console.error("Code:", err.code);        // machine-readable code (e.g. "NOT_FOUND")
    console.error("Message:", err.message);  // human-readable description
    console.error("Retryable:", err.isRetryable);
    console.error("Body:", err.body);        // raw response body
  }
}
```

The SDK maps HTTP responses to specific error subclasses:

| Status | Error Class | Code |
|:------:|:------------|:-----|
| 400 | `ValidationError` | `VALIDATION_ERROR` |
| 401, 403 | `AuthError` | `AUTH_ERROR` |
| 402 | `PaymentRequiredError` | `PAYMENT_REQUIRED` |
| 404 | `NotFoundError` | `NOT_FOUND` |
| 422 | `SpendingCapError` | `SPENDING_CAP_EXCEEDED` |
| 429 | `RateLimitError` | `RATE_LIMIT_EXCEEDED` |
| 5xx | `ServerError` | `SERVER_ERROR` |
| Timeout | `KeeperKitError` | `TIMEOUT` |
| Network failure | `KeeperKitError` | `NETWORK_ERROR` |

All error subclasses can be imported individually for precise `instanceof` checks.

---

## Type Exports

The SDK exports all public types for use in your TypeScript code. Key types include:

```typescript
import type {
  // Workflows
  Workflow,
  WorkflowDefinition,   // alias for CreateWorkflowInput
  WorkflowNode,
  WorkflowEdge,
  TriggerConfig,
  ActionConfig,
  ConditionConfig,
  CreateWorkflowInput,
  UpdateWorkflowInput,

  // Executions
  Execution,            // alias for WorkflowExecution
  WorkflowExecution,
  NodeResult,           // alias for ExecutionLog
  ExecutionLog,
  ExecutionProgress,

  // Direct Execution
  DirectExecution,
  TransferInput,
  ContractCallInput,
  CheckAndExecuteInput,

  // Integrations
  Integration,
  CreateIntegrationInput,

  // Chains and Schemas
  Chain,
  McpSchemaResponse,
  McpSchemaAction,
  McpSchemaTrigger,

  // Pagination
  PaginatedResponse,
} from "keeperkit";
```

---

## API Styles

The SDK offers two API styles. You can use whichever fits your preference:

### Flat API (recommended for most use cases)

```typescript
import { KeeperKit } from "keeperkit";

const client = new KeeperKit({ apiKey: "kh_..." });
const workflows = await client.listWorkflows();
const { executionId } = await client.executeWorkflow(workflows[0].id);
```

### Namespaced API (full access to all methods)

```typescript
import { createKeeperHubClient } from "keeperkit";

const client = createKeeperHubClient({ apiKey: "kh_..." });
const workflows = await client.workflows.list({ projectId: "proj_1" });
const logs = await client.executions.getLogs("exec_123");
const abi = await client.chains.getAbi(1, "0xContractAddress");
```

The flat API on `KeeperKit` covers the most common operations. The namespaced modules (accessible as `client.workflows`, `client.executions`, `client.directExecute`, etc.) expose additional methods like `workflows.duplicate()`, `workflows.goLive()`, `executions.cancel()`, `integrations.test()`, and more.

---

## Development Setup

### Running Tests

The SDK has 211 tests across 20 test files covering the client, modules, helpers, models, and integration scenarios:

```bash
cd SDK
pnpm test
```

### Type Checking

```bash
pnpm type-check
```

### Building

```bash
pnpm build
```

The build produces CommonJS (`dist/index.js`), ESM (`dist/index.mjs`), and TypeScript declarations (`dist/index.d.ts`).

---

## Support & Resources

- **Documentation**: [docs.keeperhub.com](https://docs.keeperhub.com)
- **Dashboard**: [app.keeperhub.com](https://app.keeperhub.com)
- **Issues**: [GitHub Issues](https://github.com/KeeperHub/KeeperKit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/KeeperHub/KeeperKit/discussions)

---

## Contributing

We welcome contributions! Please read our [contributing guidelines](./CONTRIBUTING.md) before submitting PRs.

### Development Workflow

```bash
# Clone and install
git clone https://github.com/KeeperHub/KeeperKit.git
cd KeeperKit
pnpm install

# Build both packages
pnpm build

# Run all tests
pnpm test

# Type-check everything
pnpm type-check
```

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

## Authors

**KeeperKit** is developed and maintained by [Aradhya Agrawal](https://github.com/PhAnToMxSD) and the KeeperHub community.

# KeeperKit Docs Frontend

This folder contains a static, multi-page documentation site for the KeeperKit SDK.

The site is intentionally independent from the runtime app in `frontend/`. It documents the `SDK/` package only, so developers can understand the SDK surface, protocol flow, and how to integrate it into their own TypeScript or Node.js projects.

## Clone the repository

To work with the KeeperHub SDK, start by cloning the source repository:

```bash
git clone https://github.com/PhAnToMxSD/KeeperKit
cd KeeperKit/SDK
pnpm install
pnpm build
```

This keeps the docs site separate while giving you the SDK source to build, inspect, and import into your own project.

## Pages

- `index.html` - Landing page and product overview
- `protocol.html` - End-to-end protocol flow
- `getting-started.html` - Install, build, and initialize the client
- `sdk.html` - Core client, auth, transport, and export surface
- `workflows.html` - Workflow graph API and helpers
- `executions.html` - Execution status, logs, and polling
- `direct-execute.html` - One-off on-chain operations
- `ecosystem.html` - Chains, integrations, marketplace, schemas, and helpers
- `troubleshooting.html` - Errors, common issues, and developer commands

## Local Preview

```bash
# from the repository root
python3 -m http.server 8123 --directory docs_frontend
```

Then open `http://localhost:8123/index.html` in your browser.

If you prefer a different port, make sure it is free and point the `--directory` flag at `docs_frontend` so the server does not fall back to another folder.

There is no build step. The site is plain HTML, CSS, and JavaScript.

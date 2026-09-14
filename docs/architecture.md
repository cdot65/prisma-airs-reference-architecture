---
id: architecture
title: "System architecture"
sidebar_label: "System architecture"
---

## Both paths traverse AI Gateway

Prisma AIRS Harness must use Prisma AIRS AI Gateway as the destination for both inference and remote MCP traffic. Its built-in Codex MCP client connects to the gateway's MCP listener. The gateway connects to upstream MCP servers. A direct connection from the harness to an upstream server does not meet this contract.

The gateway has separate inference and MCP listeners. Its development and production MCP integrations proxy the read-only Prisma AIRS MCP service. Both upstream deployments accept only their dedicated gateway OAuth client. The service remains a remote application; no secondary local MCP executable is required. Exact package and lifecycle acceptance is tracked in [Implementation status and public sources](./evidence.md).

```mermaid
flowchart LR
    accTitle: Inference and MCP both traverse AI Gateway
    accDescr: Inside airs-harness, the agent sends inference to the gateway inference listener and the native MCP client sends tool calls to the gateway MCP proxy. Only the gateway connects to upstream models and MCP servers. The gateway owns upstream MCP OAuth.
    subgraph workstation ["User workstation"]
        user["Alex"]
        subgraph harness ["airs-harness"]
            agent["Codex agent"]
            client["Native MCP client"]
        end
        user --> agent
        agent <-->|"Tool dispatch and results"| client
    end
    subgraph gateway ["Prisma AIRS AI Gateway"]
        inference["Inference listener"]
        mcp["MCP proxy listener"]
    end
    model["Upstream model"]
    upstream["Upstream MCP servers"]
    agent -->|"Inference credential"| inference
    client -->|"Gateway MCP token"| mcp
    inference <-->|"Model requests and responses"| model
    mcp <-->|"Gateway-owned upstream OAuth"| upstream
```

Inference and MCP may use different hostnames or ports belonging to the same gateway deployment. Sharing the gateway does not require sharing a token: each listener validates the credential and permissions configured for that resource. Workspace API authentication is an alternative inference mode; a workspace API key is not a Keycloak JWT.

The model proposes a tool call through the inference path. The harness dispatches the actual MCP call to the gateway MCP listener. The gateway applies its MCP controls and proxies to the registered upstream. Results return through the gateway to the harness and enter the next inference request. The tool-schema compatibility adapter affects inference serialization; it does not proxy MCP traffic.

## Authentication has two legs

| Leg | Responsibility | Credential location |
| --- | --- | --- |
| Harness → AI Gateway | Authenticate and authorize the human for gateway resources | Harness native store holds gateway-facing credentials |
| AI Gateway → upstream MCP | Complete the configured upstream OAuth flow and renew upstream tokens | Gateway-managed upstream credential storage |

The vendor calls CAS the gateway-facing OAuth authentication method in SCM deployments. CAS federates to the organization's IdP and resolves a provisioned user. Separately, the gateway's upstream OAuth integration handles consent and tokens for an external MCP server. These are both part of the gateway-mediated experience; they must not be collapsed into a direct harness login to the upstream server. See [OAuth in SCM](https://portkey.ai/docs/product/mcp-gateway/authentication/cas) and [MCP authentication layers](https://portkey.ai/docs/product/mcp-gateway/authentication).

## CIE and CAS are part of the required login design

```mermaid
flowchart LR
    accTitle: CIE provisioning and CAS gateway login prerequisites
    accDescr: Directory identities and groups are provisioned into gateway workspaces through CIE. CAS federates user authentication to Keycloak. Both feed the gateway's user resolution and MCP access decision.
    identity["Organizational identities and groups"] --> directory["CIE directory"]
    directory --> mapping["Group-to-gateway-workspace mapping"]
    mapping --> gateway["AI Gateway MCP user resolution and authorization"]
    user["User browser"] --> cas["CAS login"]
    cas <--> keycloak["Keycloak federation"]
    cas --> gateway
    gateway --> consent["Consent for registered MCP access"]
```

This is a required integration dependency for the CAS route. Existing records about another realm or workspace do not prove this harness workspace is provisioned correctly. Verify the selected directory, authentication profile, identity attribute and workspace membership against the deployed gateway. [CIE Directory Sync](https://portkey.ai/docs/product/enterprise-offering/org-management/directory-sync/cie-directory-sync).

## Three independently delivered components

The `airs-harness` package contains the agent, native MCP client and inference tool adapter. The AI Gateway deployment owns proxy routing and upstream OAuth integration. The `prisma-airs-mcp` deployment owns read tools, human resource authorization and backend service credentials. Updating one component does not automatically deploy the other two.

The earlier alpha.13 direct-server onboarding is superseded. Acceptance observes the harness talking to the gateway MCP listener, the gateway contacting the upstream, successful authorized reads, gateway denial of forbidden operations, and separate credential lifecycle behavior. A direct read or a scan on a later inference request is insufficient.

Continue with [Login from browser to authorized tools](./login.md) and [Implementation status and public sources](./evidence.md).

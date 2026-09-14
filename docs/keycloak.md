---
id: keycloak
title: "Keycloak and token contracts"
sidebar_label: "Keycloak and token contracts"
---

## Identity starts with the issuer and subject

Keycloak authenticates Alex for inference and federates organizational login through CAS for gateway-facing MCP access. The gateway exposes the MCP OAuth endpoints used by the native client. A separate Keycloak OAuth registration supplies the gateway with upstream MCP tokens. Each receiver enforces its own token and access contract.

The durable user identity is the pair **issuer and subject**. An email is a useful human-facing attribute, but two realms can contain the same email while issuing unrelated subjects. That distinction matters when integrating Redtail with an older CIE directory population.

## Read a token as a contract

The following JSON illustrates an upstream token held by the gateway. It is unsigned fictional content, not a valid JWT or a harness-to-gateway token:

```json
{
  "iss": "https://login.example.com/realms/learning",
  "sub": "user-alex-example",
  "aud": "https://mcp.example.com/mcp",
  "azp": "learning-gateway-mcp",
  "scope": "airs.gateway.read",
  "resource_access": {
    "learning-mcp-resource": {"roles": ["invoke", "gateway.read"]}
  },
  "iat": 1800000000,
  "exp": 1800000300
}
```

| Field | Question answered | Receiver's responsibility |
| --- | --- | --- |
| `iss` | Who issued this? | Require the configured issuer |
| `sub` | Which identity at that issuer? | Resolve explicit user access |
| `aud` | Which resource is this for? | Require this server's audience |
| `azp` | Which client obtained it? | Apply the client allowlist |
| `scope` | Which permissions were issued? | Intersect with roles and policy |
| Resource roles | Which grants apply to this resource? | Ignore unrelated client roles |
| `iat`, `exp` | When was it issued and when does it expire? | Enforce time and lifetime limits |

Decoding JSON is not validation. The receiver must verify the signature with trusted keys and reject an unexpected algorithm, issuer, audience, or lifetime. The reviewed MCP service pins RS256, checks required claims, and uses public keys from its fixed issuer's JWKS.

## Three token contracts, one SSO experience

```mermaid
flowchart LR
    accTitle: Separate inference and MCP authentication contracts
    accDescr: The harness presents inference and gateway-facing MCP credentials to the gateway. The gateway obtains and presents the upstream resource token.
    person["Alex at one Keycloak issuer"] --> inferenceClient["Native inference client"]
    person --> cas["CAS and organizational SSO"]
    cas --> mcpClient["Native client completes gateway OAuth"]
    inferenceClient --> inferenceToken["Audience: inference resource"]
    mcpClient --> mcpToken["Gateway-facing MCP token"]
    inferenceToken --> gateway["AI Gateway"]
    mcpToken --> gateway
    gateway --> upstreamToken["Gateway obtains upstream resource token"]
    upstreamToken --> server["prisma-airs-mcp"]
```

| Credential | Issued by | Held by | Used at |
| --- | --- | --- | --- |
| Inference access JWT | Keycloak | Harness identity store | Gateway inference listener |
| Opaque MCP access token | Gateway OAuth endpoint after CAS login | Native MCP credential store | Gateway MCP listener |
| Upstream MCP access JWT | Keycloak, for the confidential gateway client | Gateway | Upstream MCP resource server |

The observed gateway 2.22.0 MCP access lifetime is 3,600 seconds; the upstream JWT lifetime is 300 seconds. The gateway-facing token is opaque. A Keycloak browser login does not make it a JWT. These are deployment settings, not OAuth defaults.

A browser SSO session may avoid a second password prompt. It does not make the issued access tokens interchangeable. The native harness is a public OAuth client and uses PKCE. The gateway upstream integration has a separate confidential client whose secret stays server-side. The provisioned alpha.14 upstream registration uses authorization code with PKCE S256 and disables service-account, password and implicit grants.

An **ID token** lets the client verify the authenticated identity. An **access token** authorizes access at a resource server. A **refresh token** is presented to the authorization server to obtain a new token generation. Send each artifact only to its intended receiver. The separate PAN backend token described in [Read-only MCP authorization](./mcp.md) represents a server-side service account.

## How groups become permissions

Keycloak groups can grant resource-client roles. Client scope mappings control which grants appear in a token. The MCP server still requires an explicit subject binding to permitted workspaces and profiles. Therefore, registering either client or successfully logging in is insufficient to authorize a read.

**Checkpoint:** a signed token has the correct issuer but the inference audience. Should MCP accept it because Alex is a legitimate user? **No.** It was issued for another resource.

Protocol background: [Keycloak OIDC endpoints](https://www.keycloak.org/securing-apps/oidc-layers). Native-client rationale: [RFC 8252](https://www.rfc-editor.org/info/rfc8252/). Implementation-specific checks are documented in [Implementation status and public sources](./evidence.md).

---
id: login
title: "Login from browser to authorized tools"
sidebar_label: "Login from browser to authorized tools"
---

## Authenticate for the gateway destination

Both inference and MCP must target Prisma AIRS AI Gateway. The following sequences describe the required integration, not a completed release acceptance record. Prior commands that connected the harness directly to `prisma-airs-mcp` are withdrawn.

For inference, a user signs in to Keycloak using the configured native-client flow and presents a gateway-authorized JWT. A workspace API key is a separate supported authentication mode; it does not require converting the key into a Keycloak token. Preserve the working inference environment while correcting MCP.

## Native MCP login through the gateway

```mermaid
sequenceDiagram
    accTitle: Required gateway-facing native MCP login
    accDescr: The built-in client discovers OAuth at AI Gateway. Browser authentication goes through CAS and Keycloak. The gateway resolves CIE workspace membership, obtains consent and issues gateway-facing credentials for MCP requests.
    actor user as Alex
    participant client as Built-in harness MCP client
    participant gateway as AI Gateway MCP listener
    participant browser as System browser
    participant cas as CAS
    participant idp as Keycloak
    participant directory as CIE-backed workspace membership
    participant store as Native credential store
    user->>client: Connect the gateway MCP URL
    client->>gateway: Initialize without a gateway MCP credential
    gateway-->>client: OAuth challenge and protected-resource metadata
    client->>gateway: Discover authorization and token endpoints
    client->>browser: Open gateway authorization with state and PKCE
    browser->>gateway: Begin authorization
    gateway-->>browser: Continue through CAS
    browser->>cas: Start configured SSO flow
    cas-->>browser: Federate to organizational IdP
    browser->>idp: Authenticate as intended human
    idp-->>browser: Federation response
    browser->>cas: Complete identity-provider callback
    cas-->>browser: Continue gateway login
    browser->>gateway: Resume authenticated authorization
    gateway->>directory: Resolve user and workspace access
    directory-->>gateway: Provisioned identity and membership
    gateway-->>browser: Request consent for MCP access
    user->>browser: Approve requested access
    browser->>gateway: Submit consent
    gateway-->>browser: Authorization redirect
    browser->>client: Loopback callback with code and state
    client->>gateway: Exchange code using PKCE verifier
    gateway-->>client: Gateway-facing access and refresh credentials
    client->>store: Persist credentials bound to gateway endpoint
    client->>gateway: Initialize and list tools with gateway credential
```

CAS is the gateway-facing user-authentication method in SCM deployments. The actual callback, client registration, token issuer, audience and scopes must be verified from the gateway's discovery and deployed configuration. A Keycloak login during federation does not establish that the resulting MCP token is the same JWT used for inference. [OAuth in SCM](https://portkey.ai/docs/product/mcp-gateway/authentication/cas).

If an operator selects the gateway's External OAuth mode instead, the harness presents a Keycloak-issued token using the configured gateway authentication contract. It still targets the gateway. Switching to a direct upstream URL is never the fallback for a failed gateway login.

## Upstream OAuth remains with the gateway

```mermaid
sequenceDiagram
    accTitle: Separate gateway-managed upstream MCP authorization
    accDescr: The gateway discovers upstream OAuth and coordinates the user's consent. The upstream authorization server issues tokens to the gateway, which stores them and uses them for proxied MCP requests. The harness retains only its gateway-facing credentials.
    participant client as Harness
    participant gateway as AI Gateway
    participant browser as User browser
    participant upstream as Upstream MCP server
    participant auth as Upstream authorization server
    client->>gateway: Request access to provisioned MCP tools
    gateway->>upstream: Discover upstream authentication requirements
    upstream-->>gateway: Protected resource and authorization metadata
    gateway-->>browser: Upstream consent flow when required
    browser->>auth: Authenticate and approve upstream access
    auth-->>browser: Redirect with authorization code
    browser->>gateway: Gateway upstream OAuth callback
    gateway->>auth: Exchange code with configured client authentication
    auth-->>gateway: Upstream access and refresh tokens
    gateway->>gateway: Store tokens for this upstream and user
    gateway->>upstream: Proxied MCP request with upstream credential
    upstream-->>gateway: Authorized MCP response
    gateway-->>client: MCP response
```

The exact consent trigger and order depend on the registered upstream integration. Gateway OAuth Auto and machine client credentials are distinct modes. A failure in the latter does not demonstrate that the former is unavailable. The gateway manages upstream OAuth; the harness must not acquire upstream tokens to bypass that step. [MCP authentication layers](https://portkey.ai/docs/product/mcp-gateway/authentication).

## Onboarding and validation boundary

Use the gateway-provided connection URL for the provisioned integration. The reviewed deployment has distinct inference and MCP listeners; an upstream server URL is not interchangeable with the MCP gateway URL. Exact runnable onboarding is pending verification of gateway registration, workspace access, CAS/CIE configuration and the installed native client.

Require native credential storage for the harness. Verify OAuth discovery, browser callback, gateway access, tool discovery and a model-selected read as separate steps. Then test expiry, logout and denial on the gateway-mediated path. Existing direct-server credentials and the direct-path fixture tests do not establish these results.

Continue with [End-to-end question walkthrough](./walkthrough.md) and [Implementation status and public sources](./evidence.md).

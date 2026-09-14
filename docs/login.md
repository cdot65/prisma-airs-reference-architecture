---
id: login
title: "Login from browser to authorized tools"
sidebar_label: "Login from browser to authorized tools"
---

## Begin with a configured trust relationship

The harness starts with an expected issuer, a registered native client, and a resource. Discovery confirms the server's advertised contract against those settings. It is not permission to send tokens to any URL returned by an arbitrary server.

The reviewed MCP server publishes protected-resource metadata at `/.well-known/oauth-protected-resource/mcp`. An unauthenticated MCP request receives a 401 challenge advertising metadata. The client checks the resource, authorization server, and requested scopes before beginning login. See [RFC 9728](https://www.rfc-editor.org/info/rfc9728/) for metadata and the [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) for its use in MCP.

## End-to-end native login

This sequence shows both native logins. The MCP login uses the same verified human identity as inference but a distinct client, resource, and token bundle. Browser redirects carry a short-lived code; tokens are obtained through a separate token-endpoint exchange.

```mermaid
sequenceDiagram
    accTitle: Complete native inference and MCP login
    accDescr: The harness completes browser PKCE for inference, verifies and stores that identity, validates MCP metadata, then completes separate resource-bound PKCE for the same user before invoking MCP.
    actor alex as Alex
    participant harness as Harness
    participant browser as System browser
    participant keycloak as Keycloak
    participant store as OS credential store
    participant gateway as AI Gateway
    participant mcp as MCP server
    alex->>harness: Set up inference login
    harness->>harness: Create state, nonce, verifier, and loopback listener
    harness->>browser: Open inference authorization URL with S256 challenge
    browser->>keycloak: Authenticate user under realm policy
    keycloak-->>browser: Redirect with code, state, and issuer
    browser->>harness: Loopback callback
    harness->>harness: Validate callback state and issuer
    harness->>keycloak: Exchange code with verifier and registered redirect
    keycloak-->>harness: Inference access token, ID token, refresh token
    harness->>harness: Verify identity and inference binding
    harness->>store: Persist inference token generation
    harness->>gateway: Verify inference access with inference JWT
    gateway-->>harness: Authorized response
    alex->>harness: Connect direct MCP resource
    harness->>mcp: Request protected-resource metadata
    mcp-->>harness: Resource, authorization server, and scopes
    harness->>harness: Validate metadata against configured trust
    harness->>browser: Open MCP authorization with fresh S256 challenge and resource
    browser->>keycloak: Authorize MCP client using browser SSO if available
    keycloak-->>browser: Redirect with new code, state, and issuer
    browser->>harness: MCP loopback callback
    harness->>harness: Validate callback state and issuer
    harness->>keycloak: Exchange code with verifier and MCP resource
    keycloak-->>harness: Separate MCP access, ID, and refresh tokens
    harness->>harness: Verify same issuer and user plus MCP binding
    harness->>store: Persist MCP token generation
    harness->>mcp: Initialize using MCP bearer token
    mcp->>mcp: Verify token and effective resource authorization
    mcp-->>harness: MCP initialization result
    harness->>mcp: List tools using MCP bearer token
    mcp-->>harness: Available tool definitions
```

The browser may reuse its Keycloak session during the second authorization. That improves usability without reusing the inference access token. Each authorization attempt has a fresh verifier, state, and nonce. The client validates returned identity and resource bindings before committing credentials.

PKCE binds code redemption to the client that created the verifier. The challenge is derived from the verifier; the verifier is sent only during the token exchange. `state` correlates the callback, while OIDC `nonce` participates in ID-token validation. The mechanisms address different parts of the flow. [PKCE specification](https://www.rfc-editor.org/info/rfc7636/).

The MCP client includes its `resource` indicator during authorization, exchange, and refresh. This helps keep credentials bound to the intended endpoint. The resource server must still enforce the audience. [Resource indicators](https://www.rfc-editor.org/info/rfc8707/).

## When CIE/CAS participates in browser login

The next sequence is the related gateway identity pattern, not an extra mandatory step in the native sequence above. The SCIM population must already exist. Exact gateway OAuth behavior needs its own deployment evidence.

```mermaid
sequenceDiagram
    accTitle: Related CIE CAS browser authentication
    accDescr: The browser follows a gateway identity flow to CAS and Keycloak. A signed SAML response returns through the browser, after which the gateway resolves the provisioned identity and policy.
    participant browser as Browser
    participant gateway as Gateway identity entry
    participant cas as CIE CAS
    participant keycloak as Keycloak SAML IdP
    browser->>gateway: Begin gateway identity flow
    gateway-->>browser: Redirect to configured authentication flow
    browser->>cas: Start CAS authentication
    cas-->>browser: SAML authentication request
    browser->>keycloak: Authenticate at configured IdP
    keycloak-->>browser: Signed SAML response
    browser->>cas: Post response to assertion consumer endpoint
    cas->>cas: Validate assertion and mapped identity
    cas-->>browser: Continue authenticated gateway flow
    browser->>gateway: Resume flow
    gateway->>gateway: Resolve provisioned identity and workspace policy
    gateway-->>browser: Consent or access outcome
```

CAS is the SAML service provider in that exchange; Keycloak is the SAML IdP. The assertion is delivered through the browser. It is not the direct MCP bearer token. Compare the two sequences before assuming that “SSO” names one protocol or one audience.

## User-visible failures

A canceled browser login returns the user to setup. A callback with mismatched state must fail. A different Keycloak user must not replace an existing identity binding silently. An inaccessible native credential store must surface a credential-store error; it must not create a plaintext fallback. `--no-browser` changes how the authorization URL is presented, not the authentication requirement.

Continue with [Refresh revocation and identity changes](./lifecycle.md). Deployment-specific evidence is in [Implementation status and public sources](./evidence.md).

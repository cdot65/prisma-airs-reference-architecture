---
id: glossary
title: "Glossary and misconceptions"
sidebar_label: "Glossary and misconceptions"
---

> **Architecture correction — September 14, 2026:** The required harness sends both inference and remote MCP traffic through Prisma AIRS AI Gateway. Earlier direct-MCP flows and their acceptance records describe a divergent implementation. They do not validate the required gateway/CAS path. Read [System architecture](./architecture.md) for the corrected contract.

## Vocabulary for this architecture

| Term | Meaning here |
| --- | --- |
| Harness | Local application that runs the conversation and dispatches tools |
| Agent loop | Repeated model request, tool selection, tool execution and continuation |
| MCP | Protocol used by the harness to discover and call the server's tools |
| Resource server | API that validates an access token and enforces access |
| Authorization server | Service issuing OAuth tokens; gateway-facing MCP and upstream MCP use separate authorization contracts |
| IdP | Identity provider authenticating the user; a role Keycloak also plays |
| OIDC | Identity layer used to verify the authenticated user |
| OAuth 2.0 | Framework for obtaining and presenting delegated access credentials |
| Public client | Installed application registration that cannot keep a shared secret confidential |
| PKCE | Proof binding authorization-code exchange to the initiating client's verifier |
| Issuer | Identity authority named in the token's iss claim |
| Subject | Identity identifier scoped to an issuer |
| Audience | Intended resource receiver of an access token |
| Scope | Permission requested and issued through OAuth |
| Resource role | Keycloak role belonging to a specific resource client |
| Binding | Server policy mapping a subject to permitted resources and scopes |
| JWT | Signed token representation; decoding is different from verification |
| JWKS | Published keys used to verify signatures from a trusted issuer |
| ID token | OIDC identity assertion intended for the client |
| Access token | Credential presented to its intended resource |
| Refresh token | Credential presented to the authorization server for renewal |
| SSO | Reused authentication experience; it does not imply one universal access token |
| CIE | Cloud Identity Engine, providing directory and authentication integration |
| Directory Sync | CIE capability for user/group information |
| CAS | CIE Cloud Authentication Service in this curriculum |
| SCIM | Protocol for provisioning users and groups |
| SAML | Federation protocol carrying authentication assertions |
| NameID | SAML subject identifier interpreted under the configured mapping contract |
| Workspace | Gateway resource and policy context for integrations/configurations |
| Guardrail | Configured check attached to a gateway request or response path |
| Security profile | AIRS scanner policy settings and protection actions |
| Service account | Machine identity used for a server's backend API access |
| GitOps | Reconciliation of declared deployment state from Git |
| ESO | External Secrets Operator, retrieving configured secrets into a namespace |
| Data plane | Services handling inference or tool requests |
| Control plane | Services configuring routes, identities, policy and deployments |

## Misconceptions to retire

**“Built-in MCP means the MCP server moved into the harness.”** The Codex MCP client runs inside `airs-harness`. The remote `prisma-airs-mcp` service remains upstream of AI Gateway. It authenticates gateway-forwarded user tokens, checks object permissions and reads PAN APIs.

**“We still need the separate MCP candidate executable.”** The current integration uses the normal `airs-harness` command and its native MCP subcommands. The separate `airs-harness-mcp` candidate is historical.

**“One executable means one login or token.”** Inference and MCP have distinct client registrations, audiences and credential bundles. The gateway enforces its inference and MCP contracts; the upstream server additionally enforces the gateway-held resource token.

**“The model calls PAN APIs directly.”** The model requests a function. The harness sends the MCP call to AI Gateway; the gateway proxies it to the resource server, which authorizes and performs a backend read using its own service account.

**“Read-only means every user can see everything.”** Read-only limits operations. Subject bindings, scopes, roles and object checks limit the visible resources.

**“A successful Keycloak login grants MCP access.”** The native client registration grants no workspace access by itself. The server checks resource-specific grants and explicit bindings.

**“The ID token can be sent to any API.”** The ID token establishes identity for the client. Resource APIs require the appropriate access token.

**“CAS login also supplies the upstream MCP token.”** CAS supports gateway-facing organizational SSO. The gateway separately obtains and stores upstream OAuth tokens. CIE directory/workspace access and upstream resource grants are distinct requirements.

**“Matching emails mean matching identities.”** The same email can occur under distinct issuers and subjects. Correlation requires a deliberate ownership and linking contract.

**“Logout instantly invalidates all tokens.”** Already issued access JWTs can remain valid until expiry unless the resource has an additional effective revocation control.

**“MCP read-only makes the entire local agent read-only.”** Other local tools have their own capabilities and approval boundaries.

**“A profile read proves scanning happened.”** It proves configuration visibility. Runtime scan verdicts and request correlation establish what happened on a request.

**“Mermaid diagrams are deployment evidence.”** Diagrams explain claims. Source inspection and dated acceptance records substantiate those claims.

Return to [Start here](./start-here.md) or test yourself in [Labs and answer keys](./labs.md).

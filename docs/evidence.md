---
id: evidence
title: "Implementation status and public sources"
sidebar_label: "Implementation status and public sources"
---

## September 14 deployment and release status

Both inference and native MCP use Prisma AIRS AI Gateway in the required architecture. The gateway now has development and production MCP integrations, dedicated confidential upstream OAuth clients, the required upstream-host allowlist and separate workspace bindings. Both upstream resource deployments accept only the gateway-owned client for their environment. Development has one ready replica; production has two.

The owner repaired a missing CIE group-to-harness-workspace mapping and confirmed membership in SCM. A native desktop gateway login then completed, and the model successfully used all eight tools through the development gateway. Gateway telemetry and upstream request logs recorded those reads. These diagnostic calls used the existing alpha.13 executable; they establish the live proxy and identity repair, while exact alpha.14 release acceptance remains separate.

At 12:55 UTC, both exact installed alpha.14 packages completed production gateway consent, native credential storage, inference access and all eight model-selected production tools. Each platform has matching gateway and upstream tool observations. Two real one-hour frontend token-expiry cycles are now running; publication awaits those results.

| Area | Current evidence | Release status |
| --- | --- | --- |
| Runtime | Frozen source `6195ca83e` includes native dynamic-registration history preservation and the alpha.14 version correction | Linux x64 and Apple Silicon builds complete |
| Native executable checks | 44-test suites on both platforms with two platform-specific skips | Passed |
| Installed package checks | 44-test suites on both platforms with one platform-specific skip, including managed CLI integration | Passed |
| npm upgrades | Ordinary alpha.13 → alpha.14 upgrade and both legacy command layouts preserve configuration and exact native bytes | Passed on both platforms |
| Apple Silicon distribution | Developer ID signature, hardened runtime, Apple notarization and native Keychain checks | Passed |
| Gateway and upstream | Production and development proxy integrations; upstream client allowlists enforced | Live |
| CIE and CAS | Workspace mapping repaired; owner completed native desktop login and development tool workflow | Observed |
| Exact alpha.14 production workflow | Native inference and gateway MCP login, native credential storage, all eight model-selected tools and matching gateway/upstream observations | Passed on both installed packages |
| Exact alpha.14 gateway lifecycle | Two real native expiry cycles, concurrent fresh processes and upstream renewal correlation | Expiry tests running; publication remains gated |
| Publication | Alpha.13 remains the published package until alpha.14 acceptance completes | Alpha.14 is an unpublished candidate |

The gateway's observed frontend MCP token is opaque and lasts 3,600 seconds. The separate upstream Keycloak JWT lasts 300 seconds. Acceptance waits for real expiration, launches two concurrent native processes, records nonsecret token-generation fingerprints, and correlates gateway tool telemetry with upstream requests. Changing a local expiry field or reusing direct-route receipts would not establish this behavior.

## Evidence boundaries

The public educational repository contains explanations and fictional examples. Operational credentials, identity records, private logs and full release receipts remain outside the publication. Deployment observations above were made on September 14, 2026; a source revision alone is not a live health check.

Earlier direct-MCP documentation and alpha.13 receipts describe a superseded route. They remain historical evidence for the tool adapter and native client, but do not prove gateway/CAS routing. The earlier 30-minute upstream soak predates this integration and is neither a gateway benchmark nor a service-level commitment.

Windows distribution, a full Rust workspace test run, independent release review and alert receiver delivery are not claimed by these scoped alpha checks. The GitHub Pages site is public; that does not establish unauthenticated public access to the private lab's inference or MCP services.

Primary product references: [SCM CAS login](https://portkey.ai/docs/product/mcp-gateway/authentication/cas), [gateway and upstream authentication](https://portkey.ai/docs/product/mcp-gateway/authentication), and [CIE workspace provisioning](https://portkey.ai/docs/product/enterprise-offering/org-management/directory-sync/cie-directory-sync).

## Primary references

These links explain protocols and product behavior. The private implementation observations above are separately identified and are not vendor guarantees.

| Reference | Use in the course |
| --- | --- |
| [OAuth for native apps — RFC 8252](https://www.rfc-editor.org/info/rfc8252/) | System browser, loopback callback and public-client rationale |
| [PKCE — RFC 7636](https://www.rfc-editor.org/info/rfc7636/) | Verifier and challenge |
| [Resource indicators — RFC 8707](https://www.rfc-editor.org/info/rfc8707/) | Resource-bound authorization requests |
| [Protected resource metadata — RFC 9728](https://www.rfc-editor.org/info/rfc9728/) | Discovering the resource's authorization contract |
| [MCP authorization, 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) | Versioned MCP authorization reference |
| [Codex MCP client](https://developers.openai.com/codex/mcp/) | Upstream Streamable HTTP, OAuth, MCP commands and interactive inventory; fork-specific behavior is verified against local source |
| [Keycloak OIDC endpoints](https://www.keycloak.org/securing-apps/oidc-layers) | Authorization, token and discovery endpoints |
| [SCIM protocol — RFC 7644](https://www.rfc-editor.org/info/rfc7644/) | Provisioning operations |
| [CIE components](https://docs.paloaltonetworks.com/pan-os/10-1/pan-os-new-features/identity-features/cloud-identity-engine) | Directory Sync versus Cloud Authentication Service |
| [CIE SCIM connector](https://docs.paloaltonetworks.com/identity/cloud-identity-engine/identify-users-and-devices-with-cie/choose-directory-type/configure-a-cloud-based-directory/configure-scim-connector-for-the-cloud-identity-engine) | Product provisioning integration |
| [CIE SAML authentication](https://docs.paloaltonetworks.com/identity/cloud-identity-engine/authenticate-users-with-the-cloud-identity-engine/set-up-a-saml-2-0-authentication-type) | CAS federation and consumed attributes |
| [Prisma AIRS AI Gateway](https://docs.paloaltonetworks.com/ai-runtime-security/administration/configure-ai-gateway) | Product architecture and deployment context |

References were consulted on September 14, 2026. Recheck versioned protocol and product documentation when updating the course. Broad CIE documentation covers supported consuming products; the specific AI Gateway CAS behavior described here derives from the case-study implementation, not a claim inferred from a GlobalProtect setup guide.

## Updating an architectural claim

Change the explanation and its diagram together. Record the source revision or dated observation, state what passed and what remains untested, and update related labs if the permission contract changes. An extension graduates to “recorded acceptance” only after its own positive and negative checks.

If an upstream product changes its tool or authentication behavior, keep the older observation dated and explain the new result. Do not silently turn a historical workaround into permanent protocol advice.

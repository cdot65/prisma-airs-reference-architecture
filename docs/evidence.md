---
id: evidence
title: "Implementation status and public sources"
sidebar_label: "Implementation status and public sources"
---

> **Architecture correction — September 14, 2026:** The required harness sends both inference and remote MCP traffic through Prisma AIRS AI Gateway. Earlier direct-MCP flows and their acceptance records describe a divergent implementation. They do not validate the required gateway/CAS path. Read [System architecture](./architecture.md) for the corrected contract.

## Acceptance correction

The required architecture sends both inference and MCP through AI Gateway. The prior direct-server plan and documentation commit `bd9c804` incorrectly treated a divergent implementation as accepted. Native client tests, direct-server reads, the 30-minute soak and helper retirement do not establish gateway-mediated MCP or CAS acceptance.

Read-only review on September 14 confirmed that the deployed gateway has an MCP listener and upstream OAuth Auto support, while the harness onboarding targets the upstream server directly. The control-plane integration list did not contain a harness MCP registration. These are remediation findings, not proof of a corrected live deployment. The source-reported machine client-credentials issue belongs to a different upstream auth mode; it cannot justify bypassing the gateway.

The architecture, login, tool flow, lifecycle, operations and lab lessons now describe the required path. Historical compatibility incidents remain labeled as direct-route evidence. Do not use the direct-server commands as deployment instructions. Required acceptance includes gateway-facing login, gateway-managed upstream OAuth, observed gateway request routing, authorization denials and both credential lifecycles.

Primary product references: [SCM CAS login](https://portkey.ai/docs/product/mcp-gateway/authentication/cas), [gateway and upstream authentication](https://portkey.ai/docs/product/mcp-gateway/authentication), and [CIE workspace provisioning](https://portkey.ai/docs/product/enterprise-offering/org-management/directory-sync/cie-directory-sync).

## Read this case study with its evidence limits

The curriculum was prepared on September 14, 2026 from the implementation source and dated acceptance records of a private lab. The public educational repository contains explanations and fictional examples. It does not distribute the running lab's application code, secrets, access, or production configuration.

| Area | Evidence reviewed | What readers may conclude |
| --- | --- | --- |
| Harness | Runtime revision 6892b94a1, based on the published Codex 0.154 runtime | Built-in Codex MCP OAuth is retained; the gateway adapter restores callable tools |
| MCP | Source revisions 5486021 and 158e57b with deployment record | Eight authorized read tools and bounded output projection are implemented |
| Infrastructure | Source revision 3e23f42 and MCP receipts | GitOps, secret isolation and deployment pattern have recorded acceptance |
| Linux and Apple Silicon | Alpha.13 publication receipt at 5b2f7c194 and fresh registry lookup | Alpha.13 is published as latest/alpha, with direct-route native tests, expiry cycles, npm upgrades and Mac signing; gateway/CAS acceptance remains separate |
| Lifecycle | Historical candidate replay, logout/expiry and binding-removal records; built-in refresh-scope correction and HTTP regression test | Service and candidate results remain dated; built-in concurrency must be accepted separately |
| CIE provisioning | Initial source review plus September 14 live Redtail worker and directory readback | The intended user and MCP group exist in CIE; the owner added the harness workspace mapping and confirmed its member in SCM |
| CAS identity mapping | Redtail Truffles mapping source and narrative | The related gateway flow required email-aligned SAML fields |
| Harness through gateway/CAS/CIE | No complete acceptance chain found | Required alpha.14 work with separate live validation |

Source presence is not a fresh production health check. The initial curriculum was written from source records. Its September 14 revision incorporates separately recorded live remediation tests using a disposable identity. Those checks do not represent the owner’s personal login.

The historical MCP production soak completed 61 calls over 30 minutes with rotating refresh, reporting approximately 2.25-second p95 latency for that workload. It predates the built-in client integration and does not validate that client's refresh implementation. This is a bounded lab result, not a throughput benchmark or service-level commitment.

This release’s Windows end-to-end behavior, public Internet reachability, alert receiver delivery, and the owner's personal browser acceptance are not established by the reviewed record. Earlier credential-store tests and previous package releases must not be substituted for these checks. The published alpha.12 runtime already contains Codex MCP OAuth. Its gateway path did not expose namespaced read tools successfully; alpha.13 adds gateway translation, explicit onboarding scopes and a correction that keeps refresh within the granted scopes. Older custom-helper candidate receipts are historical and do not validate the built-in MCP implementation.

## Built-in MCP integration review — September 14, 2026

The normal executable contains the existing Codex MCP client. The remote server remains independent. Source review covered the native MCP command/configuration path, gateway tool adapter, inference session binding, OAuth callback/storage path and refresh-scope regression test. Runtime correction `6892b94a1` keeps refresh within the original grant. Release tooling through `55d13d859` also binds npm acceptance to the resolved native executable hash and checks both legacy command-link upgrade layouts.

The recorded session reports 303 MCP-client, 208 scoped CLI and 221 API/provider checks passing, plus native builds and Mac signing/notarization. These are reviewed results, not tests rerun by this documentation update. The later alpha.13 publication receipt records completed direct-route native expiry, npm upgrades and publication, and a fresh registry lookup confirms alpha.13 as latest. The owner assigned the gateway correction to alpha.14. Prepared changes cover native dynamic-registration history preservation, gateway-owned upstream OAuth configuration and a release gate that rejects historical direct receipts. The subsequent authorized rollout provisioned both gateway integrations and upstream clients, updated the gateway host allowlist, and cut over the development resource server. The owner repaired the CIE workspace mapping after browser access was denied. Production resource-server cutover, successful gateway tool/refresh acceptance and alpha.14 publication remain pending.

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


## Alpha.14 rollout checkpoint

The initial frozen remediation source compiled and passed 44 native tests per platform, with two platform-specific skips, plus Mac Keychain checks. Packaging exposed a native/npm version mismatch before publication. Source `6195ca83e` corrects the executable version to alpha.14 and adds a packaging rejection for mismatched versions; eleven packaging tests and eight targeted Rust tests pass. Both release binaries are rebuilding from that corrected source. Earlier version-mismatched binaries do not qualify as alpha.14 release evidence.

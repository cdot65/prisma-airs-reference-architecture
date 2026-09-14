---
id: evidence
title: "Implementation status and public sources"
sidebar_label: "Implementation status and public sources"
---

## September 14 deployment and release status

Both inference and native MCP use Prisma AIRS AI Gateway in the required architecture. The gateway now has development and production MCP integrations, dedicated confidential upstream OAuth clients, the required upstream-host allowlist and separate workspace bindings. Both upstream resource deployments accept only the gateway-owned client for their environment. Development has one ready replica; production has two.

The owner repaired a missing CIE group-to-harness-workspace mapping and confirmed membership in SCM. A native desktop gateway login then completed, and the model successfully used all eight tools through the development gateway. Gateway telemetry and upstream request logs recorded those reads. These diagnostic calls used the existing alpha.13 executable; they establish the live proxy and identity repair, while exact alpha.14 release acceptance remains separate.

At 12:55 UTC, both exact installed alpha.14 packages completed production gateway consent, native credential storage, inference access and all eight model-selected production tools. Each platform has matching gateway and upstream tool observations. The initial silent-wait runs were stopped after discovering that the Keycloak refresh grants expire after 30 minutes idle. Their failed receipts are preserved. Alpha.14 is published with owner authorization to proceed without another timed authentication run. Hourly frontend refresh remains unverified, with zero completed cycles; the failed lifecycle receipts are retained. Gateway-held upstream JWT renewal was observed after actual expiry.

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
| Exact alpha.14 gateway lifecycle | Two real native expiry cycles, concurrent fresh processes and upstream renewal correlation | Hourly frontend refresh unverified; owner-authorized release exception retains failed idle-session receipts |
| Publication | Alpha.14 is published for Linux x64 and Apple Silicon; fresh anonymous registry downloads match tested native bytes and pass executable checks | Limited internal alpha scope; hourly frontend lifecycle not claimed |

The gateway's observed frontend MCP token is opaque and lasts 3,600 seconds. The separate upstream Keycloak JWT lasts 300 seconds. Acceptance waits for real expiration, launches two concurrent native processes, records nonsecret token-generation fingerprints, and correlates gateway tool telemetry with upstream requests. The deployment also has a 30-minute Keycloak SSO idle limit, and the observed upstream refresh grants expired after 30 minutes without renewal. The corrected runner uses periodic authorized reads to maintain normal activity, verifies that those reads do not rotate the frontend token early, and then tests concurrent processes after actual frontend expiry. This is active-session acceptance, not a claim of uninterrupted access after an hour idle. Changing a local expiry field or reusing direct-route receipts would not establish this behavior.

## Alpha.15 implementation in progress

The production MCP adapter now renews its own management-API service-account token once after HTTP 401 rejects a cached token, then retries the authorized read once. Concurrent callers share acquisition; a late rejection cannot invalidate a newer cached generation. HTTP 403 and resource-not-found responses do not trigger this renewal. These are backend service credentials, separate from either human OAuth leg. The deployed adapter also records bounded operator diagnostics: a vendor request UUID, an allowlisted IAM error code when present, and the rejected token's remaining lifetime. It retains no provider message or credential. All 55 backend tests, type checking and compilation passed; the image is deployed to development and both production replicas.

The native client has merged durable refresh-intent handling, cross-environment coordination, same-identity inference restoration, typed failure guidance and the terminal sign-in action for the alpha.15 candidate. The combined authentication and terminal suites passed 5,833 tests, and four focused core MCP tests passed. Both installed native packages passed executable, secure-store and upgrade checks; Apple Silicon signing and notarization passed. Production login and all eight gateway tools passed on both platforms. The first concurrent expiry check failed on Linux when one management API read returned HTTP 403. Linux cleanup then revoked the inference client session shared with the Mac test; Keycloak rejected the Mac refresh because that client session was missing. Mac MCP credential renewal and Keychain saves succeeded, but neither platform completed an accepted frontend expiry cycle. Acceptance cleanup coordination is merged and its Linux-to-Mac controller check passed. The backend denial remains under investigation. Alpha.15 remains unpublished.

At 23:47 UTC, fresh coordinated Mac and Linux runs had each completed production sign-in, native credential persistence and all eight actual tool results. Their two real frontend expiry checks were running unattended. An earlier Mac attempt completed gateway-facing login but its first MCP connection failed when Keycloak rejected the gateway's expired upstream refresh grant. A subsequent gateway/upstream consent flow obtained a fresh grant and all eight reads passed. This records a recovery, not a gateway fix. Separately, a production backend diagnostic observed HTTP 403 with 890 seconds remaining on a service token; the same read later passed. Token expiry alone does not explain that intermittent denial.

The broader core suite was not green. A comparison against published alpha.14 reproduced all 103 remaining failures; the candidate-only gateway test expectation was corrected and passed its focused rerun. Full workspace compilation also encountered an unavailable Rusty V8 Linux musl archive. These limits remain explicit in the evidence. The candidate keeps the 30-minute idle policy and prevents automatic replay of completed work. Opaque gateway MCP credentials still lack the trusted identity continuity needed to automatically restore an existing conversation after a new login.

Alpha.15 is not yet published or accepted on exact Linux and signed Apple Silicon packages. Alpha.14 remains the published release; its recorded exception does not transfer to this candidate.

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

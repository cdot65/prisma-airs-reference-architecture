---
id: evidence
title: "Implementation status and public sources"
sidebar_label: "Implementation status and public sources"
---

## Read this case study with its evidence limits

The curriculum was prepared on September 14, 2026 from the implementation source and dated acceptance records of a private lab. The public educational repository contains explanations and fictional examples. It does not distribute the running lab's application code, secrets, access, or production configuration.

| Area | Evidence reviewed | What readers may conclude |
| --- | --- | --- |
| Harness | Source revision f2f4359 and native acceptance records | Separate direct MCP OAuth and model/tool adapter are implemented in the reviewed candidate |
| MCP | Source revisions 5486021 and 158e57b with deployment record | Eight authorized read tools and bounded output projection are implemented |
| Infrastructure | Source revision 3e23f42 and MCP receipts | GitOps, secret isolation and deployment pattern have recorded acceptance |
| Linux and Apple Silicon | Native login, model-selected workflows and rotating refresh records | These candidate/platform combinations passed the recorded checks |
| Lifecycle | Replay, logout/expiry and binding-removal records | These specific revocation and refresh behaviors were exercised |
| CIE provisioning | SCIM worker source and September 3 cutover narrative | A related older realm had a recorded SCIM integration |
| CAS identity mapping | Redtail Truffles mapping source and narrative | The related gateway flow required email-aligned SAML fields |
| Redtail harness through CIE | No complete acceptance chain found | A proposed extension requiring separate validation |

Source presence is not a fresh production health check. No live infrastructure mutations or credential-based acceptance runs were performed to write this curriculum.

The recorded MCP production soak completed 61 calls over 30 minutes with rotating refresh, reporting approximately 2.25-second p95 latency for that workload. This is a bounded lab result, not a throughput benchmark or service-level commitment.

The direct MCP candidate's Windows end-to-end behavior, public Internet reachability, alert receiver delivery, and the owner's personal browser acceptance are not established by the reviewed record. Earlier credential-store tests and previous package releases must not be substituted for these checks. In particular, the published alpha.12 baseline does not establish the newer candidate's direct MCP capabilities.

## Primary references

These links explain protocols and product behavior. The private implementation observations above are separately identified and are not vendor guarantees.

| Reference | Use in the course |
| --- | --- |
| [OAuth for native apps — RFC 8252](https://www.rfc-editor.org/info/rfc8252/) | System browser, loopback callback and public-client rationale |
| [PKCE — RFC 7636](https://www.rfc-editor.org/info/rfc7636/) | Verifier and challenge |
| [Resource indicators — RFC 8707](https://www.rfc-editor.org/info/rfc8707/) | Resource-bound authorization requests |
| [Protected resource metadata — RFC 9728](https://www.rfc-editor.org/info/rfc9728/) | Discovering the resource's authorization contract |
| [MCP authorization, 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) | Versioned MCP authorization reference |
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

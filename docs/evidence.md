---
id: evidence
title: "Implementation status and public sources"
sidebar_label: "Implementation status and public sources"
---

## September 17: command migration and bundled product CLI

Standalone Prisma AIRS CLI **7.0.1** exports `airs-cli`. Harness **0.1.0-alpha.22** exports `airs` and bundles its tested CLI **7.0.0** as `airs cli ...`, with SDK **0.33.0**. The standalone patch finalizes stable publication without changing command behavior or tenant configuration. Linux x64, native Linux ARM64 and signed/notarized Apple Silicon installations passed acceptance. A separate global product CLI is optional. The temporary `airs-harness` alias is scheduled for removal in alpha.23.

Validation includes 1,920 TypeScript CLI tests, 925 native CLI tests and 51 skills tests. Each installed harness passed 47 executable checks (46 passed, one platform-specific skip), including an agent invoking the embedded skill and private CLI. The installed product CLI generated PDF, PNG, JPEG, SVG and DOCX fixtures on all three platforms. Mac Keychain checks passed. Upgrade checks preserve environment identity, configuration and history; the paired CLI/harness migration, independent uninstalls and ordered rollback passed on each platform without force. These checks use isolated state and deterministic gateway fixtures.

The rename does not merge harness environments with CLI tenants. Company SSO authorizes gateway inference and MCP access; product API credentials remain in separately selected tenant JSON. The login lesson covers the complete first session, including the optional product CLI setup after the ServiceNow read.

Publication and installed-client acceptance do not establish a fresh human SSO login or a live ServiceNow incident call. Complete production frontend expiry and hourly renewal acceptance remain open. The user performs the walkthrough's final read-only tool call with their own provisioned account.

## September 17: ServiceNow onboarding and environment commands

Alpha.21 is published for Linux x64, Linux ARM64 and Apple Silicon. It provides the login lesson's unified `env create` and `env status` commands and removes top-level `setup` and `status`. The implementation passed 780 scoped CLI tests and 11 focused onboarding/status checks. Fresh anonymous registry installations passed 47 executable checks per platform (46 passed and one platform-specific skip), plus environment lifecycle checks. Upgrades from alpha.20 preserved configuration on all three platforms; alpha.14 upgrades also passed on Linux x64 and Apple Silicon. Apple Silicon signing, notarization and Keychain checks passed; Linux ARM64 was exercised natively in an ARM64 Linux VM. These are installed-client checks against deterministic fixtures, not fresh production SSO or ServiceNow acceptance.

ServiceNow is a separate development integration from the course's eight-tool utility server. The deployment record reports upstream acceptance of four incident tools and refresh cycles with disposable users. The maintainer subsequently observed the gateway-connected `service-now` inventory with OAuth in the harness. That inventory observation does not establish a completed model-selected incident call through the gateway frontend. No ServiceNow production deployment, fresh human SSO acceptance, or new live tool-call acceptance is claimed by this documentation update.

The human uses company SSO for inference and gateway MCP authorization. The gateway owns upstream OAuth; the ServiceNow MCP service uses a server-side integration credential to access the incident table. These are separate credential boundaries. The walkthrough's final read-only tool call is the user's end-to-end verification step.

## Earlier implementation and publication scope

Every other lesson makes claims about how this system behaves. This lesson records what those claims rest on, as of the dates given, and where each piece of evidence stops. Reading it lets you tell the difference between something the reviewed source does, something a dated check observed, and something that has not been demonstrated yet.

The current architecture sends both inference and native MCP through Prisma AIRS AI Gateway. The upstream **mcp server 1** exposes eight utility tools whose execution is local to that server. Its tool implementation no longer depends on a management API.

| Area | Recorded evidence | Limit |
| --- | --- | --- |
| Server inventory | Both production replicas were inspected and expose calculate, format_json, transform_text, encode_base64, decode_base64, hash_text, generate_uuid and current_time | Inventory is not proof that every authenticated call succeeded |
| Utility execution | Reviewed implementation computes in process using local text/JSON/crypto operations, clock and random source | Authentication still uses trusted issuer public keys |
| Native client | Built-in MCP client targets the gateway; inference uses the gateway's separate listener | No direct upstream bypass is part of the accepted architecture |
| Alpha.15 maintainer testing | Published Linux x64 and signed Apple Silicon packages; fresh registry installs passed 44 executable checks per platform with one skip each | Full active-expiry acceptance was incomplete |
| Manual idle recovery | The maintainer returned after about 30 minutes, used /signin and received a new inference reply in the same conversation | This did not test a subsequent MCP call or active renewal |
| Alpha.16 source correction | Normal AIRS provider dispatch now preserves typed recovery; a real helper regression failed before the fix; 78 provider tests and scoped Clippy pass afterward | Installed production behavior must be distinguished from source tests |
| Alpha.16 distribution | Publication receipts are completed alongside the binary release | Timed production renewal is not implied by package publication |

The Limit column is the part to read carefully. Each row establishes one thing, and stacking the rows does not produce a stronger claim than any one of them makes: an inventory shows which tools exist, a package check shows what an installer receives, and a manual recovery shows that one path worked once. None of them stands in for the timed lifecycle acceptance that is still open.

The failed alpha.15 lifecycle receipts remain in the private implementation repository. Earlier tests against configuration-read tools are historical observations from a previous tool inventory. They are not acceptance of this utility inventory, and the retired backend investigation is not a prerequisite for testing the harness.

## What alpha.16 changes

The 30-minute SSO idle policy stays in place; alpha.16 does not change how long a session may sit idle. What it corrects is a provider-routing bug that reduced a typed credential-recovery result to a generic fatal helper error. With that route fixed, the terminal can receive the classification it needs to display company sign-in guidance instead of an unexplained failure.

Token storage and renewal transactions are carried forward from alpha.15, so the lifecycle mechanism is unchanged and only the recovery presentation moved. Successful manual inference restoration has been observed. Complete production active renewal, idle-return behavior on both platforms and MCP recovery against the utility inventory still require their own evidence, because a source-level fix and a manual observation are each narrower than a timed run on installed packages.

## How to read the claims

The course uses four labels, and they are ordered by how much of the real system each one touches. **Implemented** means reviewed source contains the behavior; it says nothing about what is installed anywhere. **Observed** means a dated check saw the behavior, on that date and in that configuration. **Package verification** binds checks to the downloaded executable, which closes the gap between source and what a user actually runs. **Production lifecycle acceptance** exercises the real identity and gateway path across the relevant expiration and recovery boundaries, which is the only label that speaks to renewal and revocation over time. A claim carrying an earlier label should not be read as if it carried a later one.

No full Rust workspace pass, independent release review, Windows distribution or blanket immediate revocation is claimed. Public examples use fictional identities and endpoints. Credentials, private logs and operational identifiers stay outside this site.

## Primary references

These references explain protocols and product capabilities. The deployment observations above come from the reviewed implementation and operator checks; they describe one deployment on particular dates and are not guarantees made by the vendor.

| Reference | Topic |
| --- | --- |
| [Gateway authentication layers](https://portkey.ai/docs/product/mcp-gateway/authentication) | Client-to-gateway and gateway-to-server authentication |
| [Gateway CAS login](https://portkey.ai/docs/product/mcp-gateway/authentication/cas) | Organizational sign-in for the SCM gateway |
| [CIE Directory Sync](https://portkey.ai/docs/product/enterprise-offering/org-management/directory-sync/cie-directory-sync) | Provisioning and consuming workspace context |
| [MCP tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) | Tool discovery, schemas and results |
| [Native OAuth (RFC 8252)](https://www.rfc-editor.org/info/rfc8252/) | System browser and native client requirements |
| [PKCE (RFC 7636)](https://www.rfc-editor.org/info/rfc7636/) | Authorization-code proof binding |
| [Refresh (RFC 6749 section 6)](https://www.rfc-editor.org/rfc/rfc6749#section-6) | Renewal within the granted scope |
| [Resource indicators (RFC 8707)](https://www.rfc-editor.org/info/rfc8707/) | Resource-bound OAuth grants |
| [Protected resource metadata (RFC 9728)](https://www.rfc-editor.org/info/rfc9728/) | Discovery of resource authorization requirements |
| [Keycloak OIDC endpoints](https://www.keycloak.org/securing-apps/oidc-layers) | Issuer endpoints and token operations |
| [SCIM (RFC 7644)](https://www.rfc-editor.org/info/rfc7644/) | User and group provisioning |

The gateway authentication overview and MCP tool specification were rechecked on September 15, 2026. The other references retain their previously reviewed protocol or product context. Before copying any diagram from this course into another environment, verify that environment's deployed settings. The diagrams describe this case study's configuration, not protocol defaults.

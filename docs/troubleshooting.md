---
id: troubleshooting
title: "Troubleshooting by trust boundary"
sidebar_label: "Troubleshooting by trust boundary"
---

> **Architecture correction — September 14, 2026:** The required harness sends both inference and remote MCP traffic through Prisma AIRS AI Gateway. Earlier direct-MCP flows and their acceptance records describe a divergent implementation. They do not validate the required gateway/CAS path. Read [System architecture](./architecture.md) for the corrected contract.

## Find the first failed boundary

“Login failed” can mean the browser never reached Keycloak, the callback failed validation, the OS store rejected persistence, or the resource refused authorization after a successful login. Start with the observed stage and expected contract.

```mermaid
flowchart LR
    accTitle: Diagnose the first failed trust boundary
    accDescr: Check endpoint reachability, browser login and credential persistence, token validity, action and object permission, then backend access and tool or content-policy behavior.
    symptom["Request failed"] --> reach{"Reached intended service?"}
    reach -->|"No"| network["Check DNS, TLS and endpoint"]
    reach -->|"Yes"| login{"Browser flow and credential commit succeeded?"}
    login -->|"No"| identity["Check callback, issuer and native store"]
    login -->|"Yes"| token{"Resource accepts credential?"}
    token -->|"No"| claims["Check audience, client, time and signature"]
    token -->|"Yes"| policy{"Requested action and object allowed?"}
    policy -->|"No"| grants["Check role, scope and explicit binding"]
    policy -->|"Yes"| backend["Check backend read, content policy and tool adapter"]
```

The sequence is a diagnostic aid, not a claim that every service uses the same error format. MCP transport errors, JSON-RPC tool errors, gateway policy errors, and OAuth token-endpoint errors must be interpreted in their own context.

## Symptoms and discriminating evidence

| Symptom | Likely boundary | First useful check |
| --- | --- | --- |
| Browser never opens | Native application/session | Authorization URL presentation and desktop availability |
| Callback rejected | OAuth client | Expected state, issuer, redirect and current attempt |
| Login succeeds but cannot save credentials | OS store | Desktop/keyring session and persistence error category |
| MCP login requests unrelated permissions | OAuth scope selection | Gateway scopes from gateway discovery; upstream read scopes belong to the gateway integration |
| Authorization rejects duplicate resource | Discovery/configuration | Check the failing OAuth leg and its discovered resource before adding an explicit override |
| MCP works until access-token expiry | OAuth refresh | Granted scopes versus refresh request; affected RMCP added ungranted `offline_access` |
| npm upgrade still runs an old command | Local installation | Resolved executable, npm prefix and legacy PATH symlink |
| MCP 401 | Token validation | Intended resource audience, issuer, client, expiry, signature |
| Gateway MCP 403 | Gateway authorization | CAS identity, directory membership and workspace/integration access |
| Upstream MCP 403 | Resource authorization | Human invoke/read roles, issued scopes and subject binding |
| Generic unavailable object | Object authorization or absent object | Authorized workspace/profile context; do not enumerate foreign IDs |
| Inference succeeds but model never calls MCP | Tool exposure/selection | Actual outbound function definitions and returned call events |
| Direct tool call works but model call fails | Harness/gateway adapter | Namespace mapping, arguments and preserved call ID |
| Backend denies MCP's request | PAN IAM/service credential | Correct environment/account and required read permission |
| SAML succeeds but gateway identity resolution fails | CAS/directory join | NameID, consumed username attribute and directory lookup field |
| CIE membership remains stale | Provisioning/consumer | Last successful reconciliation, warnings and consumer refresh |
| Old token works after logout | Token lifecycle | Token expiry and resource-side binding state |

Never paste a real JWT into a public decoder or issue. A decoded payload is also untrusted until the signature and context checks pass. Capture the comparison result—such as “audience mismatched”—rather than the credential.

Do not repair a failed gateway route by changing the harness destination to the upstream resource. Check the gateway integration, upstream-host allowlist and upstream OAuth callback/client configuration.

## Worked incident: tools disappear

In the historical alpha.13 incident, the user could obtain a model response and a direct MCP probe listed eight tools. That narrows the failure: TLS, basic inference, and basic MCP access work. Inspecting the inference request reveals tool declarations wrapped in a namespace that the gateway path drops. The model therefore has no callable functions.

The inference adapter repair flattens names at the gateway boundary and restores namespaced call events. This historical diagnosis does not prove that MCP transport used the gateway; alpha.14 also needs correlated gateway MCP ingress and upstream requests. Acceptance then verifies a model-selected tool call and its actual result. Adding more Keycloak roles would not repair a missing schema.

## Worked incident: login works, refresh fails

Initial OAuth and tool reads succeeded, but real expiry testing exposed a refresh rejection. RMCP 3.2 added `offline_access` because discovery advertised it, even though the original grant contained only read scopes. Server support for a scope does not grant it to this client. The harness correction retains `offline_access` only when it was actually granted; its HTTP regression test covers both cases and checks the resource parameter. Final concurrent expiry acceptance still belongs to the exact installed release. Adding broader permissions would conceal the defect.

## Worked incident: authenticated identity cannot be found

CAS accepts a SAML assertion, but the gateway cannot resolve a provisioned user. The directory has `alex@example.com`; the consumed assertion field contains `alex`. In the related case study, correcting NameID alone was insufficient because a second `username` attribute was also consumed. Mapping both according to the configured contract resolved the consent step.

That proves identity formatting at that step. It does not prove cross-realm account linking, downstream MCP authorization, or complete end-to-end tool execution. Preserve those as separate checks.

## A useful incident record

Record time, environment, source/image version, request correlation, failing boundary, sanitized expected/observed values, and the smallest reproducer. Record the post-fix positive and negative outcomes. Exclude tokens, full backend responses, private prompt content, and operational secret locations from public reports.

Continue with [Labs and answer keys](./labs.md). Internal case-study provenance: [Implementation status and public sources](./evidence.md).

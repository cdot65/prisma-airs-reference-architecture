---
id: labs
title: "Labs and answer keys"
sidebar_label: "Labs and answer keys"
---

## Start with tabletop labs

These exercises use fictional records. They need no tenant, production login, or cloud credential. Each has an observable deliverable and an answer key. Treat the optional live lab as a separate integration exercise after the concepts are clear.

### Lab 1 — Put the arrows in the right place

**Time:** 15 minutes. **Objective:** distinguish inference from tool execution.

Draw Alex, the harness, Keycloak, AI Gateway, AIRS scanner, model, MCP server, PAN management API, and CIE. Label the issuer of each token and its receiver. Include CAS login and CIE workspace resolution on the gateway-facing MCP authorization path.

**Deliverable:** a diagram and a one-paragraph explanation of who executes `get_gateway_config`.

**Answer key:** the harness sends both inference and MCP to AI Gateway. The model emits a function call; the gateway proxies the MCP request using its own upstream user token. The MCP server authorizes the read and calls PAN APIs using separate backend credentials. CAS/CIE supports gateway-facing identity and workspace access. The harness never receives the gateway's upstream refresh token.

### Lab 2 — Evaluate an authorization matrix

**Time:** 20 minutes. **Objective:** apply all conditions, not just one grant.

Assume the server expects the learning issuer, the MCP resource audience, gateway upstream client `learning-gateway-mcp`, and a valid current signature. Alex's server binding permits only `workspace-learning` and `profile-learning`. The policy grants both read scopes.

| Case | Credential/permission condition | Requested action |
| --- | --- | --- |
| A | Correct token, invoke, gateway.read and airs.gateway.read | Read configuration in workspace-learning |
| B | Same as A, but inference audience | Read configuration in workspace-learning |
| C | Correct token and gateway scope, no gateway.read role | Read configuration in workspace-learning |
| D | Same as A | Read configuration in workspace-finance |
| E | Correct token, invoke, profiles.read and airs.profiles.read | Read profile-learning |
| F | Same as E | Read profile-finance |
| G | Correct issuer and audience, disallowed client | List workspaces |
| H | All read grants, no subject binding | List profiles |

**Deliverable:** allow/deny and the first failed condition for each row.

**Answer key:** A and E allow. B fails audience validation. C fails the effective grant intersection. D and F fail resource binding. G fails client validation. H fails subject binding. A role on another resource client cannot repair C.

### Lab 3 — Debug a directory join

**Time:** 20 minutes. **Objective:** distinguish login success from account resolution.

The provisioned user has `Mail=alex@example.com`. The accepted SAML assertion has NameID `alex@example.com`, but the CAS profile consumes `username=alex`. The gateway cannot resolve the user. A separate Redtail user also has email `alex@example.com`.

**Deliverable:** identify the mapping defect and explain why email equality does not prove that the two realm accounts can be merged.

**Answer key:** inspect the consumed username attribute as well as NameID. Align the configured lookup contract with the owned directory record. OIDC identity includes issuer and subject, so shared email alone is insufficient account-linking evidence. Verify unique ownership and a deliberate correlation process. Do not alter the harness's native audience to work around this lookup failure.

### Lab 4 — Race a refresh on paper

**Time:** 15 minutes. **Objective:** reason about refresh rotation and persistence.

In the inference credential-store exercise, two helper processes load generation 4. Helper A consumes the refresh token and receives generation 5. Before it commits generation 5, the process crashes.

**Deliverable:** a sequence diagram that includes locking, a pending record, and recovery.

**Answer key:** only one helper may attempt refresh for the binding at a time. A pending record must survive interruption. The second process reloads under the lock; an unresolved pending state requires login. Retrying the consumed generation-4 refresh token is not a safe recovery strategy. On normal success, commit generation 5 before using or sharing its access token.

### Lab 5 — Explain what a read proves

**Time:** 15 minutes. **Objective:** distinguish configuration evidence from execution evidence.

An MCP result says the saved route references an AIRS profile with prompt-injection protection. There is no runtime correlation ID or scanner verdict in the result.

**Deliverable:** write a two-sentence answer to Alex that stays within the evidence.

**Answer key:** “The permitted configuration references an AIRS profile with prompt-injection protection. This inventory result does not show whether a particular request was scanned or what verdict it received.” A runtime claim requires correlated execution evidence.

### Lab 6 — Measure revocation honestly

**Time:** 20 minutes. **Objective:** separate independent propagation clocks.

An access token expires at 12:05. The user signs out at 12:01. A CIE sync is scheduled for 12:15. MCP subject policy is removed and finishes rolling out at 12:02.

**Deliverable:** a timeline identifying which control ends upstream MCP access and which observations remain unknown.

**Answer key:** the upstream server rejects requests for the removed binding once all replicas load it, including requests proxied by the gateway. Local harness logout alone does not revoke the gateway's upstream refresh token or an issued JWT. Gateway workspace deprovisioning has a separate CIE/session propagation delay that must be measured. Either effective denial boundary can stop access.

## Optional isolated integration lab

This exercise needs alpha.14 with native MCP, isolated test identities and CIE workspace mapping, an upstream MCP deployment with an explicit fixture binding, dedicated read-only PAN credentials, and gateway inference and MCP routes. A model-only mock can teach the protocol but does not establish PAN integration acceptance.

Do not use the retired fixture from the implementation's acceptance record. Create a new fixture under an explicit test plan in the isolated environment. No commands in this curriculum mutate the production lab.

| Step | Action | Required observation |
| --- | --- | --- |
| 1 | Request the gateway MCP URL without a credential | Gateway 401 and protected-resource metadata challenge |
| 2 | Complete native gateway OAuth with CAS/Keycloak | Correct directory identity, workspace access and native-store persistence |
| 3 | Complete gateway-managed upstream OAuth, initialize and list tools | Correlated gateway/upstream requests and eight tools for the intended fixture |
| 4 | Run all permitted list/detail reads | Only bound objects and projected fields returned |
| 5 | Try wrong audience/client and missing grants | Authentication/authorization denial at expected boundary |
| 6 | Ask the running-example question | Model-selected tool calls, preserved call IDs, grounded answer |
| 7 | Exercise both token lifecycles | Native gateway-facing refresh and separately observed gateway-managed upstream refresh |
| 8 | Remove fixture policy and reconcile | Existing unexpired token denied by all serving replicas |
| 9 | Revoke session and remove fixture | No lingering fixture grants, credentials, or policy entries |

Collect only outcomes, timestamps, correlation IDs and synthetic object labels in public evidence. Full token values and backend configuration never belong in the lab report. CAS/CIE identity-resolution, workspace authorization and deprovisioning are required checks for this route; direct native-to-upstream tests cannot substitute for them.

## Assessment rubric

Award two points each for correct component ownership, token separation, complete authorization intersection, honest CIE evidence boundaries, and a diagnosis grounded in observed results. Passing is 8/10 with no audience-reuse or unverified cross-realm-linking claim. This is a course exercise, not a product certification.

Use [System architecture](./architecture.md), [Read-only MCP authorization](./mcp.md), and [Refresh revocation and identity changes](./lifecycle.md) to review missed concepts.

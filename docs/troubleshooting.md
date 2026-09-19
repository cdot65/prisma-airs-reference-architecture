---
id: troubleshooting
title: "Troubleshooting by trust boundary"
sidebar_label: "Troubleshooting by trust boundary"
---

## Locate the failing step

Something failed. Before changing anything, decide which boundary it failed at. Follow the request from the harness to the intended gateway listener, then to the model or mcp server 1, and ask at each hop whether the problem is authentication (who are you), authorization (what may you do), argument validation (is the input acceptable) or tool execution (did the work succeed). Those are four different questions, and the fixes for them do not overlap: a new login does not repair a bad argument, and a corrected argument does not add a missing grant.

```mermaid
flowchart LR
    accTitle: Diagnose inference and local MCP utility failures
    accDescr: Identify the failing listener, check network reachability and credentials, inspect gateway and server grants, and then validate utility arguments and local execution. No downstream management API appears in the utility path.
    failure["Request failed"] --> destination{"Which gateway listener?"}
    destination --> inference["Inference: credential, route and content policy"]
    destination --> mcp["MCP: gateway login and integration access"]
    mcp --> upstream["Gateway upstream OAuth grant"]
    upstream --> grant["mcp server 1 token, roles and subject binding"]
    grant --> input["Tool name and argument schema"]
    input --> execution["Local utility execution and result"]
```

## Diagnose inside the selected environment

In the mcp test channel, enter `/doctor` for the connection-health dashboard. **Refresh diagnostics** refreshes local diagnostics without making an inference request. A native-store availability check does not prove that every saved credential is readable. **Verify gateway access** asks for confirmation; only **Send connectivity check** sends the small inference probe. It may consume quota and appear in gateway logs, but sends no local files, conversation or tools. The equivalent shell commands are `airs --environment work doctor` and `airs --environment work doctor --verify-access`.

**Restore company sign-in** renews inference SSO for the same verified identity. Workspace-key replacement remains a shell action: leave the session, run `airs --environment work login --with-api-key`, and reopen the same environment. Use the name displayed by the session; local names do not need to match gateway workspace names.

For MCP, select the affected connection through `/doctor` or `/mcp`. Choose **Sign in** for expired or absent credentials, or **Reconnect and verify** for fresh initialization and tool discovery. After connection changes choose **Start new conversation**; history and the unsent draft remain saved and nothing is replayed. A tool inventory is still weaker evidence than a completed authorized tool call.

A workspace key being saved is not evidence of an allowed model route. Check the key's workspace, inference permission and default saved config with your administrator. Recreating a local environment does not fix a gateway route or policy denial. An unavailable native credential service does not necessarily mean a locked store: check its availability and any OS authorization prompt in the same user session. If cleanup is pending, restore service access and retry the displayed environment-specific login or logout; retain both the original and cleanup error categories in a sanitized report.

## Symptoms and useful checks

Most of the checks below test a boundary rather than a component, so the first question is usually whether the request reached the place you think it reached.

| Symptom | First useful check |
| --- | --- |
| Inference fails after about 30 minutes idle | Whether the inference grant is still renewable; use the company sign-in prompt |
| Alpha.15 shows the generic bound-credential fatal error after idle | Enter `/signin`; alpha.16 includes the provider-routing correction for automatic guidance |
| Login completes but credential save fails | Native Keychain or Secret Service availability and the reported storage category |
| Browser cannot reach localhost | Use the current MCP flow's hidden callback input over SSH, or verify callback routing for browser-only inference flows |
| Gateway denies workspace access after CAS login | CIE group-to-workspace mapping and the workspace Members view |
| Gateway MCP login succeeds but upstream needs consent | The separate gateway-held upstream OAuth grant |
| mcp server 1 rejects the token | Issuer, signature, resource audience, allowed client and time limits |
| mcp server 1 rejects authorization | `invoke`, `utilities.use` scope and role, and the subject's policy binding |
| Resources list is empty | Inspect `/mcp` for tools; resources and tools are separate capabilities |
| The model never selects a visible tool | Actual inference tool declarations and model-returned function calls |
| `calculate` fails for division by zero | Correct the input; a new login does not repair arithmetic |
| `decode_base64` rejects text | Canonical padding and valid decoded UTF-8 |
| `current_time` differs from the workstation | The tool reports the MCP server's clock |
| An upgrade still shows an older version | Resolved executable, npm prefix and `PATH` ordering |

Tool execution has no downstream management API to diagnose, which removes a whole class of failure from the utility path. The server's authentication layer can still depend on trusted signing-key retrieval, so DNS or issuer-key failures are real, but they belong to the identity boundary rather than to the tool.

## The alpha.15 idle-return incident

The maintainer returned after about 30 minutes idle and received a generic fatal credential-helper error. Manual `/signin` completed, preserved the same verified identity and conversation, and allowed the next inference reply. The credential path was fine; what failed was the guidance. The normal AIRS provider dispatch had bypassed the typed recovery handler, so the terminal never received the classification it uses to show sign-in guidance. Alpha.16 corrects that route so an expired or otherwise non-renewable sign-in reaches the terminal's guidance. A real helper integration test failed before the change and passes afterward; all 78 provider tests pass. Be precise about what that evidence covers: it establishes the source correction. It does not prove every production token-renewal case.

## Browser callbacks on a remote machine

A callback to `127.0.0.1` reaches the browser's computer, which may differ from the harness host. For MCP, the in-session sign-in dialog supports opening the authorization URL on another computer and pasting the complete callback URL into its hidden callback input. The shell fallback is `airs --environment work mcp login service-now --no-browser`. Keep that attempt open; never paste a callback into the agent conversation or a support report. A correctly routed HTTP callback can also finish the same attempt.

For inference, use **Use device authorization** over SSH when your issuer supports it. If using the browser callback flow instead, the callback must reach the harness host, which can require a correctly bound tunnel. These are different flows; MCP manual callback support does not imply inference device authorization support at every issuer.

The callback window is five minutes in the tested MCP flow. An expired tab cannot complete a later attempt because its state and verifier belong to the earlier one. The PKCE verifier and native credential store remain on the harness host. Verify native completion and an actual request after browser consent; the success page alone is insufficient.

## Capture a useful report

Record the package version, affected environment, approximate idle time, failing step and sanitized error. For MCP, include the actual tool name and whether it completed. Use request IDs to correlate gateway and server observations, since the same request looks different from each side. Never include tokens, refresh grants, client secrets or private tool input in public reports.

A model's statement that tools are “working” is weaker evidence than a completed MCP call with a valid result, because the model can only report what it was told, and a returned function call is a request rather than a result.

Continue with [Labs and answer keys](./labs.md).

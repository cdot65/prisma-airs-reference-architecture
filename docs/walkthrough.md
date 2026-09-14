---
id: walkthrough
title: "End-to-end question walkthrough"
sidebar_label: "End-to-end question walkthrough"
---

## One question, two gateway listeners

> Which gateway configuration can I use, and what security protections are attached to it?

The required path sends inference and actual MCP protocol calls through AI Gateway. Assume the user has gateway access, the upstream integration is provisioned to the workspace, and its required upstream OAuth consent is complete. These are prerequisites to test, not established results from the earlier direct-path experiment.

```mermaid
sequenceDiagram
    accTitle: Required model and tool workflow through AI Gateway
    accDescr: The harness discovers and calls MCP tools through the gateway. Inference also crosses the gateway. Only the gateway connects to the model and upstream MCP server, applying the configured controls on each path.
    actor user as Alex
    participant harness as airs-harness
    participant gateway as AI Gateway inference and MCP listeners
    participant scanner as Configured AIRS checks
    participant model as Upstream model
    participant upstream as Upstream Prisma AIRS MCP server
    participant management as PAN management APIs
    user->>harness: Explain my gateway configuration and protections
    harness->>gateway: MCP initialize and tools/list with gateway credential
    gateway->>gateway: Validate user, workspace and integration access
    gateway->>upstream: Discover tools with gateway-managed upstream credential
    upstream-->>gateway: Authorized tool schemas
    gateway-->>harness: Permitted MCP tool catalog
    harness->>gateway: Inference request with conversation and flat tool schemas
    gateway->>scanner: Configured inference input checks
    scanner-->>gateway: Verdict
    gateway->>model: Authorized inference request
    model-->>gateway: Proposed function call
    gateway->>scanner: Configured inference output checks
    scanner-->>gateway: Verdict
    gateway-->>harness: Permitted function call
    harness->>harness: Restore namespace and apply local dispatch policy
    harness->>gateway: MCP tools/call with gateway MCP credential
    gateway->>gateway: Authorize integration and tool, then record request
    gateway->>scanner: Configured MCP request checks
    scanner-->>gateway: Verdict
    gateway->>upstream: Proxy tool call using upstream credential
    upstream->>upstream: Enforce backend object permissions
    upstream->>management: Authorized configuration read
    management-->>upstream: Configuration data
    upstream-->>gateway: Bounded tool result
    gateway->>scanner: Configured MCP response checks
    scanner-->>gateway: Verdict
    gateway-->>harness: Permitted MCP response
    harness->>gateway: Continue inference with tool result
    gateway->>model: Continue under inference policy
    model-->>gateway: Explanation grounded in results
    gateway-->>harness: Permitted final answer
    harness-->>user: Explanation and evidence limits
```

The scanner arrows identify where configured controls belong. Their presence in a diagram does not prove a particular rule or structured field is scanned. Acceptance must verify the actual policies and verdicts attached to both request paths. Subsequent inference exchanges abbreviate the same configured enforcement shown on the first exchange.

## What proves the route

| Evidence | Required observation |
| --- | --- |
| Harness destinations | Inference and MCP listener URLs belong to the approved AI Gateway deployment |
| MCP request | Gateway receives initialize, tools/list and tools/call |
| Upstream request | Gateway initiates the connection and supplies upstream authentication |
| Credentials | Harness holds gateway credentials; upstream OAuth tokens remain gateway-managed |
| Denial | Gateway rejects an unauthorized integration/tool without a successful upstream operation |
| Lifecycle | Gateway-facing and upstream token renewal work independently |
| Final answer | Model used actual returned tool results |

Reading a security profile proves configuration visibility, not execution of its protections. A direct MCP probe proves upstream reachability, not gateway mediation. A model response without a tool event does not prove configuration inspection.

Continue with [Implementation status and public sources](./evidence.md). The labs now exercise this required path. Their instructions are learning exercises, not completed deployment acceptance.

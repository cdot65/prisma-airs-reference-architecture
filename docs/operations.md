---
id: operations
title: "Deployment and operations"
sidebar_label: "Deployment and operations"
---

## Deliver a service without mixing identities

The MCP deployment separates the identity that builds an image, the identity that retrieves runtime secrets, the service accounts that call PAN APIs, and the human identity making an MCP request. Each exists for a different boundary.

```mermaid
flowchart LR
    accTitle: MCP delivery and runtime separation
    accDescr: CI publishes an immutable image, Argo reconciles deployments, Conjur and External Secrets supply namespace-authorized secrets, ingress routes public requests, and Prometheus scrapes internal metrics.
    source["Reviewed MCP source"] --> ci["Dedicated CI runner"]
    ci -->|"Build, scan and publish"| registry["Private image registry"]
    declaration["GitOps declarations"] --> argo["Argo CD"]
    argo -->|"Reconcile image and policy"| deployment["MCP deployment"]
    registry -->|"Pull immutable image"| deployment
    conjur["Conjur"] -->|"Namespace-authorized secret reads"| eso["External Secrets Operator"]
    eso -->|"Runtime secret material"| deployment
    ingress["HTTPS ingress"] -->|"MCP and metadata paths"| deployment
    prometheus["Prometheus"] -->|"Internal scrape"| deployment
```

This diagram describes the recorded deployment pattern. The educational GitHub Pages site is a separate static publication with no connection to these runtime secrets. A reader should be able to explore the curriculum without authenticating to the lab infrastructure.

## Three kinds of configuration

| Kind | Example | Delivery |
| --- | --- | --- |
| Public trust/configuration | Issuer URL, resource URL, allowed client IDs | Deployment configuration |
| Authorization policy | Subject-to-workspace/profile bindings | Versioned policy with rollout |
| Secret | Backend client secret or cursor signing key | Secret manager and namespace-specific retrieval |

The reviewed service loads its policy at startup. A policy update must reach all replicas before the change is effective everywhere. Hashed policy ConfigMaps help trigger a workload rollout. A Git commit is desired state; the running replicas and a negative authorization probe establish applied state.

Development has one replica and production two in the recorded acceptance. The server uses a nonroot process, a read-only filesystem, network restrictions, and no mounted Kubernetes API token. Public ingress exposes MCP and metadata paths; health, readiness, and metrics remain internal.

## Health is layered evidence

```mermaid
flowchart LR
    accTitle: Layers of acceptance evidence
    accDescr: Process health is followed by configuration readiness, OAuth resource access, authorized backend reads, model-selected tool workflows, and lifecycle checks.
    process["Process is alive"] --> config["Configuration is ready"]
    config --> oauth["Valid token reaches resource"]
    oauth --> tool["Authorized backend read succeeds"]
    tool --> agent["Model selects and completes tool workflow"]
    agent --> lifecycle["Refresh and revocation behave correctly"]
```

Each step answers a stronger question. A green readiness probe does not establish backend authorization. A successful direct `tools/call` does not establish that the model sees the tool schema. Successful metrics scraping does not establish alert notification delivery.

Recorded acceptance includes all eight tools, authorization negatives, native Linux and Apple Silicon login/tool cycles, rotating refresh concurrency, a 30-minute production soak, namespace secret isolation, and a development recovery exercise. It does not establish Windows direct MCP acceptance, public Internet reachability, or alert receiver delivery.

## Recovery should restore an understood state

Pin images by accepted digest. For a bad rollout, restore the known accepted digest and verify serving replicas before checking the user path. For missing runtime secrets, inspect the ExternalSecret's source identity and reconciliation result without printing the secret. For an authorization regression, compare the active policy version and token generation.

The recorded development recovery intentionally broke an image pull, restored the accepted image, and verified recreation of a deleted development secret. That does not mean every disaster-recovery scenario or backup restoration was exercised.

The optional integration lab in [Labs and answer keys](./labs.md) collects sanitized outcome evidence. See [Implementation status and public sources](./evidence.md) for the public evidence summary; detailed operational receipts remain outside this publication.

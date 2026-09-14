---
id: start-here
title: "Start here"
sidebar_label: "Start here"
---

## The goal

Build an AI assistant that can explain the AI infrastructure a person is allowed to inspect. The assistant should use an approved model route, pass configured content checks, and retrieve configuration through tools that enforce the person's permissions.

Our running example is a platform engineer, Alex, asking:

> Which gateway configuration can I use, and what security protections are attached to it?

The answer requires more than a model. The Prisma AIRS Harness runs the conversation and tools on Alex's computer. Keycloak authenticates Alex and issues access tokens. Prisma AIRS AI Gateway receives both inference and MCP traffic, invokes configured inference checks, and proxies upstream MCP services. The `prisma-airs-mcp` upstream supplies bounded, authorized configuration reads. CIE Directory Sync and CAS support the gateway-facing MCP user and workspace authorization.

## What this course teaches

By the end, you should be able to trace one question from login through inference and tool execution, explain the client-held inference and gateway MCP credentials and the separate gateway-held upstream tokens, locate the service that makes each authorization decision, distinguish SCIM provisioning from SAML authentication, and investigate a failed request without exposing credentials.

You need basic familiarity with HTTP, JSON, command-line applications, and containers. OAuth, OIDC, SAML, SCIM, and MCP are introduced where they enter the story. The first labs use fictional records and need no tenant or production credentials. An optional integration lab requires an isolated, licensed environment and a maintainer-provided configuration.

## Read in this order

| Stage | Lesson | What you should be able to explain |
| --- | --- | --- |
| Orient | [System architecture](./architecture.md) | Components, boundaries, and two request paths |
| Understand the client | [Harness and agent execution](./harness.md) | Who calls the model and who executes tools |
| Understand identity | [Keycloak and token contracts](./keycloak.md) | Issuer, subject, client, audience, scopes, roles |
| Understand identity integration | [Cloud Identity Engine and provisioning](./cie.md) | Directory Sync, CAS, realm boundaries |
| Trace login | [Login from browser to authorized tools](./login.md) | Discovery, PKCE, callback, credential persistence |
| Trace inference | [AI Gateway and AIRS enforcement](./gateway.md) | Workspace routing and input/output checks |
| Trace tools | [Read-only MCP authorization](./mcp.md) | Resource filtering and backend credentials |
| Put it together | [End-to-end question walkthrough](./walkthrough.md) | One complete model/tool/model cycle |
| Maintain identity | [Refresh revocation and identity changes](./lifecycle.md) | Rotation, logout, delayed revocation |
| Operate | [Deployment and operations](./operations.md) | GitOps, secrets, health, recovery |
| Investigate | [Troubleshooting by trust boundary](./troubleshooting.md) | Evidence-driven diagnosis |
| Practice | [Labs and answer keys](./labs.md) | Demonstrated understanding |
| Review | [Glossary and misconceptions](./glossary.md) | Precise vocabulary |

Allow roughly three hours for the reading path and another two for the tabletop labs. These are editorial estimates, not measured learner completion times.

## How to read the evidence labels

**Implemented** describes the reviewed source. **Observed deployment** describes a dated live check. **Release acceptance** applies only to the exact installed package and its recorded lifecycle tests. The gateway and upstream proxy configuration is live; alpha.14 package acceptance is still in progress. [Implementation status and public sources](./evidence.md) records the current distinction and supersedes the earlier direct-route acceptance claims.

All example domains, subjects, workspaces, and user records in these lessons are fictional. Example identifiers illustrate the contract; they are not runnable configuration or signed credentials. Read [Implementation status and public sources](./evidence.md) for dated findings, limits, and primary references.

The most useful habit throughout the course is to ask two questions at every arrow: **what data crosses this boundary, and what authorizes the receiver to act?**

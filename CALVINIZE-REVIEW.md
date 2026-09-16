# Calvinize review: mcp server 1

This branch is staged for editorial review. Do not merge or dispatch the Pages
workflow until Calvin approves the voice and content. The live site remains on
main. Binary publication is a separate action.

Start with the [architecture](docs/architecture.md), [utility tools](docs/mcp.md),
and [question walkthrough](docs/walkthrough.md). Then review the
[lifecycle](docs/lifecycle.md), [troubleshooting](docs/troubleshooting.md), and
[labs](docs/labs.md). All 15 lessons, the landing page and the interactive
permission exercise have been updated for consistency.

The central example is multiplication plus the MCP server's UTC clock. Tool
execution is local to mcp server 1, which remains a remote service behind AI
Gateway. Public signing-key retrieval belongs to authentication; there is no
management-API leg in utility execution. Inference routing, CAS/CIE login and the
separate gateway-owned upstream OAuth grant remain in the architecture.

Review voice, pacing and examples. The behavior, tool names, utilities.use grant
and token boundaries are implementation constraints. Keep release verification
separate from incomplete production expiry acceptance.

Canonical lesson prose remains in the knowledge vault. Apply accepted prose
edits there and export them with the repository's export:vault command so the
content provenance stays valid. Source-file identities are retained even where a
lesson's display title changed. The mcp-server-1 CLI identifier and example URLs
are illustrative; this documentation revision does not rename saved credentials
or a deployed integration.

Validation covers the production build, 19 browser checks, all 18 Mermaid diagrams,
accessibility labels, navigation, mobile layout and the utility-grant simulation.

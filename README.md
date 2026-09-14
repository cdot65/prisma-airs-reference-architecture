# Prisma AIRS Reference Architecture

An independent educational site explaining how Prisma AIRS Harness, Keycloak, Prisma AIRS AI Gateway, Cloud Identity Engine, and an OAuth-protected read-only MCP server fit together.

**Site:** https://cdot65.github.io/prisma-airs-reference-architecture/

The course includes 15 lessons, 18 Mermaid diagrams, six tabletop labs with answer keys, an optional isolated integration lab, and an interactive authorization exercise. It explains the required gateway path for both inference and MCP, CAS/CIE workspace authorization, and separate gateway-managed upstream OAuth. Alpha.13 is the published direct-route baseline; alpha.14 gateway acceptance remains pending.

## Develop

Use Node 22, then:

```sh
npm ci
npx playwright install chromium
npm run check
npm start
```

`check` validates the publication snapshot, builds all Docusaurus routes, and checks the browser rendering, diagrams, mobile navigation, and authorization exercise. The site has no runtime service credentials or authentication dependency.

## Authoring and provenance

The Obsidian effort is the canonical course-authoring source. `content-manifest.json` explicitly selects each note by stable ID and relative path. No whole-vault export is performed. The public Git repository stores a reviewed, self-contained Markdown snapshot and can build without the vault.

```sh
npm run export:vault -- /absolute/path/to/your/vault
npm run check
```

The exporter removes vault frontmatter, converts selected wiki links to site links, rejects unknown links and private deployment references, and records source/output hashes in `content-provenance.json`. It preserves Mermaid fences. Edit the vault lesson and export again; do not manually edit generated Markdown without reconciling its source. External contributors can propose corrections through an issue or a PR; the maintainer incorporates accepted changes into the canonical notes and regenerates the snapshot.

Write each lesson around a learner outcome, an explained diagram, a concrete example, and an evidence boundary. Keep protocol facts, local implementation decisions, and proposed work distinguishable. Use fictional identities and endpoints in public content. Private operational receipts, local file paths, secrets, and tenant identifiers stay outside the selected notes.

## GitHub Pages

The repository uses a project Pages URL with `baseUrl: '/prisma-airs-reference-architecture/'`. The deployment workflow builds and verifies the snapshot on main, uploads the static output, and deploys through the `github-pages` environment. Pull requests run the same validation without publishing. Select **GitHub Actions** as the Pages source.

Sources: [Docusaurus Mermaid](https://docusaurus.io/docs/markdown-features/diagrams), [Docusaurus deployment](https://docusaurus.io/docs/deployment), and [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Scope

This is educational material, not a product distribution, production installer, or vendor certification. The case study's source and acceptance limits are described in the [evidence lesson](docs/evidence.md). All product names belong to their respective owners.

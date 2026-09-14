# Dependency review — September 14, 2026

Docusaurus core, classic preset, and Mermaid theme are pinned to 3.10.2. Mermaid is pinned to 11.17.2 with the compatible 0.1.9 ELK layout package; the theme imports that optional peer during compilation. The current 12.x Mermaid major is not used with the 0.1.x layout peer.

Compatible patched transitive dependencies are pinned through overrides: serialize-javascript 7.1.1, qs 6.16.0, lodash-es 4.18.1, and uuid 11.1.1 under sockjs. Sockjs uses the supported CommonJS `v4` export. Production compilation and browser checks verify this dependency combination.

The remaining npm audit report contains **18 high dependency entries**, all propagated from **two image-size 2.0.2 advisories**. There is no patched upstream image-size version available at this review date:

- [ICNS parser infinite loop](https://github.com/advisories/GHSA-w3rx-r6r6-pgpr)
- [JXL and HEIF parser infinite loops](https://github.com/advisories/GHSA-5p2g-fcmc-qvqq)

Docusaurus uses image-size during Markdown image processing at build time. This course contains no Markdown image inputs or user-upload endpoint; the content check rejects Markdown/MDX image tags. Its diagrams are authored Mermaid, and its only static image is an authored SVG brand mark. GitHub Pages serves the static build and does not run the Node build toolchain. These constraints limit exposure for this site; the dependency findings remain open and are not described as fixed.

Recheck the advisories and dependency tree before enabling lesson images or updating Docusaurus. Build and PR validation jobs have bounded execution time and no deployment credentials. The deploy job receives the separate Pages permissions only after validation succeeds.

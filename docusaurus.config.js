const config = {
  title: 'Prisma AIRS · Architecture Lab',
  tagline: 'Trace identity, inference, and tools from the first login to the final answer.',
  favicon: 'img/mark.svg',
  url: 'https://cdot65.github.io',
  baseUrl: '/prisma-airs-reference-architecture/',
  organizationName: 'cdot65',
  projectName: 'prisma-airs-reference-architecture',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  markdown: {mermaid: true, hooks: {onBrokenMarkdownLinks: 'throw'}},
  themes: ['@docusaurus/theme-mermaid'],
  presets: [['classic', {
    docs: {
      sidebarPath: './sidebars.js',
      routeBasePath: 'learn',
      editUrl: 'https://github.com/cdot65/prisma-airs-reference-architecture/edit/main/',
      showLastUpdateTime: false,
    },
    blog: false,
    theme: {customCss: './src/css/custom.css'},
  }]],
  themeConfig: {
    colorMode: {defaultMode: 'light', respectPrefersColorScheme: true},
    navbar: {
      title: 'AIRS / Architecture Lab',
      logo: {alt: 'Architecture Lab', src: 'img/mark.svg'},
      items: [
        {to: '/learn/start-here', label: 'Learn', position: 'left'},
        {to: '/learn/architecture', label: 'Architecture', position: 'left'},
        {to: '/learn/labs', label: 'Labs', position: 'left'},
        {to: '/learn/evidence', label: 'Evidence', position: 'left'},
        {href: 'https://github.com/cdot65/prisma-airs-reference-architecture', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {title: 'Follow the system', items: [
          {label: 'Architecture', to: '/learn/architecture'},
          {label: 'Login sequence', to: '/learn/login'},
          {label: 'One complete question', to: '/learn/walkthrough'},
        ]},
        {title: 'Practice and verify', items: [
          {label: 'Labs and answer keys', to: '/learn/labs'},
          {label: 'Troubleshooting', to: '/learn/troubleshooting'},
          {label: 'Sources and limits', to: '/learn/evidence'},
        ]},
      ],
      copyright: 'An independent educational case study. Product names belong to their respective owners. Examples use fictional identities and endpoints.',
    },
    tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3},
    mermaid: {theme: {light: 'neutral', dark: 'dark'}},
  },
};
export default config;

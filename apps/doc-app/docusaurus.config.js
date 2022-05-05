// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ngrx/lite',
  tagline: 'A Small And fast Redux Store',
  url: 'https://www.google.de',
  baseUrl: '/ngrx-lite/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'gernsdorfer',
  projectName: 'ngrx-lite',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/gernsdorfer/ngrx-lite/edit/master/apps/doc-app/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.png',
      navbar: {
        title: 'ngrx/lite',
        logo: {
          alt: 'ngrx/lite',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'installation',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://gernsdorfer.github.io/ngrx-lite/sample-app/#/',
            label: 'Demo',
            position: 'left',
            className: 'header-playground-link',
          },
          {
            href: 'https://stackblitz.com/github/gernsdorfer/ngrx-lite/tree/master/apps/stackblitz-ui',
            label: 'Playground-UI',
            position: 'left',
            className: 'header-playground-link',
          },
          {
            href: 'https://stackblitz.com/github/gernsdorfer/ngrx-lite/tree/master/apps/stackblitz-unit-test',
            label: 'Playground-Unit-Tests',
            position: 'left',
            className: 'header-playground-link',
          },
          {
            href: 'https://github.com/gernsdorfer/ngrx-lite',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/ngrx-lite',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/gernsdorfer/ngrx-lite',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/gernsdorfer',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ngrx/lite, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

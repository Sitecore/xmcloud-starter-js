/** @type {import('tailwindcss').Config} */

// "Decoloring" prose
const proseVars = [
    '--tw-prose-body',
    '--tw-prose-headings',
    '--tw-prose-lead',
    '--tw-prose-bold',
    '--tw-prose-counters',
    '--tw-prose-bullets',
    '--tw-prose-hr',
    '--tw-prose-quotes',
    '--tw-prose-quote-borders',
    '--tw-prose-captions',
    '--tw-prose-kbd',
    '--tw-prose-kbd-shadows',
    '--tw-prose-code',
    '--tw-prose-pre-code',
    '--tw-prose-pre-bg',
    '--tw-prose-th-borders',
    '--tw-prose-td-borders',
];

module.exports = {
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './**/globals.css',
    ],
    theme: {
        extend: {
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.2s ease-out',
            },
            backdropBlur: {
                xs: '2px',
            },
            backgroundImage: {
                'light-gradient':
                    'linear-gradient(to bottom, #ffffff 0%, rgba(0, 81, 255, 0) 100%)',
                'primary-gradient':
                    'linear-gradient(179.89deg, #0041CD 0.1%, rgba(0, 81, 255, 0) 115.08%)',
                'dark-gradient': 'linear-gradient(to bottom, #C1C1C1 0%, rgba(28, 28, 28, 0) 100%)',
                'img-primary':
                    'linear-gradient(to bottom, hsla(var(--colors-primary) / 90%), hsla(var(--colors-primary) / 60%)), var(--bg-img, url("/placeholder.svg"))',
                'img-secondary':
                    'linear-gradient(to bottom, hsla(var(--colors-secondary) / 90%), hsla(var(--colors-secondary) / 60%)), var(--bg-img, url("/placeholder.svg"))',
                'img-muted':
                    'linear-gradient(to bottom, hsla(var(--colors-muted) / 90%), hsla(var(--colors-muted) / 60%)), var(--bg-img, url("/placeholder.svg"))',
                'img-dark':
                    'linear-gradient(to bottom, hsla(var(--colors-foreground) / 90%), hsla(var(--colors-foreground) / 60%)), var(--bg-img, url("/placeholder.svg"))',
                'img-light':
                    'linear-gradient(to bottom, hsla(var(--colors-background) / 90%), hsla(var(--colors-background) / 60%)), var(--bg-img, url("/placeholder.svg"))',
                'img-accent':
                    'linear-gradient(to bottom, hsla(var(--colors-accent) / 80%), hsla(var(--colors-accent) / 60%)), var(--bg-img, url("/placeholder.svg"))',
            },
            blur: {
                xs: '2px',
            },
            container: {
                center: true,
            },
            fontFamily: {
                heading: 'var(--font-heading)',
                body: 'var(--font-body)',
                accent: 'var(--font-accent)',
            },
            fontSize: {
                '50-clamp': 'clamp(100px, calc(50 * 1vw), 400px)',
                '40-clamp': 'clamp(100px, calc(40 * 1vw), 500px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-links': theme('colors.brand.DEFAULT'),
                        ...proseVars.reduce((acc, key) => ({ ...acc, [key]: 'inherit' }), {}),
                    },
                },
            }),
            zIndex: {
                '-z-1': '-1',
            },
        },
    },
};

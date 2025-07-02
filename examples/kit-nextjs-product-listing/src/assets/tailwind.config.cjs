/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './globals.css',
    ],
    darkMode: ['class'],
    theme: {
        extend: {
            containers: {
                xs: '400px',
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
                '3xl': '1920px',
            },
            container: {
                center: true,
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0',
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                    to: {
                        height: '0',
                    },
                },
                meteor: {
                    '0%': {
                        transform: 'rotate(var(--angle)) translateX(0)',
                        opacity: '1',
                    },
                    '70%': {
                        opacity: '1',
                    },
                    '100%': {
                        transform: 'rotate(var(--angle)) translateX(-500px)',
                        opacity: '0',
                    },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                meteor: 'meteor 5s linear infinite',
            },
            backgroundImage: {
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
            zIndex: {
                '-z-1': '-1',
            },
        },
    },
    /* eslint-disable @typescript-eslint/no-require-imports */
    plugins: [
        require('tailwindcss-animate'),
        require('tailwindcss-scrim-gradients'),
        require('@tailwindcss/container-queries'),
        require('@tailwindcss/typography'),
    ],
    presets: [require('./brand-a.tailwind.preset.cjs')],
    /* eslint-enable @typescript-eslint/no-require-imports */
};

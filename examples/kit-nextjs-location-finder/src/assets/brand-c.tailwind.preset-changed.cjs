/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            ...require('./configs/width.tailwind.js').default,
            ...require('./configs/spacing.tailwind.js').default,
            ...require('./configs/skew.tailwind.js').default,
            ...require('./configs/screens.tailwind.js').default,
            ...require('./configs/opacity.tailwind.js').default,
            ...require('./configs/min-width.tailwind.js').default,
            ...require('./configs/max-width.tailwind.js').default,
            ...require('./configs/margin.tailwind.js').default,
            ...require('./configs/line-height.tailwind.js').default,
            ...require('./configs/letter-spacing.tailwind.js').default,
            ...require('./configs/height.tailwind.js').default,
            ...require('./configs/font-weight.tailwind.js').default,
            ...require('./configs/font-style.tailwind.js').default,
            ...require('./configs/font-size.tailwind.js').default,
            ...require('./configs/font-family.tailwind.js').default,
            ...require('./configs/figma-automations.tailwind.js').default,
            ...require('./configs/disabled.tailwind.js').default,
            ...require('./configs/colors.tailwind.js').default,
            ...require('./configs/border-width.tailwind.js').default,
            ...require('./configs/border-radius.tailwind.js').default,
            ...require('./configs/blur.tailwind.js').default,
            ...require('./configs/containers.tailwind.js').default,
        },
    },
};

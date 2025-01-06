/** @type {import('tailwindcss').Config} */

const {
    default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
        './src/layouts/**/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'what-we-do': "url('/what-we-do.png')",
                'contact-us': "url('/contact-banner.png')",
                milestone: "url('/about-us/milestone.png')",
                'find-more': "url('/about-us/find-more.png')",
            },
            content: {
                before: '"("',
                after: '")"',
            },
        },
    },
    plugins: [addVariablesForColors],
    darkMode: 'class',
};

function addVariablesForColors({ addBase, theme }) {
    let allColors = flattenColorPalette(theme('colors'));
    let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );

    addBase({
        ':root': newVars,
    });
}

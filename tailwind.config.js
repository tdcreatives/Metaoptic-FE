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
    safelist: [
        // Padding utilities
        { pattern: /^pl-(0|1|2|3|4|5|6|8|10|12|16|20|24)$/ },
        { pattern: /^pr-(0|1|2|3|4|5|6|8|10|12|16|20|24)$/ },
        { pattern: /^px-(0|1|2|3|4|5|6|8|10|12|16|20|24)$/ },
        { pattern: /^py-(0|1|2|3|4|5|6|8|10|12|16|20|24)$/ },
        // Margin utilities
        { pattern: /^mt-(0|1|2|3|4|5|6|8|10|12|16|20|24)$/ },
        { pattern: /^mb-(0|1|2|3|4|5|6|8|10|12|16|20|24)$/ },
        { pattern: /^mx-(0|1|2|3|4|5|6|8|10|12|16|20|24)$/ },
        { pattern: /^my-(0|1|2|3|4|5|6|8|10|12|16|20|24)$/ },
        // Spacing utilities
        { pattern: /^space-(x|y)-(0|1|2|3|4|5|6|8|10|12|16|20|24)$/ },
        // List utilities
        'list-disc',
        'list-none',
        'list-inside',
        'list-outside',
        // Text color utilities (for dynamic colors in HTML)
        { pattern: /^text-\[rgb\(/ },
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

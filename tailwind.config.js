/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./apps/**/*.{js,ts,jsx,tsx,mdx,vue,svelte}",
        "./packages/**/*.{js,ts,jsx,tsx,mdx,vue,svelte,html}",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("tailwindcss-animate")],
};

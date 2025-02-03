/** @type {import('tailwindcss').Config} */
module.exports = {
    // Only scan files that actually use Tailwind
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Map to Element's theme variables
                primary: 'var(--primary-color)',
                accent: 'var(--accent-color)',
            },
        },
    },
    // Prevent conflicts with Element's styles
    corePlugins: {
        preflight: false,
    },
};
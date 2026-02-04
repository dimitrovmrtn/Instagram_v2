/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ig-primary': '#000000',
                'ig-secondary': '#262626',
                'ig-link': '#0095f6',
                'ig-separator': '#363636',
                'ig-story-ring': '#d62976',
            }
        },
    },
    plugins: [],
}

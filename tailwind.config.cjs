/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			animation: {
				'breathe': 'breathe 2s ease-in-out infinite',
				'spin-slow': 'spin 8s linear infinite',
			},
			keyframes: {
				breathe: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' },
				}
			},
			backdropBlur: {
				xs: '2px',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
};

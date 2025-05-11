import gluestackPlugin from '@gluestack-ui/nativewind-utils/tailwind-plugin';

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'media',
	content: ['src/**/*.{tsx,jsx,ts,js}', 'src/components/**/*.{tsx,jsx,ts,js}'],
	presets: [require('nativewind/preset')],
	safelist: [
		{
			pattern:
				/(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background|indicator)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark|primary)/,
		},
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: 'rgb(var(--color-primary)/<alpha-value>)',
					50: 'rgb(var(--color-primary-50)/<alpha-value>)',
					100: 'rgb(var(--color-primary-100)/<alpha-value>)',
					200: 'rgb(var(--color-primary-200)/<alpha-value>)',
					300: 'rgb(var(--color-primary-300)/<alpha-value>)',
					400: 'rgb(var(--color-primary-400)/<alpha-value>)',
				},
				secondary: {
					DEFAULT: 'rgb(var(--color-secondary)/<alpha-value>)',
					50: 'rgb(var(--color-secondary-50)/<alpha-value>)',
					100: 'rgb(var(--color-secondary-100)/<alpha-value>)',
					200: 'rgb(var(--color-secondary-200)/<alpha-value>)',
					300: 'rgb(var(--color-secondary-300)/<alpha-value>)',
				},
				tertiary: {
					50: 'rgb(var(--color-tertiary)/<alpha-value>)',
					100: 'rgb(var(--color-tertiary-100)/<alpha-value>)',
					200: 'rgb(var(--color-tertiary-200)/<alpha-value>)',
					300: 'rgb(var(--color-tertiary-300)/<alpha-value>)',
				},
				error: {
					DEFAULT: 'rgb(var(--color-error)/<alpha-value>)',
					100: 'rgb(var(--color-error-100)/<alpha-value>)',
					200: 'rgb(var(--color-error-200)/<alpha-value>)',
					300: 'rgb(var(--color-error-300)/<alpha-value>)',
					400: 'rgb(var(--color-error-400)/<alpha-value>)',
				},
				success: {
					DEFAULT: 'rgb(var(--color-success)/<alpha-value>)',
					100: 'rgb(var(--color-success-100)/<alpha-value>)',
					200: 'rgb(var(--color-success-200)/<alpha-value>)',
					300: 'rgb(var(--color-success-300)/<alpha-value>)',
					400: 'rgb(var(--color-success-400)/<alpha-value>)',
				},
				warning: {
					DEFAULT: 'rgb(var(--color-warning)/<alpha-value>)',
					100: 'rgb(var(--color-warning-100)/<alpha-value>)',
					200: 'rgb(var(--color-warning-200)/<alpha-value>)',
					300: 'rgb(var(--color-warning-300)/<alpha-value>)',
					400: 'rgb(var(--color-warning-400)/<alpha-value>)',
				},
				info: {
					DEFAULT: 'rgb(var(--color-info)/<alpha-value>)',
					100: 'rgb(var(--color-info-100)/<alpha-value>)',
					200: 'rgb(var(--color-info-200)/<alpha-value>)',
					300: 'rgb(var(--color-info-300)/<alpha-value>)',
					400: 'rgb(var(--color-info-400)/<alpha-value>)',
				},
				typography: {
					DEFAULT: 'rgb(var(--color-typography)/<alpha-value>)',
					white: '#FFFFFF',
					gray: '#D4D4D4',
					black: '#181718',
				},
				outline: {
					DEFAULT: 'rgb(var(--color-outline)/<alpha-value>)',
					100: 'rgb(var(--color-outline-100)/<alpha-value>)',
					200: 'rgb(var(--color-outline-200)/<alpha-value>)',
					300: 'rgb(var(--color-outline-300)/<alpha-value>)',
					400: 'rgb(var(--color-outline-400)/<alpha-value>)',
				},
				background: {
					DEFAULT: 'rgb(var(--color-background)/<alpha-value>)',
					error: 'rgb(var(--color-background-error)/<alpha-value>)',
					warning: 'rgb(var(--color-background-warning)/<alpha-value>)',
					muted: 'rgb(var(--color-background-muted)/<alpha-value>)',
					success: 'rgb(var(--color-background-success)/<alpha-value>)',
					info: 'rgb(var(--color-background-info)/<alpha-value>)',
					light: '#FBFBFB',
					dark: '#181719',
				},
				indicator: {
					primary: 'rgb(var(--color-indicator-primary)/<alpha-value>)',
					info: 'rgb(var(--color-indicator-info)/<alpha-value>)',
					error: 'rgb(var(--color-indicator-error)/<alpha-value>)',
				},
			},
			fontFamily: {
				heading: ['Satoshi-Bold'],
				body: ['Satoshi-Regular'],
				mono: ['Satoshi-Light'],
				satoshi: ['Satoshi', 'sans-serif'],
			},
			fontWeight: {
				extrablack: '950',
			},
			fontSize: {
				'2xs': '10px',
			},
			boxShadow: {
				'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
				'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
				'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
				'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
				'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
				'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
				'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
				'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
				'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
			},
		},
	},
	plugins: [gluestackPlugin],
};

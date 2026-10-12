/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      white: '#ffffff',
      lavender: '#d9cef2',
      peach: '#f4c7aa',
      primary: { 50: '#f7f9f6', 100: '#e5f2e9', 200: '#ccebd9', 300: '#9aebbb', 400: '#79efb4', 500: '#42c38c', 600: '#287758', 700: '#225543', 800: '#173e32', 900: '#0d3026', 950: '#0d2920' },
    },
    fontFamily: {
      sans: ['Manrope', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.75rem', '1rem'],
      sm: ['0.875rem', '1.25rem'],
      base: ['1rem', '1.75rem'],
      lg: ['1.125rem', '2rem'],
      xl: ['1.25rem', '2.125rem'],
      '2xl': ['1.5rem', '2rem'],
      '3xl': ['1.875rem', '2.375rem'],
      '4xl': ['2.25rem', '2.75rem'],
      '5xl': ['3rem', '3.5rem'],
      '6xl': ['3.75rem', '4.25rem'],
    },
  },
};

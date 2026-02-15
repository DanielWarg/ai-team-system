import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#00d4ff',
          bright: '#00e5ff',
        },
        orange: {
          DEFAULT: '#ff6b35',
          bright: '#ff7f50',
        },
      },
    },
  },
  plugins: [],
}
export default config

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        oakscale: {
          dark: "#004236",    // Deep Forest Green
          emerald: "#006d5b", // Emerald/Seafoam Accent
          cream: "#f9f7f2",   // Off-white Background
        },
      },
    },
  },
  plugins: [],
};
export default config;

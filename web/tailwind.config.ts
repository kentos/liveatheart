import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-albert)"],
      },
    },
  },
  plugins: [],
} satisfies Config;

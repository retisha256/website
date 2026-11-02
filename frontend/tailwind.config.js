/** Colours come from CSS variables so the CMS "Site settings" theme colours apply live. */
const channel = (name) => `rgb(var(${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.ts", "../templates/**/*.html"],
  theme: {
    extend: {
      colors: {
        canvas: channel("--c-bg"),
        ink: channel("--c-ink"),
        accent: channel("--c-accent"),
        muted: channel("--c-muted"),
        line: "#E2E8F0",
        mist: "#EEF1F5",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,25,47,.04), 0 8px 24px -12px rgba(10,25,47,.12)",
        lift: "0 2px 4px rgba(10,25,47,.05), 0 18px 36px -16px rgba(10,25,47,.22)",
      },
      maxWidth: { page: "72rem" },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.html", "./static/src/**/*.ts", "./static/js/**/*.js"],
  theme: { extend: { colors: { "karya-lime": "#c8ff4d", "karya-night": "#0b0c10" } } },
  plugins: [],
};

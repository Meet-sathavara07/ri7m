/** @type {import('tailwindcss').Config} */
const colors = require("./src/constants/Colors");

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
     fontSize: {
         xs: [10, { lineHeight: 1.5, letterSpacing: -0.011 }],
         sm: [12, { lineHeight: 1.5, letterSpacing: -0.011 }],
         base: [14, { lineHeight: 1.5, letterSpacing: -0.011 }],
         md: [16, { lineHeight: 1.5, letterSpacing: -0.011 }],
         lg: [18, { lineHeight: 1.5, letterSpacing: -0.011 }],
         '2xl': [20, { lineHeight: 1.5, letterSpacing: -0.011 }],
         '3xl': [22, { lineHeight: 1.5, letterSpacing: -0.011 }],
         '4xl': [24, { lineHeight: 1.5, letterSpacing: -0.011 }],
      },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        "80vw": "80vw",
      },
      maxHeight: {
        "80vh": "80vh",
      },
      width: {
        500: "500px",
        400: "400px",
      },
    },
    fontFamily: {
      jost: ["Jost", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    colors: {
      blue: "#092579",
      white: "#ffff",
      red: "#FF1E00",
    },
  },
  plugins: [],
};

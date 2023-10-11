/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        "80vw": "80vw",
        "50vw": "50vw",
        "20vw": "20vw",
      },
      maxHeight: {
        "80vh": "80vh",
        "50vh": "50vh",
      },
      width: {
        500: "500px",
        400: "400px",
        vw40: "40vw",
        215: "215px",
      },
      height: {
        500: "500px",
        400: "400px",
        vh50: "50vh",
      },
      fontSize: {
        xxs: ".8rem",
      },
    },
    fontFamily: {
      jost: ["Jost", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    colors: {
      blue: "rgba(9, 55, 121)",
      white: "#ffff",
      red: "#FF1E00",
      Dred: "#b30505",
      transparent: "#00FFFFFF",
    },
  },
  plugins: [],
};

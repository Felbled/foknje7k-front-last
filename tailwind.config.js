/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: "#09745F",
      title: "#0A033C",
      text: "#5D5A6F",
      placeholder: "rgba(93, 90, 111, 0.6)",
      border: "#DEDDE4",
      white: "#FFFFFF",
      red: "red",
      backgroundHome: "#F9F6F1",
      pink: "rgba(249, 219, 229, 0.9)",
      tableHeader: "#F1F4F9",
      purple: "rgba(151, 71, 255, 1)",
      purple_bg: "rgba(239, 235, 245, 1)",
      primary_bg: "#00B69B",
      chatReceiver_bg: "rgba(238, 241, 244, 1)",
      chatSender_bg: "#E8F2FE",
    },
    fontFamily: {
      montserrat_regular: "'Montserrat-regular'",
      montserrat_bold: "'Montserrat-bold'",
      montserrat_medium: "'Montserrat-medium'",
      montserrat_semi_bold: "'Montserrat-semi-bold'",
    },
    extend: {},
  },
  plugins: [],
};

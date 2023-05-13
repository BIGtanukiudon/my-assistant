/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "scale-up-hor-right":
          "scale-up-hor-right 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both",
        "scale-up-hor-left":
          "scale-up-hor-left 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both",
      },
      keyframes: {
        "scale-up-hor-right": {
          "0%": {
            transform: "scaleX(.4)",
            "transform-origin": "100% 100%",
          },
          to: {
            transform: "scaleX(1)",
            "transform-origin": "100% 100%",
          },
        },
        "scale-up-hor-left": {
          "0%": {
            transform: "scaleX(.4)",
            "transform-origin": "0% 0%",
          },
          to: {
            transform: "scaleX(1)",
            "transform-origin": "0% 0%",
          },
        },
      },
    },
  },
  plugins: [],
};

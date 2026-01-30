import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                focus: "#E97B58",
                "short-breaks": "#58E9A5",
                "long-breaks": "#58A5E9",
            },
            textColor: {
                focus: "#4B2E24",
                "short-breaks": "#2E4B35",
                "long-breaks": "#2E354B",
            },
        },
    },
    plugins: [require("daisyui")],
};
export default config;

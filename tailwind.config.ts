import { type Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-blob-1": {
          "0%": {
            transform:
              "translateY(-50%) translateX(-50%) rotate(-20deg) translateX(20%)",
          },
          "25%": {
            transform:
              "translateY(-50%) translateX(-50%) skew(-15deg, -15deg) rotate(80deg) translateX(30%)",
          },
          "50%": {
            transform:
              "translateY(-50%) translateX(-50%) rotate(180deg) translateX(25%)",
          },
          "75%": {
            transform:
              "translateY(-50%) translateX(-50%) skew(15deg, 15deg) rotate(240deg) translateX(15%)",
          },
          "100%": {
            transform:
              "translateY(-50%) translateX(-50%) rotate(340deg) translateX(20%)",
          },
        },
        "gradient-blob-2": {
          "0%": {
            transform:
              "translateY(-50%) translateX(-50%) rotate(40deg) translateX(-20%)",
          },
          "25%": {
            transform:
              "translateY(-50%) translateX(-50%) skew(15deg, 15deg) rotate(110deg) translateX(-5%)",
          },
          "50%": {
            transform:
              "translateY(-50%) translateX(-50%) rotate(210deg) translateX(-35%)",
          },
          "75%": {
            transform:
              "translateY(-50%) translateX(-50%) skew(-15deg, -15deg) rotate(300deg) translateX(-10%)",
          },
          "100%": {
            transform:
              "translateY(-50%) translateX(-50%) rotate(400deg) translateX(-20%)",
          },
        },
        "gradient-blob-3": {
          "0%": {
            transform:
              "translateY(-50%) translateX(-50%) translateX(-15%) translateY(10%)",
          },
          "20%": {
            transform:
              "translateY(-50%) translateX(-50%) translateX(20%) translateY(-30%)",
          },
          "40%": {
            transform:
              "translateY(-50%) translateX(-50%) translateX(-25%) translateY(-15%)",
          },
          "60%": {
            transform:
              "translateY(-50%) translateX(-50%) translateX(30%) translateY(20%)",
          },
          "80%": {
            transform:
              "translateY(-50%) translateX(-50%) translateX(5%) translateY(35%)",
          },
          "100%": {
            transform:
              "translateY(-50%) translateX(-50%) translateX(-15%) translateY(10%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-blob-1":
          "gradient-blob-1 20s cubic-bezier(0.1, 0, 0.9, 1) infinite",
        "gradient-blob-2":
          "gradient-blob-2 20s cubic-bezier(0.1, 0, 0.9, 1) infinite",
        "gradient-blob-3":
          "gradient-blob-3 20s cubic-bezier(0.1, 0, 0.9, 1) infinite",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(to right, rgba(84,51,255,1), rgba(71,84,255,1), rgba(57,122,255,1), rgba(45,156,255,1), rgba(32,189,255,1), rgba(69,206,241,1), rgba(101,222,228,1), rgba(137,240,214,1), rgba(165,254,203,1), rgba(184,254,214,1), rgba(203,254,225,1), rgba(225,255,238,1))",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

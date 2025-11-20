import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"
import plugin from "tailwindcss/plugin"

const config = {
  darkMode: ["class"],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
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
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }: any) {
      addBase({
        ":root": {
          colorScheme: "light",
          "--background": "0 0% 100%",
          "--foreground": "0 0% 3.6%",
          "--card": "0 0% 100%",
          "--card-foreground": "0 0% 3.6%",
          "--popover": "0 0% 100%",
          "--popover-foreground": "0 0% 3.6%",
          "--muted": "0 0% 96.1%",
          "--muted-foreground": "0 0% 45.1%",
          "--accent": "0 0% 9.0%",
          "--accent-foreground": "0 0% 98%",
          "--destructive": "0 84.2% 60.2%",
          "--destructive-foreground": "0 0% 98%",
          "--border": "0 0% 89.8%",
          "--input": "0 0% 89.8%",
          "--primary": "0 0% 9.0%",
          "--primary-foreground": "0 0% 98%",
          "--secondary": "0 0% 96.1%",
          "--secondary-foreground": "0 0% 9.0%",
          "--ring": "0 0% 3.6%",
          "--radius": "0.5rem",
        },
        ".dark": {
          colorScheme: "dark",
          "--background": "0 0% 3.6%",
          "--foreground": "0 0% 98%",
          "--card": "0 0% 3.6%",
          "--card-foreground": "0 0% 98%",
          "--popover": "0 0% 3.6%",
          "--popover-foreground": "0 0% 98%",
          "--muted": "0 0% 14.9%",
          "--muted-foreground": "0 0% 63.9%",
          "--accent": "0 0% 98%",
          "--accent-foreground": "0 0% 9.0%",
          "--destructive": "0 62.8% 30.6%",
          "--destructive-foreground": "0 0% 98%",
          "--border": "0 0% 14.9%",
          "--input": "0 0% 14.9%",
          "--primary": "0 0% 98%",
          "--primary-foreground": "0 0% 9.0%",
          "--secondary": "0 0% 14.9%",
          "--secondary-foreground": "0 0% 98%",
          "--ring": "0 0% 83.1%",
        },
      })
    }),
  ],
} satisfies Config

export default config

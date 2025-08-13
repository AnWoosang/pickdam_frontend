import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#7C3AED",
          light: "#EDE9FE",
          dark: "#5B21B6",
          foreground: "#ffffff",
        },
        // 중립 계열 (Gray Scale)
        gray: {
          dark: "#4B5563",
          DEFAULT: "#6B7280",
          light: "#D1D5DB",
          lighter: "#F3F4F6",
          background: "#FAFAFA",
        },
        // 상태 색상
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        // 텍스트 색상
        text: {
          DEFAULT: "#6B7280",
          muted: "#D1D5DB",
          heading: "#000000",
        },
        // 브랜드별 배경색
        brand: {
          chip: "#F3F4F6",
        },
        keyword: {
          chip: "#F3E8FF",
        },
        ad: {
          banner: "#E0E0E0",
        },
        border: {
          light: "#D4D1D1",
        },
      },
      fontFamily: {
        pretendard: ["Pretendard", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};

export default config;
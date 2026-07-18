import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "secondary-container": "#F1F5F9",
        "brand-red-deep": "#B3181C",
        "error-container": "#FEE2E2",
        "outline": "#64748B",
        "background": "#F8FAFC",
        "inverse-surface": "#0F172A",
        "on-tertiary-container": "#F8FAFC",
        "brand-red-light": "#FFF5F5",
        "on-tertiary-fixed": "#0F172A",
        "tertiary-fixed-dim": "#CBD5E1",
        "on-error-container": "#991B1B",
        "on-error": "#ffffff",
        "neutral-gray-200": "#E2E8F0",
        "surface-dim": "#E2E8F0",
        "secondary-fixed-dim": "#CBD5E1",
        "tertiary": "#64748B",
        "surface-variant": "#F1F5F9",
        "secondary": "#475569",
        "on-primary": "#ffffff",
        "tertiary-fixed": "#F1F5F9",
        "surface-container-lowest": "#ffffff",
        "on-primary-container": "#ffffff",
        "on-primary-fixed-variant": "#8F1316",
        "surface-bright": "#ffffff",
        "surface-container": "#F8FAFC",
        "secondary-fixed": "#F1F5F9",
        "outline-variant": "#CBD5E1",
        "on-secondary-fixed-variant": "#475569",
        "on-tertiary": "#ffffff",
        "primary-container": "#B3181C",
        "on-secondary": "#ffffff",
        "surface-tint": "#B3181C",
        "primary-fixed": "#FFF5F5",
        "on-surface-variant": "#475569",
        "on-surface": "#1E293B",
        "surface-container-low": "#F1F5F9",
        "on-secondary-fixed": "#0F172A",
        "surface-container-high": "#E2E8F0",
        "on-secondary-container": "#475569",
        "surface": "#ffffff",
        "primary-fixed-dim": "#FCA5A5",
        "error": "#EF4444",
        "inverse-primary": "#FCA5A5",
        "on-primary-fixed": "#5C0608",
        "tertiary-container": "#64748B",
        "surface-container-highest": "#E2E8F0",
        "neutral-gray-600": "#475569",
        "on-tertiary-fixed-variant": "#475569",
        "inverse-on-surface": "#F8FAFC",
        "success-green": "#16A34A",
        "primary": "#B3181C",
        "on-background": "#1E293B"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "max-width": "1280px",
        "gutter": "24px",
        "margin-desktop": "32px",
        "margin-mobile": "16px",
        "base-unit": "4px"
      },
      fontFamily: {
        "label-md": ["Inter"],
        "title-lg": ["Inter"],
        "slogan-accent": ["Hanken Grotesk"],
        "display-lg": ["Hanken Grotesk"],
        "headline-md": ["Hanken Grotesk"],
        "body-md": ["Inter"],
        "body-lg": ["Inter"],
        "headline-lg": ["Hanken Grotesk"],
        "headline-lg-mobile": ["Hanken Grotesk"]
      },
      fontSize: {
        "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "title-lg": ["18px", {"lineHeight": "24px", "fontWeight": "600"}],
        "slogan-accent": ["14px", {"lineHeight": "20px", "letterSpacing": "0.1em", "fontWeight": "800"}],
        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "headline-lg": ["32px", {"lineHeight": "40px", "fontWeight": "700"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "700"}]
      }
    },
  },
  plugins: [
    forms,
    containerQueries,
  ],
}

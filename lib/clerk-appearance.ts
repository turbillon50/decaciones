/**
 * Tema de Clerk alineado a la marca "Vinilo & Cobre" (ver brand.md).
 * Cobre como primario, marfil para texto, negro calido de fondo.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#c97b54",
    colorBackground: "transparent",
    colorText: "#f3ede2",
    colorTextSecondary: "#9c8d7c",
    colorInputBackground: "rgba(29, 22, 16, 0.7)",
    colorInputText: "#f3ede2",
    colorDanger: "#b9596b",
    colorSuccess: "#7fa08c",
    borderRadius: "0.85rem",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "shadow-none",
    card: "bg-transparent shadow-none border-0 p-0",
    header: "hidden",
    socialButtonsBlockButton:
      "border border-[#38291d] bg-[#1d1610]/70 text-[#f3ede2] hover:bg-[#2a2118]",
    dividerLine: "bg-[#38291d]",
    dividerText: "text-[#9c8d7c]",
    formFieldLabel: "text-[#9c8d7c]",
    formButtonPrimary:
      "bg-[#c97b54] hover:bg-[#d99a6c] text-[#17110d] font-bold normal-case",
    footer: "bg-transparent",
    footerActionLink: "text-[#d99a6c] hover:text-[#e7d7bd]",
  },
} as const;

"use client";
export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ padding: "calc(env(safe-area-inset-top) + 22px) 22px 10px" }}>
      <h1 style={{ fontWeight: 900, fontSize: "calc(2.2rem * var(--fz))", letterSpacing: -0.5 }}>{title}</h1>
      {subtitle && <p style={{ color: "var(--text-soft)", fontSize: "calc(1.05rem * var(--fz))", marginTop: 4 }}>{subtitle}</p>}
    </div>
  );
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function accentClasses(accent: "gold" | "amber" | "teal" | "rose") {
  return {
    gold: "text-gold border-gold/30 bg-gold/10",
    amber: "text-amber border-amber/30 bg-amber/10",
    teal: "text-teal border-teal/30 bg-teal/10",
    rose: "text-rose border-rose/30 bg-rose/10",
  }[accent];
}

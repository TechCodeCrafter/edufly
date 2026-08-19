// Reusable hero band used by interior pages (Projects, Interview, Topic, Project, Dashboard).
// Backprop-style: sits on the page background (pure black in dark, light surface in light),
// with a faint hero glow and a hairline bottom border. Text inside uses theme tokens.
export function DarkHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <header className={`relative overflow-hidden border-b border-line ${className}`}>
      <div className="absolute inset-0 hero-glow opacity-70" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">{children}</div>
    </header>
  );
}

// Reusable dark sub-header used by interior pages (Projects, Interview, Topic, Project, Dashboard).
export function DarkHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <header className={`darkchrome relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 hero-grid opacity-60" />
      <div className="absolute inset-0 hero-glow" />
      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">{children}</div>
    </header>
  );
}

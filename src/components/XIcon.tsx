// Official X (formerly Twitter) logo mark. Brand logo exception, same
// reasoning as GoogleIcon: platform brand marks are used as-is, not redrawn
// in the app's abstract single-color icon style.
export function XIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-6.53l-5.415-7.113-6.203 7.113H2.05l8.6-9.831L0 1.154h6.665l4.881 6.671L18.901 1.153Zm-1.29 19.494h2.039L6.486 3.24H4.298l13.313 17.407Z" />
    </svg>
  );
}

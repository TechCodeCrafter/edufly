import { useState } from 'react';
import { Icon } from './Icon';

export function CodeBlock({ label = 'bash', lines }: { label?: string; lines: string[] }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be blocked; fail silently */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </span>
          <span className="mono ml-2 text-xs uppercase tracking-eyebrow text-white/40">{label}</span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Icon name={copied ? 'check' : 'external'} size={14} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4">
        <code className="mono block text-sm leading-relaxed text-cyan-100/90">
          {lines.map((l, i) => (
            <span key={i} className="block">
              {l === '' ? '\u00A0' : l}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

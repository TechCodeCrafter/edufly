import { useState } from 'react';
import { Icon } from './Icon';
import type { CodeLine } from '../data/types';

// Normalize a CodeLine into { cmd, note }. Plain strings with a trailing
// "# comment" are split so the comment becomes the explanation.
function parse(line: CodeLine): { cmd: string; note?: string } {
  if (typeof line !== 'string') return { cmd: line.cmd, note: line.note };
  const m = line.match(/^(.*?)\s{2,}#\s?(.+)$/);
  if (m) return { cmd: m[1].trimEnd(), note: m[2].trim() };
  return { cmd: line };
}

export function CodeBlock({ label = 'bash', lines }: { label?: string; lines: CodeLine[] }) {
  const [copied, setCopied] = useState(false);
  const parsed = lines.map(parse);
  const isShell = label === 'bash';

  const copy = async () => {
    // Copy only the commands, never the explanations.
    const text = parsed.map((p) => p.cmd).join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be blocked; fail silently */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const hasNotes = parsed.some((p) => p.note);

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

      <div className="px-4 py-3.5">
        <code className="mono block text-sm leading-relaxed">
          {parsed.map((p, i) => {
            const blank = p.cmd === '';
            return (
              <div key={i} className={blank ? 'h-3' : 'group py-1 first:pt-0 last:pb-0'}>
                {!blank && (
                  <div className="flex items-baseline gap-2">
                    {isShell && <span className="select-none text-emerald-400/60">$</span>}
                    <span className="text-emerald-50/95">{p.cmd}</span>
                  </div>
                )}
                {p.note && (
                  <div className={`flex items-baseline gap-2 ${isShell ? 'pl-[1.1rem]' : ''}`}>
                    <span className="select-none text-white/25">{'\u21B3'}</span>
                    <span className="font-sans text-[12.5px] not-italic leading-snug text-white/45">
                      {p.note}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </code>
      </div>

      {hasNotes && (
        <div className="border-t border-white/[0.06] px-4 py-2">
          <span className="mono text-[11px] text-white/30">
            {'\u21B3'} lines explain what each command does — only the commands get copied
          </span>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../store/auth';
import { useSyncStatus } from '../store/sync';
import { GoogleIcon } from './GoogleIcon';
import { Icon } from './Icon';

const syncCopy: Record<string, string> = {
  idle: 'Saved on this device',
  syncing: 'Saving to your account\u2026',
  synced: 'Progress saved to your account',
  error: "Couldn't reach the cloud \u2014 still saved on this device",
};

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function Avatar({ name, avatar, className = '' }: { name: string; avatar?: string; className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-card-2 text-xs font-semibold text-fg ${className}`}>
      {avatar ? (
        <img src={avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

function SyncDot({ status }: { status: string }) {
  return (
    <span
      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
        status === 'error' ? 'bg-locked' : status === 'syncing' ? 'bg-progress animate-pulse' : 'bg-done'
      }`}
    />
  );
}

/** Header account control. Desktop (`compact=false`): a "Sign in with
 *  Google" pill, or a signed-in avatar that opens a small dropdown with sync
 *  status + sign out. Mobile (`compact=true`, used inside the nav sheet):
 *  same states but laid out inline, full width, no popover. Renders nothing
 *  while the session is still resolving or when cloud sync isn't configured. */
export function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { user, loading, cloudEnabled, signInWithGoogle, signOut } = useAuth();
  const { status } = useSyncStatus();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || compact) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open, compact]);

  if (!cloudEnabled || loading) return null;

  if (!user) {
    return (
      <button
        onClick={() => void signInWithGoogle()}
        className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-line bg-card px-3.5 text-sm font-medium text-fg backdrop-blur transition-all hover:-translate-y-0.5 hover:border-fg-faint ${
          compact ? 'w-full justify-center' : ''
        }`}
      >
        <GoogleIcon size={16} />
        {compact ? 'Sign in with Google' : 'Sign in'}
      </button>
    );
  }

  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? 'Account';
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  if (compact) {
    return (
      <div>
        <div className="flex items-center gap-3">
          <Avatar name={name} avatar={avatar} className="h-9 w-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-fg">{name}</p>
            <p className="flex items-center gap-1.5 text-xs text-fg-faint">
              <SyncDot status={status} />
              {syncCopy[status]}
            </p>
          </div>
        </div>
        <button
          onClick={() => void signOut()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-line px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-card-2 hover:text-fg"
        >
          <Icon name="log-out" size={15} />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
      >
        <Avatar name={name} avatar={avatar} className="h-9 w-9 border border-line backdrop-blur transition-colors hover:border-fg-faint" />
      </button>

      {open && (
        <div className="glass absolute right-0 top-full z-30 mt-2 w-64 rounded-card p-3 text-sm">
          <div className="flex items-center gap-3 border-b border-line pb-3">
            <Avatar name={name} avatar={avatar} className="h-9 w-9" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-fg">{name}</p>
              {user.email && <p className="truncate text-xs text-fg-faint">{user.email}</p>}
            </div>
          </div>
          <p className="flex items-center gap-1.5 py-3 text-xs text-fg-muted">
            <SyncDot status={status} />
            {syncCopy[status]}
          </p>
          <button
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
            className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-sm font-medium text-fg-muted transition-colors hover:bg-card-2 hover:text-fg"
          >
            <Icon name="log-out" size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

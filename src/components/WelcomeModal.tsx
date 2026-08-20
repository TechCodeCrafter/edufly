import { useEffect } from 'react';
import { useWelcome } from '../store/welcome';
import { Icon } from './Icon';

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** One-time greeting shown right after a real Google sign-in (not on every
 *  page reload where a session is merely restored). Confirms the account is
 *  connected and, when the account already had progress on another device,
 *  makes the sync explicit so it doesn't feel like data silently appeared
 *  or vanished. */
export function WelcomeModal() {
  const { info, dismiss } = useWelcome();

  useEffect(() => {
    if (!info) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [info, dismiss]);

  if (!info) return null;

  const firstName = info.name.split(' ')[0];
  const hasProgress = info.topicsDone > 0 || info.masteredCount > 0 || info.streakDays > 0;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 animate-fade-in" onClick={dismiss}>
      <div
        className="glass w-full max-w-sm rounded-card p-6 text-center animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-full">
          {info.avatar ? (
            <img src={info.avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="gradient-bg grid h-full w-full place-items-center text-lg font-semibold text-white">
              {initials(info.name)}
            </span>
          )}
        </div>

        <h2 className="mt-4 text-lg font-semibold text-fg">
          {info.hadCloudProgress ? `Welcome back, ${firstName}` : `Welcome, ${firstName}`}
        </h2>
        <p className="mt-1.5 text-sm text-fg-muted">
          {info.hadCloudProgress
            ? 'Your progress is synced to your account and this device.'
            : "You're signed in. Progress will save to your account automatically from here."}
        </p>

        {hasProgress && (
          <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-card-2 p-3">
            <div>
              <p className="gradient-text text-xl font-bold">{info.topicsDone}</p>
              <p className="mt-0.5 text-[11px] text-fg-faint">Topics done</p>
            </div>
            <div>
              <p className="gradient-text text-xl font-bold">{info.masteredCount}</p>
              <p className="mt-0.5 text-[11px] text-fg-faint">Mastered</p>
            </div>
            <div>
              <p className="gradient-text text-xl font-bold">{info.streakDays}</p>
              <p className="mt-0.5 text-[11px] text-fg-faint">Day streak</p>
            </div>
          </div>
        )}

        <button
          onClick={dismiss}
          className="gradient-bg mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <Icon name={hasProgress ? 'sparkle' : 'arrow-right'} size={16} />
          {hasProgress ? "Let's keep going" : "Let's get started"}
        </button>
      </div>
    </div>
  );
}

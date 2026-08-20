import { createContext, useContext, useState } from 'react';

export interface WelcomeInfo {
  name: string;
  avatar?: string;
  topicsDone: number;
  masteredCount: number;
  streakDays: number;
  // True when the cloud account had real progress on it before this device
  // merged in (a returning learner on a new device), so the copy can say
  // "synced" instead of "let's get started".
  hadCloudProgress: boolean;
}

interface WelcomeCtx {
  info: WelcomeInfo | null;
  show: (info: WelcomeInfo) => void;
  dismiss: () => void;
}

const WelcomeContext = createContext<WelcomeCtx | null>(null);

export function WelcomeProvider({ children }: { children: React.ReactNode }) {
  const [info, setInfo] = useState<WelcomeInfo | null>(null);
  return (
    <WelcomeContext.Provider value={{ info, show: setInfo, dismiss: () => setInfo(null) }}>
      {children}
    </WelcomeContext.Provider>
  );
}

export function useWelcome() {
  const ctx = useContext(WelcomeContext);
  if (!ctx) throw new Error('useWelcome must be used within WelcomeProvider');
  return ctx;
}

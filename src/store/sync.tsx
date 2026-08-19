import { createContext, useContext, useState } from 'react';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface SyncCtx {
  status: SyncStatus;
  setStatus: (s: SyncStatus) => void;
}

const SyncContext = createContext<SyncCtx | null>(null);

export function SyncStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SyncStatus>('idle');
  return <SyncContext.Provider value={{ status, setStatus }}>{children}</SyncContext.Provider>;
}

export function useSyncStatus() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSyncStatus must be used within SyncStatusProvider');
  return ctx;
}

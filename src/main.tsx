import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from './store/theme';
import { ProgressProvider } from './store/progress';
import { AuthProvider } from './store/auth';
import { SyncStatusProvider } from './store/sync';
import { CloudSync } from './store/cloudSync';
import { WelcomeProvider } from './store/welcome';
import { WelcomeModal } from './components/WelcomeModal';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <ProgressProvider>
          <AuthProvider>
            <SyncStatusProvider>
              <WelcomeProvider>
                <CloudSync />
                <WelcomeModal />
                <App />
              </WelcomeProvider>
            </SyncStatusProvider>
          </AuthProvider>
        </ProgressProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
);

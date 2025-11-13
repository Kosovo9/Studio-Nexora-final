import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { getClerkPublishableKey, isClerkConfigured } from './lib/auth/clerk';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const clerkKey = getClerkPublishableKey();

// Si Clerk está configurado, usarlo. Si no, usar Supabase Auth
const AppWithAuth = isClerkConfigured() ? (
  <ClerkProvider publishableKey={clerkKey}>
    <App />
  </ClerkProvider>
) : (
  <App />
);

// Verificar que el elemento root existe antes de renderizar
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure index.html has a <div id="root"></div> element.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      {AppWithAuth}
    </ErrorBoundary>
  </StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { getClerkPublishableKey, isClerkConfigured } from './lib/auth/clerk';
import App from './App.tsx';
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {AppWithAuth}
  </StrictMode>
);

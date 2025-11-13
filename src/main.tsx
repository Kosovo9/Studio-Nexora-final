import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { getClerkPublishableKey, isClerkConfigured } from './lib/auth/clerk';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Logging para debugging
console.log('🚀 Iniciando aplicación...');
console.log('📍 URL:', window.location.href);
console.log('🌐 User Agent:', navigator.userAgent);

try {
  const clerkKey = getClerkPublishableKey();
  const clerkConfigured = isClerkConfigured();
  
  console.log('🔐 Clerk configurado:', clerkConfigured);
  if (clerkConfigured) {
    console.log('🔑 Clerk Key:', clerkKey ? 'Presente' : 'Faltante');
  }

  // Si Clerk está configurado, usarlo. Si no, usar Supabase Auth
  const AppWithAuth = clerkConfigured && clerkKey ? (
    <ClerkProvider publishableKey={clerkKey}>
      <App />
    </ClerkProvider>
  ) : (
    <App />
  );

  // Verificar que el elemento root existe antes de renderizar
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('❌ Root element not found!');
    throw new Error('Root element not found. Make sure index.html has a <div id="root"></div> element.');
  }

  console.log('✅ Root element encontrado');
  console.log('🎨 Renderizando aplicación...');

  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        {AppWithAuth}
      </ErrorBoundary>
    </StrictMode>
  );

  console.log('✅ Aplicación renderizada exitosamente');
} catch (error) {
  console.error('❌ Error fatal al iniciar aplicación:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial; background: #1a1a1a; color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center; max-width: 600px;">
        <h1 style="color: #ef4444;">Error al cargar la aplicación</h1>
        <p style="color: #94a3b8; margin: 20px 0;">${error instanceof Error ? error.message : 'Error desconocido'}</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Recargar Página
        </button>
        <details style="margin-top: 20px; text-align: left;">
          <summary style="cursor: pointer; color: #94a3b8;">Detalles técnicos</summary>
          <pre style="background: #0f172a; padding: 15px; border-radius: 8px; overflow: auto; margin-top: 10px; font-size: 12px;">${error instanceof Error ? error.stack : String(error)}</pre>
        </details>
      </div>
    </div>
  `;
}

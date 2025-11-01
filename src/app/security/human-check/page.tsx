import TurnstileCheck from '@/components/security/TurnstileCheck';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <main className='min-h-screen text-white'>
      <div className='max-w-xl mx-auto px-6 py-16'>
        <h1 className='text-3xl font-bold mb-4'>Verificación humana</h1>
        <p className='opacity-80 mb-6'>Completa el desafío para continuar.</p>
        <TurnstileCheck />
      </div>
    </main>
  );
}


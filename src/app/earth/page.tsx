import dynamic from 'next/dynamic';

const EarthCanvas = dynamic(() => import('@/components/earth/EarthCanvas'), { ssr: false });

export default function Page() {
  return (
    <main className='relative min-h-screen'>
      <div className='absolute inset-0 -z-10'>
        <EarthCanvas asBackground />
      </div>
      <section className='relative z-10 mx-auto max-w-4xl px-6 pt-24'>
        <h1 className='text-4xl font-bold text-white drop-shadow'>Studio Nexora — Earth Background</h1>
        <p className='mt-3 text-white/80 max-w-prose'>
          Hyper-realistic globe with clouds, night lights and atmospheric glow.
        </p>
      </section>
    </main>
  );
}


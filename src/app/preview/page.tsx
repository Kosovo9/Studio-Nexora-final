'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PricingAndCTA from '@/components/PricingAndCTA';
import Navbar from '@/components/nav/Navbar';
import GlobalFooter from '@/components/footer/GlobalFooter';
import TokenDiff from '@/components/diff/TokenDiff';
import CopyButton from '@/components/diff/CopyButton';
import Chips from '@/components/diff/Chips';
import MetricsInline from '@/components/diff/MetricsInline';
import TotalsBar from '@/components/diff/TotalsBar';
import NextImagePro from '@/components/media/NextImagePro';
import TurnstileCheck from '@/components/security/TurnstileCheck';

// Dynamic imports for heavy components
const EarthBackground = dynamic(() => import('@/components/earth/EarthBackground'), { ssr: false });

export default function PreviewPage() {
  const [testMode, setTestMode] = useState<'word'|'char'|'sentence'>('word');
  const [energyMode, setEnergyMode] = useState<'normal'|'ahorro'>('normal');

  const oldText = "A beautiful landscape with mountains and lakes, sunset colors, high quality, detailed";
  const newText = "A stunning landscape featuring majestic mountains and crystal-clear lakes, vibrant sunset colors with orange and pink hues, ultra high quality, incredibly detailed, 8k resolution";

  const testRows = [
    {
      id: '1',
      changed: ['prompt', 'negative_prompt'],
      left: {
        prompt: oldText,
        negative_prompt: 'blurry, low quality',
        subject: 'hombre',
        title: 'Test Item 1',
        theme: 'catrina',
        location: 'cemetery'
      },
      right: {
        prompt: newText,
        negative_prompt: 'blurry, low quality, distorted',
        subject: 'hombre',
        title: 'Test Item 1 Updated',
        theme: 'catrina',
        location: 'cemetery'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Earth Background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <EarthBackground />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Studio Nexora — Preview Showcase
        </h1>
        <p className="text-xl opacity-80 mb-8">
          Complete A-Z review of all components, features, and functionality
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition">
            Home
          </Link>
          <Link href="/pricing" className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition">
            Pricing
          </Link>
          <Link href="/admin/prompts" className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition">
            Admin Prompts
          </Link>
          <Link href="/prompts/halloween" className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition">
            Prompts Halloween
          </Link>
        </div>
      </section>

      {/* Component Showcase */}
      <div className="max-w-7xl mx-auto px-6 space-y-12 pb-20">
        
        {/* Pricing & CTA */}
        <section className="rounded-2xl border border-white/15 p-8 bg-black/60 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">Pricing & CTA Component</h2>
          <PricingAndCTA />
        </section>

        {/* Token Diff Component */}
        <section className="rounded-2xl border border-white/15 p-8 bg-black/60 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">Token Diff Component</h2>
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <span className="text-sm opacity-70">Mode:</span>
              <button 
                onClick={() => setTestMode('word')}
                className={`px-3 py-1 rounded ${testMode === 'word' ? 'bg-cyan-500' : 'bg-white/10'}`}
              >
                Word
              </button>
              <button 
                onClick={() => setTestMode('char')}
                className={`px-3 py-1 rounded ${testMode === 'char' ? 'bg-cyan-500' : 'bg-white/10'}`}
              >
                Char
              </button>
              <button 
                onClick={() => setTestMode('sentence')}
                className={`px-3 py-1 rounded ${testMode === 'sentence' ? 'bg-cyan-500' : 'bg-white/10'}`}
              >
                Sentence
              </button>
            </div>
            <div className="rounded-lg border border-white/10 p-4 bg-black/40">
              <TokenDiff 
                oldText={oldText} 
                newText={newText} 
                mode={testMode}
                compact
              />
            </div>
            <MetricsInline oldText={oldText} newText={newText} />
            <div className="flex gap-2">
              <CopyButton text={oldText} label="Copy Old" />
              <CopyButton text={newText} label="Copy New" />
            </div>
          </div>
        </section>

        {/* Chips & Totals */}
        <section className="rounded-2xl border border-white/15 p-8 bg-black/60 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">Chips & Metrics Components</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl mb-2">Changed Fields Chips:</h3>
              <Chips fields={['prompt', 'negative_prompt', 'title', 'theme']} />
            </div>
            <div>
              <h3 className="text-xl mb-2">Totals Bar:</h3>
              <TotalsBar rows={testRows} />
            </div>
          </div>
        </section>

        {/* Image Components */}
        <section className="rounded-2xl border border-white/15 p-8 bg-black/60 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">Image Components</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="text-lg mb-2">NextImagePro</h3>
              <div className="relative w-full h-64 rounded overflow-hidden">
                <NextImagePro
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                  alt="Test image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="text-lg mb-2">Image with Watermark</h3>
              <p className="text-sm opacity-70 mb-2">
                Use /api/img/resize?key=...&w=800&lw=1 for watermarked images
              </p>
            </div>
          </div>
        </section>

        {/* Security Components */}
        <section className="rounded-2xl border border-white/15 p-8 bg-black/60 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">Security Components</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="text-lg mb-2">Cloudflare Turnstile</h3>
              <TurnstileCheck />
            </div>
          </div>
        </section>

        {/* Admin Features Links */}
        <section className="rounded-2xl border border-white/15 p-8 bg-black/60 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">Admin Features</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href="/admin/prompts" 
              className="rounded-lg border border-white/20 p-4 hover:bg-white/10 transition"
            >
              <h3 className="font-semibold mb-2">Prompts Manager</h3>
              <p className="text-sm opacity-70">CRUD packs & items, bulk actions</p>
            </Link>
            <Link 
              href="/admin/reports/diff-metrics" 
              className="rounded-lg border border-white/20 p-4 hover:bg-white/10 transition"
            >
              <h3 className="font-semibold mb-2">Diff Metrics Report</h3>
              <p className="text-sm opacity-70">Printable PDF reports</p>
            </Link>
            <Link 
              href="/admin/assets" 
              className="rounded-lg border border-white/20 p-4 hover:bg-white/10 transition"
            >
              <h3 className="font-semibold mb-2">Asset Management</h3>
              <p className="text-sm opacity-70">Storage & uploads</p>
            </Link>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="rounded-2xl border border-white/15 p-8 bg-black/60 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">API Endpoints</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between items-center p-2 bg-black/40 rounded">
              <span>/api/img/resize</span>
              <span className="px-2 py-1 bg-green-500/20 rounded text-xs">GET</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/40 rounded">
              <span>/api/admin/prompts/packs</span>
              <span className="px-2 py-1 bg-blue-500/20 rounded text-xs">GET/POST</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/40 rounded">
              <span>/api/admin/prompts/version/diff-metrics</span>
              <span className="px-2 py-1 bg-blue-500/20 rounded text-xs">GET</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/40 rounded">
              <span>/api/storage/presign</span>
              <span className="px-2 py-1 bg-purple-500/20 rounded text-xs">POST</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/40 rounded">
              <span>/api/checkout</span>
              <span className="px-2 py-1 bg-yellow-500/20 rounded text-xs">POST</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-black/40 rounded">
              <span>/api/turnstile/verify</span>
              <span className="px-2 py-1 bg-orange-500/20 rounded text-xs">POST</span>
            </div>
          </div>
        </section>

        {/* Features Checklist */}
        <section className="rounded-2xl border border-white/15 p-8 bg-black/60 backdrop-blur">
          <h2 className="text-3xl font-bold mb-6">Features Checklist</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-400">✅ Implemented</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ Pricing & CTA Component</li>
                <li>✅ Token Diff (word/char/sentence)</li>
                <li>✅ Metrics & Chips Components</li>
                <li>✅ Admin Prompts Manager</li>
                <li>✅ Versioning & Snapshots</li>
                <li>✅ Visual Diff Page</li>
                <li>✅ PDF Report Generation</li>
                <li>✅ Storage (S3/R2) Integration</li>
                <li>✅ Image Resize & Watermark</li>
                <li>✅ LQIP (Blurhash)</li>
                <li>✅ Cloudflare Turnstile</li>
                <li>✅ Cookie Consent Banner</li>
                <li>✅ Plausible Analytics</li>
                <li>✅ Stripe Checkout & Portal</li>
                <li>✅ SEO (JSON-LD, OG, Sitemap)</li>
                <li>✅ Legal Pages (i18n)</li>
                <li>✅ Energy Toggle</li>
                <li>✅ 3D Earth Background</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">🔧 Configuration</h3>
              <ul className="space-y-1 text-sm font-mono opacity-80">
                <li>• Next.js 14.2.25</li>
                <li>• React 18.3.1</li>
                <li>• Clerk Authentication</li>
                <li>• Supabase Database</li>
                <li>• AWS S3 / Cloudflare R2</li>
                <li>• Stripe Payments</li>
                <li>• next-intl (i18n)</li>
                <li>• Tailwind CSS</li>
                <li>• TypeScript</li>
                <li>• Playwright (E2E)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="mt-12">
          <GlobalFooter />
        </section>
      </div>
    </div>
  );
}


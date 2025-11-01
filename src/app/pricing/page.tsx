import { cookies } from 'next/headers';
import PricingClient from './PricingClient';
import { pageSEO } from '@/lib/seo/metadata';

export const metadata = pageSEO({ title: 'Planes', path: '/pricing' });

export default function Page(){
  const v = (cookies().get('ab_pricing')?.value || 'A') as 'A'|'B';
  return <PricingClient variant={v} />;
}

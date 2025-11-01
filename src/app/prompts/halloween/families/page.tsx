import { loadHalloweenFamilies } from '@/lib/prompts/halloween';
import Client from './ui';

export default async function Page() {
  const items = loadHalloweenFamilies(process.cwd());
  return <Client items={items} />;
}


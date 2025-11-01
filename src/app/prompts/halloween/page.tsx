import { loadHalloweenPack } from '@/lib/prompts/halloween';
import Client from './ui';

export default async function Page() {
  const data = loadHalloweenPack(process.cwd());
  return <Client data={data} />;
}


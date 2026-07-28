import { getSettings } from '@/lib/fetch';
import { HeaderNav } from './HeaderNav';

export async function Header({ settings }: { settings?: any }) {
  const finalSettings = settings || await getSettings();
  return <HeaderNav settings={finalSettings} />;
}

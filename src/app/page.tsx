import { Suspense } from 'react';
import MoonHome from '@/components/MoonHome';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <Suspense>
      <MoonHome />
    </Suspense>
  );
}

import { Suspense } from 'react';
import HomeClientFinal from '@/components/HomeClientFinal';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <Suspense>
      <HomeClientFinal />
    </Suspense>
  );
}

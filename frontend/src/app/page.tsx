'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <p className="text-white text-lg">Redirecionando...</p>
    </div>
  );
}

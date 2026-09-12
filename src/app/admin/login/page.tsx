'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/login?role=admin');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-slate-400 font-medium">
      Redirecting to Teachers-Community Admin Login...
    </div>
  );
}

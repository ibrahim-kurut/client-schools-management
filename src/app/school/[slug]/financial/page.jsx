"use client";
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function FinancialPage() {
  const router = useRouter();
  const { slug } = useParams();

  useEffect(() => {
    const normalizedSlug = slug ? slug.toString().replace(/\s+/g, '-') : '';
    router.push(`/school/${normalizedSlug}/financial/dashboard`);
  }, [router, slug]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

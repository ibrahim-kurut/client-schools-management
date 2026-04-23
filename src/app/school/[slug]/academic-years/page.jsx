import React from 'react';
import AcademicYearsManagement from '@/components/academic-years/AcademicYearsManagement';

export default async function AcademicYearsPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  return <AcademicYearsManagement slug={slug} />;
}

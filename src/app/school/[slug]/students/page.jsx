import React from 'react';
import StudentsManagement from "@/components/dashboard/students/StudentsManagement";

export default async function StudentsPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  return <StudentsManagement slug={slug} />;
}
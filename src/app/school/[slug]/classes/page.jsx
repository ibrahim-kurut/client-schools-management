import React from 'react';
import ClassesManagement from "@/components/dashboard/classes/ClassesManagement";

export default async function ClassesPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  return <ClassesManagement slug={slug} />;
}
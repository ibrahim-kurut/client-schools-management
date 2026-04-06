import React from 'react';
import AcademicYearsManagement from '@/components/academic-years/AcademicYearsManagement';
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function AcademicYearsPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  return (
    <div className="h-screen w-full bg-[#f8fafc] font-sans flex overflow-hidden lg:flex-row flex-col" dir="rtl">
      {/* Sidebar (Right side for RTL) */}
      <DashboardSidebar slug={slug} />

      {/* Content Area (Left side for RTL) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader slug={slug} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth bg-[#f8fafc]">
          <AcademicYearsManagement slug={slug} />
        </main>
      </div>
    </div>
  );
}

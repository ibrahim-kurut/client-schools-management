import React from 'react';
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import StudentsManagement from "@/components/dashboard/students/StudentsManagement";

export default async function StudentsPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  return (
    <div className="h-screen w-full bg-[#f8fafc] font-sans flex overflow-hidden lg:flex-row flex-col" dir="rtl">
      
      {/* Sidebar (Right side for RTL) */}
      <DashboardSidebar slug={slug} />

      {/* Content Area (Left side for RTL) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader slug={slug} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-6 lg:p-10 space-y-10 bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto w-full">
            <StudentsManagement slug={slug} />
          </div>
        </main>
      </div>
    </div>
  );
}
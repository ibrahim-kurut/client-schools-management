"use client";
import React from 'react';
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useParams } from 'next/navigation';

export default function DashboardLayoutWrapper({ children }) {
  const params = useParams();
  const slug = params?.slug || '';

  return (
    <div className="h-screen w-full bg-[#f8fafc] font-sans flex overflow-hidden lg:flex-row flex-col" dir="rtl">
      {/* Sidebar */}
      <DashboardSidebar slug={slug} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader slug={slug} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 sm:p-6 lg:p-10 bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

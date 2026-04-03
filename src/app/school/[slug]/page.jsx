import React from 'react';
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SubscriptionStats from "@/components/dashboard/SubscriptionStats";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import SchoolLinkCard from "@/components/dashboard/SchoolLinkCard";

export default async function SchoolPage({ params }) {
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
          {/* Overview Section Label */}
          <div className="max-w-[1600px] mx-auto w-full space-y-10">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">نظرة عامة على النظام</h2>
                <span className="text-sm font-bold text-slate-400">2024 / {decodeURIComponent(slug).replace(/-/g, ' ')}</span>
              </div>
              <StatsGrid />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
              <div className="lg:col-span-2 space-y-8">
                <QuickActions />
                <RecentActivity />
              </div>
              <div className="space-y-8">
                <SubscriptionStats />
                <SchoolLinkCard slug={slug} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import StatsGrid from "@/components/dashboard/StatsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SubscriptionStats from "@/components/dashboard/SubscriptionStats";
import SchoolLinkCard from "@/components/dashboard/SchoolLinkCard";

export default async function SchoolPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  return (
    <div className="space-y-10">
      {/* Overview Section Label */}
      <div className="space-y-10">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">نظرة عامة على النظام</h2>
            <span className="text-sm font-bold text-slate-400">2024 / {decodeURIComponent(slug).replace(/-/g, ' ')}</span>
          </div>
          <StatsGrid />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          <div className="lg:col-span-2 space-y-8">
            <QuickActions slug={slug}/>
            <RecentActivity />
          </div>
          <div className="space-y-8">
            <SubscriptionStats />
            <SchoolLinkCard slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}

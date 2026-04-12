"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import SchedulesManagement from "@/components/dashboard/schedules/SchedulesManagement";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function SchedulesPage() {
    const { slug } = useParams();

    return (
        <div className="h-screen w-full bg-[#f8fafc] font-sans flex overflow-hidden lg:flex-row flex-col" dir="rtl">
            {/* Sidebar */}
            <DashboardSidebar slug={slug} />

            {/* Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <DashboardHeader slug={slug} />
                
                <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-6 lg:p-10 space-y-10 bg-[#f8fafc]">
                    <div className="max-w-[1600px] mx-auto w-full">
                        <SchedulesManagement />
                    </div>
                </main>
            </div>
        </div>
    );
}

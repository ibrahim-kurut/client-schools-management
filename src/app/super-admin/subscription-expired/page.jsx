"use client";

import React from 'react';
import { 
  ShieldAlert, 
  RefreshCcw, 
  School as SchoolIcon, 
  Calendar,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import SuperAdminDashboardTable from "@/components/dashboard/super-admin/SuperAdminDashboardTable";
import StatusBadge from "@/components/dashboard/super-admin/StatusBadge";

const SubscriptionExpired = () => {
    // Mock Data for schools with expired subscriptions
    const expiredSchools = [
        {
            id: 1,
            name: "مدرسة النجاح النموذجية",
            slug: "success-school",
            logo: null,
            plan: { name: "الباقة المتقدمة", price: 200 },
            expiredAt: "2026-04-10T10:00:00Z",
            status: "EXPIRED",
            studentCount: 450
        },
        {
            id: 2,
            name: "ثانوية المستقبل",
            slug: "future-high",
            logo: null,
            plan: { name: "الباقة الأساسية", price: 100 },
            expiredAt: "2026-04-12T08:00:00Z",
            status: "EXPIRED",
            studentCount: 220
        },
        {
            id: 3,
            name: "مدارس النور العالمية",
            slug: "alnoor-intl",
            logo: null,
            plan: { name: "الباقة الاحترافية", price: 500 },
            expiredAt: "2026-03-25T12:00:00Z",
            status: "EXPIRED",
            studentCount: 890
        },
        {
            id: 4,
            name: "أكاديمية الرواد",
            slug: "pioneers-academy",
            logo: null,
            plan: { name: "الباقة الأساسية", price: 100 },
            expiredAt: "2026-04-01T15:00:00Z",
            status: "EXPIRED",
            studentCount: 150
        }
    ];

    const columns = [
        {
            header: "المدرسة",
            render: (school) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center border border-red-100 dark:border-red-500/20">
                        <SchoolIcon className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{school.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{school.slug}</span>
                    </div>
                </div>
            )
        },
        {
            header: "الباقة الحالية",
            render: (school) => (
                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500">
                        {school.plan.name}
                    </div>
                </div>
            )
        },
        {
            header: "تاريخ الانتهاء",
            render: (school) => (
                <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">
                        {new Date(school.expiredAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            )
        },
        {
            header: "الحالة",
            render: (school) => <StatusBadge status={school.status} />
        },
        {
            header: "الإجراءات",
            headerClassName: "text-left",
            render: (school) => (
                <div className="flex justify-end gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all transform active:scale-95 shadow-sm shadow-indigo-600/20">
                        <RefreshCcw className="w-3 h-3" />
                        تجديد الاشتراك
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <DashboardPageHeader 
                title="الاشتراكات المنتهية"
                description="مراقبة وإدارة المدارس التي انتهت فترة اشتراكها في المنصة."
            />

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-5 group hover:border-red-500/30 transition-all">
                    <div className="w-14 h-14 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-400">إجمالي المدارس المنتهية</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{expiredSchools.length}</h3>
                    </div>
                </div>

                {/* Additional context card */}
                <div className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-600/20">
                    <div className="relative z-10 space-y-2">
                        <h3 className="text-xl font-bold">تنبيه المدارس</h3>
                        <p className="text-indigo-100 text-sm max-w-md">يمكنك تجديد الاشتراك يدوياً لكل مدرسة من القائمة أدناه، أو التواصل مع مديري المدارس عبر البريد الإلكتروني.</p>
                        <div className="flex gap-3 mt-4">
                            <button className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/10">
                                إرسال تذكير للكل <ArrowUpRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    <div className="absolute left-[-20px] top-[-20px] opacity-10">
                         <ShieldAlert className="w-40 h-40" />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">قائمة الاشتراكات المكسورة</h3>
                    <span className="text-xs font-medium text-slate-400 font-arabic">عرض {expiredSchools.length} مدرسة</span>
                </div>
                
                <SuperAdminDashboardTable 
                    columns={columns}
                    data={expiredSchools}
                    loading={false}
                    emptyMessage="لا يوجد اشتراكات منتهية حالياً"
                    emptyIcon={ShieldAlert}
                />
            </div>
        </div>
    );
};

export default SubscriptionExpired;


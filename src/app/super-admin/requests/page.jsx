"use client";

import React, { useState } from "react";
import { 
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import RequestCard from "@/components/dashboard/super-admin/RequestCard";

const mockRequests = [
  {
    id: "REQ-2024-001",
    school: "مدرسة الأمل النموذجية",
    plan: "الباقة المتقدمة",
    amount: 299,
    status: "PENDING",
    date: "2024-03-31 08:30",
    phone: "0123456789",
    receipt: "https://via.placeholder.com/600x800",
    notes: "تم تحويل المبلغ عبر فودافون كاش."
  },
  {
    id: "REQ-2024-002",
    school: "مدارس النور الأهلية",
    plan: "الباقة المتوسطة",
    amount: 149,
    status: "APPROVED",
    date: "2024-03-30 14:15",
    phone: "0987654321",
    receipt: "https://via.placeholder.com/600x800",
    notes: "الدفع النقدي في المقر."
  },
  {
    id: "REQ-2024-003",
    school: "أكاديمية المستقبل",
    plan: "الباقة المتقدمة",
    amount: 299,
    status: "REJECTED",
    date: "2024-03-29 11:00",
    phone: "0554433221",
    receipt: "https://via.placeholder.com/600x800",
    notes: "إيصال دفع قديم."
  }
];

export default function SubscriptionRequests() {
  const [activeStatus, setActiveStatus] = useState("PENDING");

  const filteredRequests = mockRequests.filter(req => req.status === activeStatus);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <DashboardPageHeader 
        title="طلبات الاشتراك"
        description="مراجعة والتحقق من إيصالات الدفع لتفعيل الاشتراكات يدوياً."
      />

      <div className="flex items-center justify-center md:justify-start gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
         {["PENDING", "APPROVED", "REJECTED"].map((status) => (
           <button 
            key={status}
            onClick={() => setActiveStatus(status)}
            className={cn(
              "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
              activeStatus === status 
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
           >
             {status === "PENDING" ? "قيد الانتظار" : status === "APPROVED" ? "مقبولة" : "مرفوضة"}
           </button>
         ))}
      </div>

      {/* Main Inbox View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Requests List */}
        <div className="lg:col-span-12 space-y-4">
           {filteredRequests.length === 0 ? (
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center opacity-50 space-y-6">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center p-6 text-slate-300">
                   <AlertCircle className="w-full h-full" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">لا توجد طلبات {activeStatus === "PENDING" ? "معلقة" : "في هذا القسم"}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">سجل الطلبات فارغ حالياً</p>
                </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredRequests.map((req) => (
                 <RequestCard key={req.id} request={req} />
               ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
}

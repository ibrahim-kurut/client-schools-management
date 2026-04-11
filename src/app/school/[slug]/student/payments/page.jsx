"use client";

import { CreditCard, Wallet, Banknote, History, CheckCheck, Clock } from "lucide-react";

export default function StudentPaymentsPage() {
  const financialSummary = {
    totalRequired: "2,500,000",
    totalPaid: "1,500,000",
    remaining: "1,000,000",
    currency: "د.ع"
  };

  const paymentsHistory = [
    { id: "INV-2026-001", amount: "500,000", date: "15 سبتمبر 2025", type: "القسط الأول", status: "مكتمل", method: "كاش" },
    { id: "INV-2026-002", amount: "500,000", date: "15 نوفمبر 2025", type: "القسط الثاني", status: "مكتمل", method: "تحويل بنكي" },
    { id: "INV-2026-003", amount: "500,000", date: "15 يناير 2026", type: "القسط الثالث", status: "مكتمل", method: "زين كاش" },
    { id: "INV-2026-004", amount: "500,000", date: "15 مارس 2026", type: "القسط الرابع", status: "بانتظار الدفع", method: "-" },
    { id: "INV-2026-005", amount: "500,000", date: "15 مايو 2026", type: "القسط الخامس", status: "بانتظار الدفع", method: "-" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
            <CreditCard className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">السجل المالي والأقساط</h1>
            <p className="text-sm font-semibold text-slate-400">متابعة الفواتير والدفعات المالية المستحقة</p>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Total Required */}
         <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2.5 bg-slate-200/50 rounded-xl">
               <Wallet className="w-5 h-5 text-slate-600" />
             </div>
             <span className="font-bold text-slate-500 text-sm">إجمالي الرسوم الدراسية</span>
           </div>
           <div className="flex items-end gap-2">
             <span className="text-3xl font-black text-slate-800">{financialSummary.totalRequired}</span>
             <span className="font-bold text-slate-400 mb-1.5">{financialSummary.currency}</span>
           </div>
         </div>

         {/* Total Paid */}
         <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shadow-sm shadow-emerald-500/10">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2.5 bg-emerald-200/50 rounded-xl">
               <CheckCheck className="w-5 h-5 text-emerald-600" />
             </div>
             <span className="font-bold text-emerald-700 text-sm">المبالغ المدفوعة</span>
           </div>
           <div className="flex items-end gap-2">
             <span className="text-3xl font-black text-emerald-700">{financialSummary.totalPaid}</span>
             <span className="font-bold text-emerald-600/70 mb-1.5">{financialSummary.currency}</span>
           </div>
         </div>

         {/* Remaining */}
         <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 shadow-sm shadow-rose-500/10 relative overflow-hidden">
           {/* Decor */}
           <div className="absolute left-0 top-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2.5 bg-rose-200/50 rounded-xl">
                 <Banknote className="w-5 h-5 text-rose-600" />
               </div>
               <span className="font-bold text-rose-700 text-sm">المبالغ المتبقية</span>
             </div>
             <div className="flex items-end gap-2">
               <span className="text-3xl font-black text-rose-700">{financialSummary.remaining}</span>
               <span className="font-bold text-rose-600/70 mb-1.5">{financialSummary.currency}</span>
             </div>
           </div>
         </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1">
         <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <History className="w-5 h-5 text-indigo-500" />
               تفاصيل الأقساط والدفعات
            </h2>
         </div>

         <div className="overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-100/80">
                  <th className="py-4 px-4 text-slate-400 text-xs font-black uppercase tracking-wider">رقم الفاتورة / الوصف</th>
                  <th className="py-4 px-4 text-slate-400 text-xs font-black uppercase tracking-wider">تاريخ الاستحقاق</th>
                  <th className="py-4 px-4 text-slate-400 text-xs font-black uppercase tracking-wider">المبلغ</th>
                  <th className="py-4 px-4 text-slate-400 text-xs font-black uppercase tracking-wider">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                 {paymentsHistory.map((payment, idx) => {
                    const isPaid = payment.status === "مكتمل";

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        {/* ID and Desc */}
                        <td className="py-4 px-4">
                          <div className="font-black text-slate-800 text-sm mb-1">{payment.type}</div>
                          <div className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">{payment.id}</div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4">
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                            {payment.date}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-4">
                          <div className="font-black text-slate-800 flex items-center gap-1">
                            {payment.amount}
                            <span className="text-[10px] text-slate-500 font-bold">{financialSummary.currency}</span>
                          </div>
                          {isPaid && (
                            <div className="text-[10px] font-bold text-slate-400 mt-1">الدفع عبر: {payment.method}</div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm disabled">
                               <CheckCheck className="w-4 h-4" />
                               مكتمل الدفع
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm">
                               <Clock className="w-4 h-4" />
                               بانتظار الدفع
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                 })}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

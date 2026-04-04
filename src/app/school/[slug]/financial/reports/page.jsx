"use client";
import React from 'react';
import { ClipboardList, Download, Printer, Share2 } from 'lucide-react';

export default function FinancialReportsPage() {
  const reports = [
    { title: "تقرير الإيرادات السنوي", date: "2024-03-30", size: "2.4 MB" },
    { title: "كشف الرواتب والمستحقات", date: "2024-03-25", size: "1.1 MB" },
    { title: "ملخص المصاريف التشغيلية", date: "2024-03-20", size: "850 KB" },
    { title: "تقرير الضرائب والرسوم", date: "2024-03-15", size: "1.5 MB" },
    { title: "موازنة العام الدراسي القادم", date: "2024-03-10", size: "3.2 MB" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-[2rem] p-8 text-white shadow-lg shadow-slate-600/20 relative overflow-hidden flex flex-col justify-center min-h-[160px] w-full md:w-1/2">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <ClipboardList className="w-8 h-8" />
            التقارير المالية
          </h1>
          <p className="text-slate-200 font-medium italic">استعرض وحمل التقارير المالية التفصيلية للمدرسة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-125"></div>
            
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                    <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2 truncate" title={report.title}>{report.title}</h3>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-6">
                    <span>{report.date}</span>
                    <span>{report.size}</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl transition-all font-bold text-xs border border-slate-100">
                        <Download className="w-4 h-4" />
                        تحميل
                    </button>
                    <button className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-100">
                        <Printer className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-100">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

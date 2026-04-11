"use client";

import { Clock, CheckCircle2, XCircle, AlertCircle, CalendarRange } from "lucide-react";

export default function StudentAttendancePage() {
  const stats = {
    present: 42,
    absent: 2,
    late: 1,
    excused: 1,
    total: 46
  };

  const records = [
    { date: "11 أبريل 2026", status: "حاضر", type: "present", note: "" },
    { date: "10 أبريل 2026", status: "حاضر", type: "present", note: "" },
    { date: "09 أبريل 2026", status: "غائب", type: "absent", note: "غياب بدون عذر" },
    { date: "08 أبريل 2026", status: "متأخر", type: "late", note: "تأخير 15 دقيقة طابور الصباح" },
    { date: "07 أبريل 2026", status: "حاضر", type: "present", note: "" },
    { date: "06 أبريل 2026", status: "حاضر", type: "present", note: "" },
    { date: "05 أبريل 2026", status: "غائب بعذر", type: "excused", note: "ظرف صحي (مرفق إجازة مرضية)" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center border border-teal-100">
            <CalendarRange className="w-7 h-7 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">سجل الحضور والغياب</h1>
            <p className="text-sm font-semibold text-slate-400">متابعة التزامك بالدوام المدرسي اليومي</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
            <span className="text-3xl font-black text-slate-800">{stats.present}</span>
            <span className="text-sm font-bold text-slate-400 mt-1">يوم حضور</span>
         </div>
         <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <XCircle className="w-8 h-8 text-rose-500 mb-2" />
            <span className="text-3xl font-black text-slate-800">{stats.absent}</span>
            <span className="text-sm font-bold text-slate-400 mt-1">غياب بدون عذر</span>
         </div>
         <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
            <span className="text-3xl font-black text-slate-800">{stats.late}</span>
            <span className="text-sm font-bold text-slate-400 mt-1">مرات التأخير</span>
         </div>
         <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <Clock className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-3xl font-black text-slate-800">{stats.excused}</span>
            <span className="text-sm font-bold text-slate-400 mt-1">غياب بعذر</span>
         </div>
      </div>

      {/* Timeline / List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">السجل التفصيلي لآخر 7 أيام</h2>
        
        <div className="relative border-r-2 border-slate-100 pr-6 mr-3 space-y-8">
          {records.map((record, idx) => {
            let icon, colorClass, bgClass;
            switch(record.type) {
              case 'present':
                icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
                colorClass = "text-emerald-700 font-bold";
                bgClass = "bg-emerald-50 border-emerald-200";
                break;
              case 'absent':
                icon = <XCircle className="w-4 h-4 text-rose-600" />;
                colorClass = "text-rose-700 font-bold";
                bgClass = "bg-rose-50 border-rose-200 shadow-sm";
                break;
              case 'late':
                icon = <AlertCircle className="w-4 h-4 text-amber-600" />;
                colorClass = "text-amber-700 font-bold";
                bgClass = "bg-amber-50 border-amber-200";
                break;
              case 'excused':
                icon = <Clock className="w-4 h-4 text-blue-600" />;
                colorClass = "text-blue-700 font-bold";
                bgClass = "bg-blue-50 border-blue-200";
                break;
            }

            return (
              <div key={idx} className="relative flex items-center gap-6">
                {/* Timeline Dot */}
                <div className={`absolute -right-[35px] w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-slate-100 shadow-sm z-10`}>
                   {icon}
                </div>

                {/* Card */}
                <div className="flex-1 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                   <div>
                     <div className="font-black text-slate-800 text-sm mb-1">{record.date}</div>
                     {record.note && (
                       <p className="text-xs font-semibold text-slate-500 leading-relaxed">{record.note}</p>
                     )}
                   </div>
                   <div className={`px-4 py-1.5 rounded-xl border text-[11px] ${bgClass} ${colorClass}`}>
                     {record.status}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

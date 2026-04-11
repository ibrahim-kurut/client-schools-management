"use client";

import { FileText, Award, TrendingUp, Search, Calendar } from "lucide-react";

export default function StudentGradesPage() {
  const grades = [
    { subject: "الرياضيات", exam: "اختبار الشهر الأول", score: 95, total: 100, date: "15 أکتوبر 2025", type: "اختبار فصلي", isExcellent: true },
    { subject: "اللغة العربية", exam: "اختبار الشهر الأول", score: 88, total: 100, date: "16 أکتوبر 2025", type: "اختبار فصلي", isExcellent: false },
    { subject: "العلوم", exam: "امتحان نصف السنة", score: 45, total: 50, date: "10 يناير 2026", type: "امتحان نهائي", isExcellent: true },
    { subject: "اللغة الإنجليزية", exam: "تعبير كتابي", score: 18, total: 20, date: "05 فبراير 2026", type: "نشاط", isExcellent: true },
    { subject: "التاريخ", exam: "اختبار قصير", score: 12, total: 20, date: "20 مارس 2026", type: "اختبار قصير", isExcellent: false },
    { subject: "الجغرافيا", exam: "مشروع بحثي", score: 48, total: 50, date: "01 أبريل 2026", type: "نشاط", isExcellent: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
            <Award className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">الدرجات الأكاديمية</h1>
            <p className="text-sm font-semibold text-slate-400">تابع مستواك ونتائج امتحاناتك المستمرة</p>
          </div>
        </div>

        {/* Stats Mini */}
        <div className="flex gap-4">
          <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="text-[10px] font-bold text-slate-400 mb-0.5">المعدل التراكمي</div>
              <div className="text-lg font-black text-slate-800 tracking-tight">92%</div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-500" />
            <div>
              <div className="text-[10px] font-bold text-slate-400 mb-0.5">إجمالي التقييمات</div>
              <div className="text-lg font-black text-slate-800 tracking-tight">15</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
             <h2 className="text-lg font-black text-slate-800">تفاصيل الدرجات</h2>
             <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100">سجل كامل</span>
          </div>

          {/* Search/Filter (Visual) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="ابحث عن مادة..." className="bg-transparent border-none outline-none w-32 px-2 text-sm font-medium text-slate-700" />
            </div>
            <select className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 outline-none">
              <option>جميع الفصول</option>
              <option>الفصل الأول</option>
              <option>الفصل الثاني</option>
            </select>
          </div>
        </div>

        {/* Grades Table */}
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-100/80">
                <th className="py-4 px-4 text-slate-400 text-xs font-black uppercase tracking-wider">الـمـادة</th>
                <th className="py-4 px-4 text-slate-400 text-xs font-black uppercase tracking-wider">تفاصيل التقييم</th>
                <th className="py-4 px-4 text-slate-400 text-xs font-black uppercase tracking-wider">التصنيف</th>
                <th className="py-4 px-4 text-slate-400 text-xs font-black uppercase tracking-wider">النتيجة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {grades.map((grade, idx) => {
                const percentage = (grade.score / grade.total) * 100;
                let colorClass = grade.isExcellent ? "text-emerald-600 bg-emerald-50 border-emerald-100" : (percentage > 70 ? "text-blue-600 bg-blue-50 border-blue-100" : "text-amber-600 bg-amber-50 border-amber-100");
                let barClass = grade.isExcellent ? "bg-emerald-500" : (percentage > 70 ? "bg-blue-500" : "bg-amber-500");

                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Subject */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-black text-sm ${colorClass}`}>
                          {grade.subject.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{grade.subject}</span>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-700 text-sm mb-1">{grade.exam}</div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {grade.date}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-4">
                       <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-500">
                         {grade.type}
                       </span>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1.5 max-w-[120px]">
                        <div className="flex items-baseline justify-between">
                          <span className="font-black text-slate-800">{grade.score}</span>
                          <span className="text-[10px] font-bold text-slate-400">من {grade.total}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barClass}`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
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

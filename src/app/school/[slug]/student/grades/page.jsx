"use client";

import { FileText, Award, TrendingUp, Search, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/lib/axios";

const EXAM_TYPE_AR = {
  OCTOBER: "الشهر الأول",
  NOVEMBER: "الشهر الثاني",
  DECEMBER: "الشهر الثالث",
  MIDYEAR: "نصف السنة",
  MARCH: "الشهر الرابع",
  APRIL: "الشهر الخامس",
  FINAL_EXAM: "الامتحان النهائي",
  SECOND_ROUND_EXAM: "امتحان الدور الثاني",
  FIRST_SEMESTER_AVG: "معدل الفصل الأول",
  SECOND_SEMESTER_AVG: "معدل الفصل الثاني",
  ANNUAL_EFFORT: "السعي السنوي",
  FINAL_GRADE: "الدرجة النهائية",
  LAST_GRADE: "الدرجة النهائية (بعد الدور الثاني)"
};

export default function StudentGradesPage() {
  const { user } = useSelector((state) => state.auth);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/grades/student/${user.id}/current`);
        const fetchedGrades = (res.data.grades || []).map(g => ({
          subject: g.subject?.name || "مادة غير محددة",
          exam: EXAM_TYPE_AR[g.examType] || g.examType,
          score: g.score,
          total: "في التطوير",
          date: "في التطوير",
          type: "في التطوير",
          isExcellent: g.score >= 90
        }));
        setGrades(fetchedGrades);
      } catch (error) {
        console.error("Failed to fetch grades", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [user?.id]);

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
              <div className="text-sm font-black text-slate-800 tracking-tight mt-1">في التطوير</div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-500" />
            <div>
              <div className="text-[10px] font-bold text-slate-400 mb-0.5">إجمالي التقييمات</div>
              <div className="text-lg font-black text-slate-800 tracking-tight">{grades.length}</div>
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
        <div className="overflow-x-auto custom-scrollbar pb-2 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-sm font-bold text-slate-400">جاري تحميل الدرجات...</p>
            </div>
          ) : grades.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 m-6">
               <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
               <p className="text-sm font-bold text-slate-400">لا توجد درجات مسجلة حتى الآن</p>
            </div>
          ) : (
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
                  const percentage = grade.score !== null ? (grade.score / 100) * 100 : 0;
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
                            <span className="font-black text-slate-800">{grade.score ?? "لا يوجد"}</span>
                            <span className="text-[10px] font-bold text-slate-400">{grade.total === "في التطوير" ? "في التطوير" : `من ${grade.total}`}</span>
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
          )}
        </div>
      </div>
    </div>
  );
}

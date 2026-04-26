"use client";
import { useState } from "react";
import { teacherClasses, attendanceStatusLabels } from "@/data/teacherMockData";
import { CalendarCheck, Save, CheckCircle2, User2, Layers, Calendar, Timer, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import Select from "@/components/ui/Select";

export default function AttendancePage() {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);

  const selectedClass = teacherClasses.find((c) => c.id === selectedClassId);
  const students = [...(selectedClass?.students || [])].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`;
    const nameB = `${b.firstName} ${b.lastName}`;
    return nameA.localeCompare(nameB, 'ar');
  });

  const handleClassChange = (val) => {
    setSelectedClassId(val);
    setAttendance({});
    setSaved(false);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
    setSaved(false);
  };

  const handleReasonChange = (studentId, reason) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], reason },
    }));
  };

  const handleMarkAllPresent = () => {
    const allPresent = {};
    students.forEach((s) => {
      allPresent[s.id] = { status: "PRESENT" };
    });
    setAttendance(allPresent);
    setSaved(false);
  };

  const handleSave = () => {
    Swal.fire({
      title: "تنبيه",
      text: "هذا القسم يعمل حالياً ببيانات تجريبية فقط، سيتم ربطه بالخادم قريباً.",
      icon: "info",
      confirmButtonText: "موافق",
      confirmButtonColor: "#4f46e5",
    });
  };

  const allSelected = selectedClassId && selectedDate;

  return (
    <div className="relative space-y-8 animate-fadeIn">
      
      {/* Work In Progress Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 rounded-3xl p-6 mb-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
         <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
               <Timer className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="flex-1 text-center md:text-right">
               <h2 className="text-xl font-black text-amber-900 mb-1">قسم الحضور والغياب</h2>
               <p className="text-sm font-bold text-amber-700 leading-relaxed">
                  نحن نعمل حالياً على تطوير هذا القسم وتوفير تجربة سلسة لتسجيل حضور الطلاب.
               </p>
               <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-xs font-black text-amber-600 uppercase tracking-wider">سيتم تفعيل هذا القسم قريباً في التحديثات القادمة</span>
               </div>
            </div>
         </div>
      </div>

      <div className="pointer-events-none opacity-60 filter blur-[1px]">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-black text-slate-800">الحضور والغياب (تجريبي)</h1>
            <p className="text-sm font-bold text-slate-400 mt-1">واجهة عرض تجريبية - الرصد الفعلي غير متاح حالياً</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Select
                  label="الفصل الدراسي"
                  placeholder="اختر الفصل..."
                  value={selectedClassId}
                  onChange={handleClassChange}
                  options={teacherClasses.map((cls) => ({ value: cls.id, label: cls.name }))}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  التاريخ
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700"
                />
              </div>
            </div>
          </div>

          {allSelected && students.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mt-8 shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <CalendarCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800">{selectedClass?.name}</h3>
                      <p className="text-xs font-bold text-slate-400">{students.length} طالب</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="text-right px-5 py-3.5 text-xs font-black text-slate-400">اسم الطالب</th>
                        <th className="text-center px-3 py-3.5 text-xs font-black text-slate-400">حاضر</th>
                        <th className="text-center px-3 py-3.5 text-xs font-black text-slate-400">غائب</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(0, 5).map((student, idx) => {
                        const isPresent = attendance[student.id]?.status === "PRESENT";
                        return (
                          <tr key={student.id || `student-${idx}`} className="border-t border-slate-50">
                            <td className="px-5 py-4">
                              <span className="font-bold text-sm text-slate-700">{student.firstName} {student.lastName}</span>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <div className={`w-8 h-8 rounded-lg border-2 mx-auto ${isPresent ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`} />
                            </td>
                            <td className="px-3 py-4 text-center">
                              <div className="w-8 h-8 rounded-lg border-2 border-slate-200 mx-auto" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
            </div>
          )}
      </div>
    </div>
  );
}

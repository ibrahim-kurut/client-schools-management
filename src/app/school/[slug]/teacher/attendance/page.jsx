"use client";
import { useState } from "react";
import { teacherClasses, attendanceStatusLabels } from "@/data/teacherMockData";
import { CalendarCheck, Save, CheckCircle2, User2, Layers, Calendar, Clock } from "lucide-react";
import Swal from "sweetalert2";

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

  const handleClassChange = (e) => {
    const val = e.target.value;
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
    const filledRecords = Object.entries(attendance).filter(([_, v]) => v?.status);
    if (filledRecords.length === 0) {
      Swal.fire({
        title: "لا توجد بيانات حضور!",
        text: "يرجى تسجيل حضور طالب واحد على الأقل.",
        icon: "warning",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#4f46e5",
        customClass: {
          popup: "rounded-[32px] font-sans rtl",
          confirmButton: "rounded-2xl px-8 py-3 font-black text-sm",
        },
      });
      return;
    }

    Swal.fire({
      title: "تم الحفظ بنجاح!",
      text: `تم تسجيل حضور ${filledRecords.length} طالب ليوم ${selectedDate}.`,
      icon: "success",
      confirmButtonText: "ممتاز",
      confirmButtonColor: "#4f46e5",
      customClass: {
        popup: "rounded-[32px] font-sans rtl",
        confirmButton: "rounded-2xl px-8 py-3 font-black text-sm",
      },
    });
    setSaved(true);
  };

  const allSelected = selectedClassId && selectedDate;

  // Stats
  const presentCount = Object.values(attendance).filter((a) => a?.status === "PRESENT").length;
  const absentCount = Object.values(attendance).filter((a) => a?.status === "ABSENT").length;
  const lateCount = Object.values(attendance).filter((a) => a?.status === "LATE").length;
  const excusedCount = Object.values(attendance).filter((a) => a?.status === "EXCUSED").length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">الحضور والغياب</h1>
        <p className="text-sm font-bold text-slate-400 mt-1">سجّل حضور وغياب طلابك بسهولة</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Class Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              الفصل الدراسي
            </label>
            <select
              value={selectedClassId}
              onChange={handleClassChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all appearance-none cursor-pointer"
            >
              <option value="">اختر الفصل...</option>
              {teacherClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
              <Calendar className="w-4 h-4 text-violet-500" />
              التاريخ
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setSaved(false); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      {allSelected && students.length > 0 ? (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "حاضر", count: presentCount, color: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500" },
              { label: "غائب", count: absentCount, color: "bg-red-50 text-red-600 border-red-100", dot: "bg-red-500" },
              { label: "متأخر", count: lateCount, color: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-500" },
              { label: "مستأذن", count: excusedCount, color: "bg-blue-50 text-blue-600 border-blue-100", dot: "bg-blue-500" },
            ].map((stat, i) => (
              <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${stat.color}`}>
                <div className={`w-3 h-3 rounded-full ${stat.dot}`} />
                <span className="text-sm font-black">{stat.label}</span>
                <span className="mr-auto text-lg font-black">{stat.count}</span>
              </div>
            ))}
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                  <CalendarCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800">{selectedClass?.name}</h3>
                  <p className="text-xs font-bold text-slate-400">{selectedDate} · {students.length} طالب</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllPresent}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  الكل حاضر
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${
                    saved
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:-translate-y-0.5"
                  }`}
                >
                  {saved ? (
                    <><CheckCircle2 className="w-4 h-4" /> تم الحفظ</>
                  ) : (
                    <><Save className="w-4 h-4" /> حفظ</>
                  )}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="text-right px-5 py-3.5 text-xs font-black text-slate-400 w-12">#</th>
                    <th className="text-right px-5 py-3.5 text-xs font-black text-slate-400">اسم الطالب</th>
                    <th className="text-center px-3 py-3.5 text-xs font-black text-slate-400">حاضر</th>
                    <th className="text-center px-3 py-3.5 text-xs font-black text-slate-400">غائب</th>
                    <th className="text-center px-3 py-3.5 text-xs font-black text-slate-400">متأخر</th>
                    <th className="text-center px-3 py-3.5 text-xs font-black text-slate-400">مستأذن</th>
                    <th className="text-right px-5 py-3.5 text-xs font-black text-slate-400">ملاحظة</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const record = attendance[student.id] || {};
                    const status = record.status;

                    return (
                      <tr key={student.id} className="border-t border-slate-50 hover:bg-slate-50/30 transition-colors">
                        <td className="px-5 py-4 text-sm font-bold text-slate-400">{idx + 1}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${student.gender === 'MALE' ? 'bg-blue-50' : 'bg-pink-50'} flex items-center justify-center`}>
                              <User2 className={`w-4 h-4 ${student.gender === 'MALE' ? 'text-blue-500' : 'text-pink-500'}`} />
                            </div>
                            <span className="font-bold text-sm text-slate-700">
                              {student.firstName} {student.lastName}
                            </span>
                          </div>
                        </td>

                        {/* Status Radio Buttons */}
                        {["PRESENT", "ABSENT", "LATE", "EXCUSED"].map((statusType) => {
                          const info = attendanceStatusLabels[statusType];
                          const isSelected = status === statusType;
                          return (
                            <td key={statusType} className="px-3 py-4 text-center">
                              <button
                                onClick={() => handleStatusChange(student.id, statusType)}
                                className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                                  isSelected
                                    ? `${info.color} border-current scale-110 shadow-sm`
                                    : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                                }`}
                              >
                                {isSelected && <div className={`w-3 h-3 rounded-full ${info.dot}`} />}
                              </button>
                            </td>
                          );
                        })}

                        {/* Reason Input */}
                        <td className="px-5 py-4">
                          <input
                            type="text"
                            value={record.reason || ""}
                            onChange={(e) => handleReasonChange(student.id, e.target.value)}
                            placeholder={status && status !== "PRESENT" ? "السبب..." : "—"}
                            disabled={!status || status === "PRESENT"}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CalendarCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="font-black text-lg text-slate-700 mb-2">اختر الفصل والتاريخ</h3>
          <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto">
            قم باختيار الفصل الدراسي والتاريخ من القوائم أعلاه لبدء تسجيل الحضور والغياب.
          </p>
        </div>
      )}
    </div>
  );
}

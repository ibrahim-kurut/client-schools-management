"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClasses } from "@/redux/slices/classesSlice";
import axiosInstance from "@/lib/axios";
import { Layers, Printer, Search, Loader2, User2, Eye } from "lucide-react";
import StudentReportCard from "@/components/grades/StudentReportCard";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function AdminGradesPage() {
  const params = useParams();
  const slug = params?.slug || '';
  const dispatch = useDispatch();
  const { classes, status: classesStatus } = useSelector((state) => state.classes);
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [selectedClassId, setSelectedClassId] = useState("");
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [schoolInfo, setSchoolInfo] = useState({});
  const [academicYear, setAcademicYear] = useState({});

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showBulkPrint, setShowBulkPrint] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const loadResults = async (classId) => {
    if (!classId) return;
    setIsLoadingResults(true);
    try {
      const res = await axiosInstance.get(`/grades/class/${classId}/results`);
      if (res.data.success) {
        const { classData, subjects, students, grades, school, academicYear } = res.data.results;
        setClassData(classData);
        setSubjects(subjects || []);
        setStudents(students || []);
        setGrades(grades || []);
        setSchoolInfo(school || {});
        setAcademicYear(academicYear || {});
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: err.response?.data?.message || "فشل في جلب نتائج الطلاب",
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000
      });
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleClassChange = (e) => {
    const val = e.target.value;
    setSelectedClassId(val);
    if (val) {
      loadResults(val);
    } else {
      setStudents([]);
    }
  };

  const handlePrintAll = () => {
    setShowBulkPrint(true);
    // Give DOM time to render all components, then print
    setTimeout(() => {
        setIsPrinting(true);
        window.print();
        setTimeout(() => {
            setShowBulkPrint(false);
            setIsPrinting(false);
        }, 500);
    }, 100);
  };

  return (
    <>
      {showBulkPrint && (
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * { visibility: hidden !important; }
              .bulk-print-container, .bulk-print-container * { visibility: visible !important; }
              .bulk-print-container { 
                position: absolute !important;
                top: 0 !important; left: 0 !important;
                width: 100% !important;
                margin: 0 !important; padding: 0 !important;
              }
              .page-break { page-break-after: always; }
              @page { size: portrait; margin: 15mm; }
            }
          `
        }} />
      )}

      <div className="space-y-8 animate-fadeIn print:hidden">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">نتائج الطلاب</h1>
            <p className="text-sm font-bold text-slate-400 mt-1">عرض وطباعة نتائج طلاب الصفوف الدراسية</p>
          </div>

          {students.length > 0 && (
            <button
              onClick={handlePrintAll}
              disabled={isPrinting}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-black text-sm shadow-lg shadow-blue-200"
            >
              {isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              طباعة نتائج الصف كاملاً
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                تحديد الصف الدراسي
              </label>
              <div className="relative">
                <select
                  value={selectedClassId}
                  onChange={handleClassChange}
                  disabled={classesStatus === "loading"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 appearance-none"
                >
                  <option value="">اختر الصف لفتح النتائج...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
                {classesStatus === "loading" && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {selectedClassId ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {isLoadingResults ? (
              <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="font-bold text-slate-500">جاري تحميل النتائج...</p>
              </div>
            ) : students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase w-16 text-center">#</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">اسم الطالب</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase w-32 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-400 text-center">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${student.gender === 'MALE' ? 'bg-blue-50' : 'bg-pink-50'}`}>
                              <User2 className={`w-4 h-4 ${student.gender === 'MALE' ? 'text-blue-500' : 'text-pink-500'}`} />
                            </div>
                            <span className="font-bold text-sm text-slate-700">{student.firstName} {student.lastName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                             <button
                               onClick={() => setSelectedStudent(student)}
                               className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg text-xs font-black transition-all"
                             >
                               <Eye className="w-3.5 h-3.5" />
                               معاينة وطباعة
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="font-black text-slate-700 mb-1">لا يوجد طلاب</h3>
                <p className="text-sm font-bold text-slate-400">هذا الصف لا يحتوي على طلاب مسجلين.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6">
              <Layers className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="font-black text-lg text-slate-700 mb-2">اختر صفاً دراسياً</h3>
            <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto">
              قم باختيار الصف من القائمة أعلاه لعرض قائمة الطلاب واستخراج نتائجهم للطباعة.
            </p>
          </div>
        )}
      </div>

      {/* Render the Single Print Modal */}
      {selectedStudent && (
        <StudentReportCard
          student={selectedStudent}
          subjects={subjects}
          grades={grades}
          className={classData?.name}
          schoolName={schoolInfo.name}
          schoolLogo={schoolInfo.logo}
          adminName={schoolInfo.adminName}
          academicYear={academicYear.name}
          onClose={() => setSelectedStudent(null)}
          isBulkMode={false}
        />
      )}

      {/* Hidden Container for Bulk Printing */}
      <div className="bulk-print-container hidden print:block bg-white absolute top-0 left-0 w-full z-[9999]" dir="rtl">
         {showBulkPrint && students.map((student) => (
           <div key={student.id} className="page-break">
              <StudentReportCard
                  student={student}
                  subjects={subjects}
                  grades={grades}
                  className={classData?.name}
                  schoolName={schoolInfo.name}
                  schoolLogo={schoolInfo.logo}
                  adminName={schoolInfo.adminName}
                  academicYear={academicYear.name}
                  isBulkMode={true}
              />
           </div>
         ))}
      </div>
    </>
  );
}

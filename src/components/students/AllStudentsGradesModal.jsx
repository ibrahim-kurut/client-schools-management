import React from "react";
import { User2, X, Printer, BookOpen, Layers, Calendar } from "lucide-react";

/**
 * AllStudentsGradesModal - A professional printable modal for all students grades.
 * 
 * Props:
 * - students: Array of student objects (already sorted alphabetically).
 * - grades: Array of all grades for the selected class/subject.
 * - selectedClass: The class object.
 * - selectedSubject: The subject object.
 * - academicYear: The academic year name (e.g., "2024 - 2025").
 * - onClose: Function to close the modal.
 */
const AllStudentsGradesModal = ({ 
  students = [], 
  grades = [], 
  selectedClass, 
  selectedSubject, 
  academicYear = "2024 - 2025", 
  teacherName,
  onClose 
}) => {
  if (!students || students.length === 0) return null;

  // Grade columns matching the teacher's dashboard
  const COLUMNS = [
    { label: 'تشرين الأول', value: 'OCTOBER' },
    { label: 'تشرين الثاني', value: 'NOVEMBER' },
    { label: 'كانون الأول', value: 'DECEMBER' },
    { label: 'معدل الفصل الأول', value: 'FIRST_SEMESTER_AVG', isCalc: true },
    { label: 'نصف السنة', value: 'MIDYEAR' },
    { label: 'آذار', value: 'MARCH' },
    { label: 'نيسان', value: 'APRIL' },
    { label: 'معدل الفصل الثاني', value: 'SECOND_SEMESTER_AVG', isCalc: true },
    { label: 'السعي السنوي', value: 'ANNUAL_EFFORT', isCalc: true },
    { label: 'النهائي', value: 'FINAL_EXAM' },
    { label: 'النتيجة', value: 'FINAL_GRADE', isCalc: true },
  ];

  const getStudentGradeForType = (studentId, examType) => {
    const grade = grades.find(g => g.studentId === studentId && g.examType === examType);
    return grade?.score ?? null;
  };

  const calculateResults = (studentId) => {
    const oct = getStudentGradeForType(studentId, 'OCTOBER');
    const nov = getStudentGradeForType(studentId, 'NOVEMBER');
    const dec = getStudentGradeForType(studentId, 'DECEMBER');
    const midyear = getStudentGradeForType(studentId, 'MIDYEAR');
    const mar = getStudentGradeForType(studentId, 'MARCH');
    const apr = getStudentGradeForType(studentId, 'APRIL');
    const finalExam = getStudentGradeForType(studentId, 'FINAL_EXAM');

    const hasValue = (v) => v !== null && v !== undefined;
    const countAvailable = (...vals) => vals.filter(hasValue).length;
    const getAvg = (...vals) => {
      const valid = vals.filter(hasValue);
      return valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
    };

    // Logical Calculations (Matching individual modal logic)
    // First Semester Average: requires at least 2 grades from (Oct, Nov, Dec)
    const firstAvg = countAvailable(oct, nov, dec) >= 2 ? getAvg(oct, nov, dec) : null;
    
    // Second Semester Average: requires both (Mar, Apr)
    const secondAvg = countAvailable(mar, apr) >= 2 ? getAvg(mar, apr) : null;
    
    // Annual Effort: requires First Avg, Midyear, and Second Avg
    const annualEffort = (hasValue(firstAvg) && hasValue(midyear) && hasValue(secondAvg)) ? getAvg(firstAvg, midyear, secondAvg) : null;
    
    // Final Grade: requires Annual Effort and Final Exam
    const finalGrade = (hasValue(annualEffort) && hasValue(finalExam)) ? getAvg(annualEffort, finalExam) : null;

    return {
      FIRST_SEMESTER_AVG: firstAvg,
      SECOND_SEMESTER_AVG: secondAvg,
      ANNUAL_EFFORT: annualEffort,
      FINAL_GRADE: finalGrade
    };
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            size: portrait;
            margin: 15mm 10mm 15mm 10mm;
          }
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            width: 190mm;
            margin: 0 auto;
            direction: rtl;
            background: white;
          }
          .no-print {
            display: none !important;
          }
          table {
            page-break-inside: auto;
            width: 100% !important;
            table-layout: fixed; /* Keep columns equal */
            border-collapse: collapse !important;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td {
            overflow: hidden;
            word-wrap: break-word;
            border: 1pt solid black !important;
          }
          .print-area th {
             background-color: transparent !important;
          }
        }
      `}} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:p-0">
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
          onClick={onClose}
        />

        <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden print:max-h-none print:shadow-none print:rounded-none print:static print:w-full print-area">
          
          {/* Action Bar - Hidden in print */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10 print:hidden">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Printer className="w-5 h-5 text-indigo-600" />
               </div>
               <h2 className="text-xl font-black text-slate-800">معاينة طباعة سجل الدرجات</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold text-sm"
              >
                <Printer className="w-4 h-4" />
                طباعة الآن
              </button>
              <button
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-8 overflow-y-auto print:overflow-visible custom-scrollbar flex-1 bg-white">
            
            {/* Professional Print Header */}
            <div className="mb-10 text-center relative">
               <div className="inline-block p-4 border-2 border-slate-900 rounded-2xl mb-6 bg-slate-50 print:bg-transparent">
                  <h1 className="text-2xl font-black text-slate-900 mb-2">سجل درجات {selectedSubject?.name}</h1>
                  <div className="flex items-center justify-center gap-8 text-slate-600 font-bold text-xs">
                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> الفصل: {selectedClass?.name}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {academicYear}</span>
                  </div>
               </div>
               
               <div className="absolute left-0 top-0 text-left hidden print:block">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">تاريخ الطباعة</p>
                  <p className="text-[10px] font-black text-slate-800">{new Date().toLocaleDateString('ar-EG')}</p>
               </div>
            </div>

            {/* Grades Table */}
            <div className="w-full">
              <table className="w-full border-collapse border border-black" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                  <tr className="bg-slate-100 print:bg-white">
                    <th className="border border-black p-1 text-[10px] font-black text-slate-900" style={{ width: '8mm' }}>#</th>
                    <th className="border border-black p-2 text-[10px] font-black text-slate-900 text-right" style={{ width: '45mm' }}>اسم الطالب</th>
                    
                    {COLUMNS.map((col, i) => (
                      <th key={i} className={`border border-black p-0 relative h-36 ${col.isCalc ? 'bg-indigo-50/50 print:bg-white' : ''}`} style={{ width: '11.5mm' }}>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <span className="transform -rotate-90 whitespace-nowrap text-[10px] font-black text-slate-900 leading-none" style={{ width: '34mm', textAlign: 'center' }}>
                              {col.label}
                            </span>
                         </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const results = calculateResults(student.id);
                    return (
                      <tr key={student.id} className="hover:bg-slate-100 transition-colors">
                        <td className="border border-black p-1 text-[10px] font-black text-slate-900 text-center">
                          {idx + 1}
                        </td>
                        <td className="border border-black px-2 py-1.5 text-[11px] font-black text-slate-900 text-right truncate">
                          {student.firstName} {student.lastName}
                        </td>
                        
                        {COLUMNS.map((col, i) => {
                          let score = col.isCalc ? results[col.value] : getStudentGradeForType(student.id, col.value);
                          const isFail = score !== null && Number(score) < 50;
                          
                          return (
                            <td 
                              key={i} 
                              className={`border border-black p-1 text-center text-[10px] font-black ${
                                col.isCalc ? 'bg-indigo-50/10 print:bg-white' : ''
                              } ${isFail ? 'text-red-600' : 'text-slate-900'}`}
                            >
                              {score !== null ? score : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Signature Section */}
            <div className="mt-16 grid grid-cols-2 gap-10 text-center">
              <div className="space-y-2">
                <p className="text-sm font-black text-slate-800">مدرس المادة</p>
                <div className="border-b-2 border-slate-300 w-3/4 mx-auto border-dashed"> {teacherName}</div>
              </div>
              {/* <div className="space-y-2">
                <p className="text-sm font-black text-slate-800">مدير المدرسة</p>
                <div className="border-b-2 border-slate-300 w-3/4 mx-auto border-dashed"></div>
              </div> */}
               <div className="space-y-2">
                <p className="text-sm font-black text-slate-800">ختم المدرسة</p>
                <div className="w-24 h-24 border-2 border-slate-300 rounded-full mx-auto flex items-center justify-center opacity-30 border-dashed">
                   <span className="text-[10px] font-bold">الختم الرسمي</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 hidden print:block">
               نظام إدارة المدارس المتكامل · تم التوليد آلياً بواسطة المنصة
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AllStudentsGradesModal;

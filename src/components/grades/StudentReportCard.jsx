"use client";
import React from "react";
import { X, Printer, Layers, Calendar } from "lucide-react";

/**
 * StudentReportCard - A professional printable report card for a single student.
 * 
 * The table rows are SUBJECTS (not students), and columns are exam periods.
 * This mirrors the AllStudentsGradesModal layout but pivoted for individual student results.
 * 
 * Props:
 * - student: { id, firstName, lastName, gender }
 * - subjects: Array of { id, name }
 * - grades: Array of all grades for this student
 * - className: The class name
 * - schoolName: School name
 * - schoolLogo: School logo URL
 * - adminName: School admin name (for footer)
 * - academicYear: e.g. "2024 - 2025"
 * - onClose: close handler (null if used in bulk print mode)
 * - isBulkMode: if true, no close button nor action bar (used in bulk printing)
 */

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

const StudentReportCard = ({
  student,
  subjects = [],
  grades = [],
  className = "",
  schoolName = "اسم المدرسة",
  schoolLogo = null,
  adminName = "",
  academicYear = "2024 - 2025",
  onClose = null,
  isBulkMode = false,
}) => {
  if (!student) return null;

  // Get grade for a specific subject and exam type
  const getGrade = (subjectId, examType) => {
    const grade = grades.find(
      (g) => g.studentId === student.id && g.subjectId === subjectId && g.examType === examType
    );
    return grade?.score ?? null;
  };

  // Calculate derived averages for a specific subject
  const calculateResults = (subjectId) => {
    const oct = getGrade(subjectId, 'OCTOBER');
    const nov = getGrade(subjectId, 'NOVEMBER');
    const dec = getGrade(subjectId, 'DECEMBER');
    const midyear = getGrade(subjectId, 'MIDYEAR');
    const mar = getGrade(subjectId, 'MARCH');
    const apr = getGrade(subjectId, 'APRIL');
    const finalExam = getGrade(subjectId, 'FINAL_EXAM');

    const hasValue = (v) => v !== null && v !== undefined;
    const countAvailable = (...vals) => vals.filter(hasValue).length;
    const getAvg = (...vals) => {
      const valid = vals.filter(hasValue);
      return valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
    };

    const firstAvg = countAvailable(oct, nov, dec) >= 2 ? getAvg(oct, nov, dec) : null;
    const secondAvg = countAvailable(mar, apr) >= 2 ? getAvg(mar, apr) : null;
    const annualEffort = (hasValue(firstAvg) && hasValue(midyear) && hasValue(secondAvg)) ? getAvg(firstAvg, midyear, secondAvg) : null;
    const finalGrade = (hasValue(annualEffort) && hasValue(finalExam)) ? getAvg(annualEffort, finalExam) : null;

    return {
      FIRST_SEMESTER_AVG: firstAvg,
      SECOND_SEMESTER_AVG: secondAvg,
      ANNUAL_EFFORT: annualEffort,
      FINAL_GRADE: finalGrade,
    };
  };

  const reportContent = (
    <div className={`bg-white ${isBulkMode ? '' : ''}`} dir="rtl">
      {/* Print Header: School info + student info */}
      <div className="flex items-center justify-between mb-8 border-b-2 border-slate-900 pb-4">
        
        {/* RIGHT: School Name */}
        <div className="flex-1 text-right">
          <h2 className="text-2xl font-black text-slate-900 mb-2">{schoolName}</h2>
          <p className="text-sm font-bold text-slate-500">سجل النتائج النهائي المعتمد</p>
        </div>

        {/* CENTER: Logo */}
        <div className="flex-1 flex justify-center">
          {schoolLogo ? (
            <div className="bg-white p-1 rounded-full border-2 border-slate-200 shadow-sm print:shadow-none">
                <img src={schoolLogo} alt="شعار المدرسة" className="w-20 h-20 rounded-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-400">الشعار</span>
            </div>
          )}
        </div>

        {/* LEFT: Student details & Date */}
        <div className="flex-1 flex flex-col items-end">
           <div className="hidden print:block mb-2 text-left w-full">
             <p className="text-[10px] font-bold text-slate-500">تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
           </div>
           
           <div className="bg-slate-50 print:bg-transparent border border-slate-200 print:border-transparent print:p-0 p-4 rounded-xl text-right min-w-[200px]">
             <h1 className="text-lg font-black text-slate-900 mb-3 border-b border-slate-200 print:border-slate-800 pb-2">
               {student.firstName} {student.lastName}
             </h1>
             <div className="flex flex-col gap-2 text-slate-700 font-bold text-xs">
               <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-500 print:text-slate-800" /> الصف: {className}</span>
               <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500 print:text-slate-800" /> العام الدراسي: {academicYear}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Grades Table - Rows are subjects */}
      <div className="w-full">
        <table className="w-full border-collapse border border-black" style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr className="bg-slate-100 print:bg-white">
              <th className="border border-black p-1 text-[10px] font-black text-slate-900" style={{ width: '8mm' }}>#</th>
              <th className="border border-black p-2 text-[10px] font-black text-slate-900 text-right" style={{ width: '45mm' }}>اسم المادة</th>

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
            {subjects.map((subject, idx) => {
              const results = calculateResults(subject.id);
              return (
                <tr key={subject.id} className="hover:bg-slate-100 transition-colors">
                  <td className="border border-black p-1 text-[10px] font-black text-slate-900 text-center">
                    {idx + 1}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-[11px] font-black text-slate-900 text-right truncate">
                    {subject.name}
                  </td>

                  {COLUMNS.map((col, i) => {
                    let score = col.isCalc ? results[col.value] : getGrade(subject.id, col.value);
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
          <p className="text-sm font-black text-slate-800">مدير المدرسة</p>
          <div className="border-b-2 border-slate-300 w-3/4 mx-auto border-dashed">{adminName}</div>
        </div>
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
  );

  // If in bulk mode, just render the content (no modal wrapping)
  if (isBulkMode) {
    return reportContent;
  }

  // Modal view (for single student preview)
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
          .student-report-print-area, .student-report-print-area * {
            visibility: visible;
          }
          .student-report-print-area {
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
            table-layout: fixed;
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
          .student-report-print-area th {
            background-color: transparent !important;
          }
        }
      `}} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:p-0">
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
          onClick={onClose}
        />

        <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden print:max-h-none print:shadow-none print:rounded-none print:static print:w-full student-report-print-area">
          
          {/* Action Bar */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Printer className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-black text-slate-800">معاينة نتيجة الطالب</h2>
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
            {reportContent}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentReportCard;

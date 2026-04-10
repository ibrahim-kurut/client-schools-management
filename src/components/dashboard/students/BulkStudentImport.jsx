"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Upload, FileSpreadsheet, Download, X, CheckCircle2,
  AlertCircle, Loader2, Users, ChevronDown, Info
} from 'lucide-react';
import { bulkImportStudents, resetImportStatus, fetchStudents } from '../../../redux/slices/studentsSlice';
import { fetchClasses } from '../../../redux/slices/classesSlice';
import Swal from 'sweetalert2';

export default function BulkStudentImport({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { importStatus, importError, importErrors } = useSelector((state) => state.students);
  const { classes, status: classesStatus } = useSelector((state) => state.classes);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // جلب الصفوف عند فتح المودال
  useEffect(() => {
    if (isOpen && classesStatus === 'idle') {
      dispatch(fetchClasses());
    }
  }, [isOpen, classesStatus, dispatch]);

  // إعادة تعيين الحالة عند الإغلاق
  useEffect(() => {
    if (!isOpen) {
      dispatch(resetImportStatus());
      setSelectedClassId('');
      setSelectedFile(null);
    }
  }, [isOpen, dispatch]);

  // التحقق من نوع الملف
  const isValidFileType = (file) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/csv',
    ];
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    return validTypes.includes(file.type) || validExtensions.includes(extension);
  };

  // معالجة اختيار الملف
  const handleFileSelect = (file) => {
    if (!file) return;
    if (!isValidFileType(file)) {
      Swal.fire({
        title: 'صيغة غير مدعومة',
        text: 'يرجى رفع ملف بصيغة Excel (.xlsx) أو CSV (.csv) فقط.',
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      return;
    }
    // حد الحجم 5MB
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'حجم الملف كبير',
        text: 'الحد الأقصى لحجم الملف هو 5 ميجابايت.',
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      return;
    }
    setSelectedFile(file);
    dispatch(resetImportStatus());
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files?.[0]);
  };

  // --- Drag & Drop ---
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true); // Optimize to stop continuous state updates
  }, [isDragging]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  }, []);

  // تحميل النموذج الفارغ
  const handleDownloadTemplate = async () => {
    try {
      const { default: axiosInstance } = await import('../../../lib/axios');
      const res = await axiosInstance.get('/school-user/import-template', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire({
        title: 'خطأ',
        text: 'تعذر تحميل النموذج. حاول مرة أخرى.',
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
    }
  };

  // بدء عملية الاستيراد
  const handleImport = async () => {
    if (!selectedClassId) {
      Swal.fire({
        title: 'تحديد الصف مطلوب',
        text: 'يرجى اختيار الصف الدراسي أولاً قبل رفع الملف.',
        icon: 'warning',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      return;
    }
    if (!selectedFile) {
      Swal.fire({
        title: 'لم يتم اختيار ملف',
        text: 'يرجى اختيار ملف Excel أو CSV لرفعه.',
        icon: 'warning',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      return;
    }

    const result = await dispatch(bulkImportStudents({ classId: selectedClassId, file: selectedFile }));

    if (result.meta.requestStatus === 'fulfilled') {
      Swal.fire({
        title: 'تم الاستيراد بنجاح! 🎉',
        text: result.payload.message,
        icon: 'success',
        confirmButtonText: 'ممتاز',
        confirmButtonColor: '#16a34a',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      // إعادة تحميل قائمة الطلاب
      dispatch(fetchStudents({ page: 1, limit: 5, search: '' }));
      onClose();
    }
  };

  // إزالة الملف المختار
  const handleRemoveFile = () => {
    setSelectedFile(null);
    dispatch(resetImportStatus());
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  const selectedClassName = classes.find(c => c.id === selectedClassId)?.name || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Removed backdrop-blur-sm as it causes massive rendering lag on some machines */}
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-t-[2rem] p-8 text-white relative overflow-hidden">
          {/* Reduced blur intensity from 2xl/xl to md/lg to prevent graphics rendering lag */}
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-md"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-md"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black">استيراد الطلاب من ملف إكسل</h2>
                <p className="text-emerald-100 font-medium mt-1">رفع جماعي سريع لبيانات الطلاب</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">

          {/* الخطوة 1: اختيار الصف */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 font-bold text-lg mb-3">
              <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-sm font-black">1</span>
              اختر الصف الدراسي
            </label>
            <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl py-4 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-bold cursor-pointer transition-all hover:bg-slate-100 text-base"
                disabled={importStatus === 'loading'}
              >
                <option value="">— اختر الصف —</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* الخطوة 2: رفع الملف */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 font-bold text-lg mb-3">
              <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-sm font-black">2</span>
              ارفع ملف الإكسل
            </label>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
                  ${isDragging
                    ? 'border-emerald-500 bg-emerald-50 scale-[1.02]'
                    : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-slate-600 font-bold text-lg mb-1">
                  {isDragging ? 'أفلت الملف هنا' : 'اسحب الملف هنا أو اضغط للاختيار'}
                </p>
                <p className="text-slate-400 text-sm font-medium">
                  الصيغ المدعومة: XLSX, CSV • الحد الأقصى: 5MB • حتى 100 طالب
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-200 text-emerald-700 rounded-xl flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{selectedFile.name}</p>
                    <p className="text-slate-500 text-sm font-medium">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="w-10 h-10 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  disabled={importStatus === 'loading'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* معلومات مساعدة */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 font-medium">
              <p className="font-bold mb-1">تلميحات مهمة:</p>
              <ul className="space-y-1 list-disc list-inside text-blue-600">
                <li>الأعمدة الإجبارية: <span className="font-mono font-bold">firstName</span>, <span className="font-mono font-bold">lastName</span>, <span className="font-mono font-bold">parentPhone</span>, <span className="font-mono font-bold">birthDate</span>, <span className="font-mono font-bold">gender</span></li>
                <li>الأعمدة الاختيارية: <span className="font-mono font-bold">studentCode</span>, <span className="font-mono font-bold">motherName</span>, <span className="font-mono font-bold">guardianMaritalStatus</span></li>
                <li>رقم الهاتف يجب أن يتكون من 10 أرقام (مثال: 0770936701)</li>
                <li>الجنس: اكتب <span className="font-mono font-bold">ذكر</span> أو <span className="font-mono font-bold">أنثى</span> (أو MALE / FEMALE)</li>
                <li>تاريخ الميلاد بصيغة: <span className="font-mono font-bold">YYYY-MM-DD</span> (مثال: 2012-05-15)</li>
                <li>كلمة مرور الطالب ستكون رقم هاتف ولي الأمر</li>
              </ul>
            </div>
          </div>

          {/* رسائل الأخطاء */}
          {importStatus === 'failed' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold">
                <AlertCircle className="w-5 h-5" />
                {importError}
              </div>
              {importErrors.length > 0 && (
                <ul className="space-y-1 text-red-600 text-sm font-medium max-h-40 overflow-y-auto pr-2">
                  {importErrors.map((err, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* رسالة النجاح */}
          {importStatus === 'succeeded' && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 flex items-center gap-3 text-emerald-700 font-bold">
              <CheckCircle2 className="w-6 h-6" />
              تم استيراد الطلاب بنجاح!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-6 flex flex-col sm:flex-row items-center gap-3 justify-between bg-slate-50/50 rounded-b-[2rem]">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-5 py-3 rounded-2xl font-bold transition-all cursor-pointer border border-emerald-200"
            disabled={importStatus === 'loading'}
          >
            <Download className="w-5 h-5" />
            تحميل النموذج الفارغ
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
              disabled={importStatus === 'loading'}
            >
              إلغاء
            </button>
            <button
              onClick={handleImport}
              disabled={!selectedClassId || !selectedFile || importStatus === 'loading'}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all cursor-pointer
                ${(!selectedClassId || !selectedFile || importStatus === 'loading')
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5'
                }
              `}
            >
              {importStatus === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الاستيراد...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  بدء الاستيراد
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

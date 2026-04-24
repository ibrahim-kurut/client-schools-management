"use client";
import React, { useState, useCallback, useEffect, memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, CreditCard, CheckCircle2, User, Calendar, FileText, ChevronDown, BookOpen, Bus, Shirt, Search, Loader2, Printer, CheckCircle } from 'lucide-react';
import { fetchStudentsSummary, createPayment, resetCreateStatus } from '../../../redux/slices/feesSlice';
import Select from '../../ui/Select';

// Map payment type to arabic label
const paymentTypeLabels = {
  TUITION: 'أقساط دراسية',
  TRANSPORT: 'أجور نقل',
  UNIFORM: 'زي مدرسي',
  BOOKS: 'كتب وملازم',
  ACTIVITIES: 'أنشطة لاصفية',
  OTHER: 'أخرى (متفرقة)'
};

const paymentStatusLabels = {
  COMPLETED: 'مكتملة',
  PENDING: 'معلقة',
  CANCELLED: 'ملغاة',
  REFUNDED: 'مسترجعة'
};

const AddPaymentModal = memo(function AddPaymentModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { students, status: feesStatus, createStatus, createError, createdRecord } = useSelector((state) => state.fees);
  const { user } = useSelector((state) => state.auth);
  const actualUser = user?.userData || user;
  const schoolName = actualUser?.schoolName || actualUser?.school?.name || '---';

  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    paymentType: 'TUITION',
    date: new Date().toISOString().split('T')[0],
    note: '',
    status: 'COMPLETED'
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const dropdownRef = useRef(null);

  // Validation Error State
  const [validationError, setValidationError] = useState(null);

  // Receipt View State
  const [isReceiptView, setIsReceiptView] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const getArabicPaymentType = useCallback((type) => {
    const normalizedType = String(type || '').toUpperCase();
    return paymentTypeLabels[normalizedType] || type || 'غير محدد';
  }, []);

  const getArabicPaymentStatus = useCallback((status) => {
    const normalizedStatus = String(status || '').toUpperCase();
    return paymentStatusLabels[normalizedStatus] || status || 'غير محدد';
  }, []);

  // Focus modal after successful creation
  useEffect(() => {
    if (createStatus === 'succeeded' && createdRecord) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ضروري لعرض بيانات الوصل بعد نجاح عملية الدفع
      setReceiptData({
        ...createdRecord,
        studentName: selectedStudent?.name,
        className: selectedStudent?.className,
        totalFees: selectedStudent?.totalFees || 0,
        paidAfter: parseFloat(selectedStudent?.paid || 0) + parseFloat(createdRecord.amount || 0),
        balanceAfter: parseFloat(selectedStudent?.balance || 0) - parseFloat(createdRecord.amount || 0)
      });
      setIsReceiptView(true);
      dispatch(resetCreateStatus());
    }
  }, [createStatus, createdRecord, dispatch, selectedStudent]);

  // Close modal reset state
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ضروري لإعادة تعيين حالة المودال عند الإغلاق
      setSearchQuery('');
      setSelectedStudent(null);
      setIsDropdownOpen(false);
      setIsReceiptView(false);
      setReceiptData(null);
      setValidationError(null);
      dispatch(resetCreateStatus());
      setFormData({
        studentId: '',
        amount: '',
        paymentType: 'TUITION',
        date: new Date().toISOString().split('T')[0],
        note: '',
        status: 'COMPLETED'
      });
    }
  }, [isOpen, dispatch]);

  // Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() && searchQuery !== selectedStudent?.name) {
        dispatch(fetchStudentsSummary({ search: searchQuery, limit: 5 }));
        setIsDropdownOpen(true);
      } else {
        setIsDropdownOpen(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch, selectedStudent]);

  // Handle clicking outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelectStudent = useCallback((student) => {
    setSelectedStudent(student);
    setFormData(prev => ({ ...prev, studentId: student.id }));
    setSearchQuery(student.name);
    setIsDropdownOpen(false);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.studentId) {
       setValidationError("الرجاء اختيار طالب أولاً");
       return;
    }

    const parsedAmount = parseFloat(formData.amount);

    // Validate: payment must not exceed remaining balance (TUITION only)
    if (formData.paymentType === 'TUITION' && selectedStudent) {
      if (selectedStudent.balance <= 0) {
        setValidationError("لا يوجد رصيد متبقي على هذا الطالب، تم تسديد كامل الأقساط الدراسية");
        return;
      }
      if (parsedAmount > selectedStudent.balance) {
        setValidationError(`لا يمكن تسجيل دفعة بقيمة ${parsedAmount.toLocaleString()} د.ع لأنها تتجاوز المبلغ المتبقي على الطالب وهو ${selectedStudent.balance.toLocaleString()} د.ع`);
        return;
      }
    }
    
    // Dispatch createPayment
    dispatch(createPayment({
      ...formData,
      amount: parsedAmount
    }));

  }, [formData, dispatch, selectedStudent]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white" dir="rtl">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300 print:hidden"
        onClick={!isReceiptView ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] print:shadow-none print:w-full print:max-w-none print:h-auto print:max-h-max print:rounded-none`} 
      >
        {isReceiptView && receiptData ? (
          // ================= RECEIPT VIEW =================
          <div className="flex flex-col h-full overflow-hidden print:h-auto print:overflow-visible">
            {/* Action Bar (Hidden on Print) */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <CheckCircle className="w-5 h-5" />
                تم تسجيل الدفعة بنجاح
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-white hover:bg-slate-100 rounded-xl flex items-center justify-center transition-all border border-slate-200 shadow-sm"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Receipt Content (Printed area) */}
            <div className="p-8 sm:p-12 overflow-y-auto flex-1 min-h-0 print:overflow-visible print:p-0">
              <div className="border-2 border-slate-200 rounded-3xl p-8 relative overflow-hidden print:border-slate-800 print:rounded-lg">
                {/* School/System Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none print:opacity-[0.05]">
                  <CreditCard className="w-96 h-96" />
                </div>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-10 pb-6 border-b border-dashed border-slate-300 print:border-slate-400">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight print:text-black">وصل استلام</h1>
                    <p className="text-slate-500 font-medium mt-1">نظام إدارة {schoolName}</p>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-400 mb-1">رقم الوصل (رقم الفاتورة)</div>
                    <div className="text-xl font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg print:bg-transparent print:text-black print:px-0">
                      {receiptData.invoiceNumber || '---'}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="text-sm font-bold text-slate-400 mb-1 border-r-4 border-slate-200 pr-2">معلومات الطالب</div>
                    <div className="text-lg font-black text-slate-800">{receiptData.studentName}</div>
                    <div className="text-sm text-slate-500">{receiptData.className || 'غير مسجل في صف'}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-400 mb-1 border-l-4 border-slate-200 pl-2">تاريخ تسجيل الدفعة</div>
                    <div className="text-lg font-black text-slate-800 dir-ltr">{new Date(receiptData.date).toLocaleDateString('en-GB')}</div>
                    <div className="text-sm text-slate-500">حالة الدفع: {getArabicPaymentStatus(receiptData.status)}</div>
                  </div>
                </div>

                {/* Financial Table */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-8 print:bg-white print:border print:border-slate-300">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 print:border-slate-300">
                    <div className="font-bold text-slate-500">البيان</div>
                    <div className="font-bold text-slate-500">المبلغ المدفوع هذا الوصل</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-black text-lg text-slate-800">{getArabicPaymentType(receiptData.paymentType)}</div>
                      <div className="text-sm text-slate-500 mt-1 max-w-[200px] break-words">{receiptData.note || 'بدون ملاحظات'}</div>
                    </div>
                    <div className="text-3xl font-black text-emerald-600 tracking-tight print:text-black">
                      {receiptData.amount.toLocaleString()} <span className="text-sm text-slate-500 font-bold">د.ع</span>
                    </div>
                  </div>
                </div>

                {/* Account Status Summary inside the Receipt */}
                <div className="grid grid-cols-3 gap-4 mb-4 pb-8 border-b border-slate-200 print:border-slate-300">
                  <div className="text-center p-3 bg-white border border-slate-200 rounded-2xl print:bg-transparent print:p-0 print:border print:border-slate-300 print:py-3 print:rounded-lg shadow-sm print:shadow-none">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1">القسط الكلي</div>
                    <div className="text-sm sm:text-lg font-black text-slate-800">{receiptData.totalFees.toLocaleString()} <span className="text-[10px] text-slate-500">د.ع</span></div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 border border-emerald-100 rounded-2xl print:bg-transparent print:p-0 print:border print:border-slate-300 print:py-3 print:rounded-lg shadow-sm print:shadow-none">
                    <div className="text-[10px] sm:text-xs font-bold text-emerald-600 mb-1 print:text-slate-500">إجمالي المدفوع للآن</div>
                    <div className="text-sm sm:text-lg font-black text-emerald-700 print:text-slate-800">{receiptData.paidAfter.toLocaleString()} <span className="text-[10px] text-emerald-600/70 print:text-slate-500">د.ع</span></div>
                  </div>
                  <div className="text-center p-3 bg-rose-50 border border-rose-100 rounded-2xl print:bg-transparent print:p-0 print:border print:border-slate-300 print:py-3 print:rounded-lg shadow-sm print:shadow-none">
                    <div className="text-[10px] sm:text-xs font-bold text-rose-600 mb-1 print:text-slate-500">المتبقي بذمته</div>
                    <div className="text-sm sm:text-lg font-black text-rose-700 print:text-slate-800">{Math.max(0, receiptData.balanceAfter).toLocaleString()} <span className="text-[10px] text-rose-600/70 print:text-slate-500">د.ع</span></div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-center mt-12 pt-4 print:border-slate-300">
                  <div className="text-center">
                    <div className="w-32 h-px bg-slate-300 mx-auto mb-2 print:bg-slate-400"></div>
                    <div className="text-sm font-bold text-slate-600">توقيع المستلم {receiptData.recordedByName}</div>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-px bg-slate-300 mx-auto mb-2 print:bg-slate-400"></div>
                    <div className="text-sm font-bold text-slate-600">توقيع الدافع (ولي الأمر)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Form (Hidden on print) */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0 flex items-center justify-end gap-3 z-20 print:hidden">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 rounded-2xl text-slate-600 bg-red-200 font-bold hover:bg-red-300 transition-colors cursor-pointer"
              >
                إغلاق
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Printer className="w-5 h-5 cursor-pointer" />
                طباعة الوصل
              </button>
            </div>
          </div>

        ) : (
          // ================= FORM VIEW =================
          <>
            {/* Header */}
            <div className="bg-gradient-to-l from-blue-600 to-indigo-700 p-6 text-white shrink-0 relative overflow-hidden print:hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center ring-1 ring-white/20 shadow-inner">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-1">تسجيل دفعة جديدة</h2>
                    <p className="text-blue-100 text-sm font-medium">إضافة معاملة مالية جديدة لحساب طالب</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 hover:rotate-90 rounded-xl flex items-center justify-center transition-all relative z-10"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Decorative Background Shapes */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16 blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12 blur-xl"></div>
            </div>

            {/* Form Body */}
            <div className="p-6 overflow-y-auto no-scrollbar relative flex-1 bg-slate-50 print:hidden">
              {createError && (
                 <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-sm font-bold">
                    {createError}
                 </div>
              )}
              <form id="add-payment-form" onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* Student Search / Selection */}
                <div className="space-y-2 relative" ref={dropdownRef}>
                  <label className="text-sm font-bold text-slate-700">الطالب</label>
                  <div className="relative">
                    {feesStatus === 'loading' ? (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
                    ) : (
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    )}
                    
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (selectedStudent && e.target.value !== selectedStudent.name) {
                          setSelectedStudent(null);
                          setFormData(prev => ({ ...prev, studentId: '' }));
                        }
                      }}
                      onFocus={() => {
                        if (searchQuery.trim() && students.length > 0 && !selectedStudent) {
                          setIsDropdownOpen(true);
                        }
                      }}
                      placeholder="ابحث عن طالب بالاسم..." 
                      className={`w-full bg-white border ${selectedStudent ? 'border-emerald-500 ring-emerald-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'} rounded-2xl py-3 pr-12 pl-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 transition-all shadow-sm`}
                      required
                      autoComplete="off"
                    />
                    
                    {selectedStudent && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        تم الاختيار
                      </div>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {isDropdownOpen && !selectedStudent && (
                    <div className="absolute top-[100%] mt-2 right-0 left-0 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50">
                      {students.length > 0 ? (
                        students.map((student) => (
                          <div 
                            key={student.id} 
                            onClick={() => handleSelectStudent(student)}
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-sm text-slate-800">{student.name}</div>
                              <div className="text-xs text-slate-500">{student.className}</div>
                            </div>
                            <div className="text-left">
                              <div className="text-[10px] text-slate-400">المتبقي</div>
                              <div className={`text-xs font-bold ${student.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {student.balance.toLocaleString()} د.ع
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-slate-500">
                          {feesStatus === 'loading' ? 'جاري البحث...' : 'لا يوجد طلاب بهذا الاسم'}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Financial Summary Cards for Selected Student */}
                {selectedStudent && (
                  <div className="grid grid-cols-3 gap-3 mb-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
                    <div className="absolute -left-4 -top-4 w-16 h-16 bg-blue-500/5 rounded-full blur-xl"></div>
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/5 rounded-full blur-xl"></div>
                    
                    <div className="text-center relative z-10">
                      <div className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1">القسط الكلي</div>
                      <div className="text-sm sm:text-lg font-black text-slate-800 tracking-tight">
                        {selectedStudent.totalFees.toLocaleString()} <span className="text-[10px] text-slate-500 font-bold">د.ع</span>
                      </div>
                    </div>
                    <div className="text-center relative z-10 border-r border-blue-200/50">
                      <div className="text-[10px] sm:text-xs font-bold text-emerald-600 mb-1">المدفوع</div>
                      <div className="text-sm sm:text-lg font-black text-emerald-600 tracking-tight">
                        {selectedStudent.paid.toLocaleString()} <span className="text-[10px] text-emerald-600/70 font-bold">د.ع</span>
                      </div>
                    </div>
                    <div className="text-center relative z-10 border-r border-blue-200/50">
                      <div className="text-[10px] sm:text-xs font-bold text-rose-600 mb-1">المتبقي عليه</div>
                      <div className="text-sm sm:text-lg font-black text-rose-600 tracking-tight">
                        {selectedStudent.balance.toLocaleString()} <span className="text-[10px] text-rose-600/70 font-bold">د.ع</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">المبلغ</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">د.ع</div>
                      <input 
                        type="number" 
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0" 
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 pr-4 pl-16 text-xl font-black text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm dir-ltr text-right"
                        required
                      />
                    </div>
                  </div>

                  {/* Date (Auto/Readonly) */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 text-slate-500">تاريخ الدفع (تلقائي)</label>
                    <div className="relative opacity-70 cursor-not-allowed">
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        readOnly
                        className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3 pr-12 pl-4 text-sm font-bold text-slate-600 focus:outline-none shadow-sm cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Type */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">نوع الرسوم</label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className={`cursor-pointer border-2 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all ${formData.paymentType === 'TUITION' ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-md shadow-blue-500/10' : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'}`}>
                      <input type="radio" name="paymentType" value="TUITION" checked={formData.paymentType === 'TUITION'} onChange={handleChange} className="hidden" />
                      <div className={`p-2 rounded-xl ${formData.paymentType === 'TUITION' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-center">أقساط دراسية</span>
                    </label>
                    
                    <label className={`cursor-pointer border-2 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all ${formData.paymentType === 'TRANSPORT' ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-md shadow-blue-500/10' : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'}`}>
                      <input type="radio" name="paymentType" value="TRANSPORT" checked={formData.paymentType === 'TRANSPORT'} onChange={handleChange} className="hidden" />
                      <div className={`p-2 rounded-xl ${formData.paymentType === 'TRANSPORT' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Bus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-center">أجور نقل</span>
                    </label>

                    <label className={`cursor-pointer border-2 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all ${formData.paymentType === 'UNIFORM' ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-md shadow-blue-500/10' : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'}`}>
                      <input type="radio" name="paymentType" value="UNIFORM" checked={formData.paymentType === 'UNIFORM'} onChange={handleChange} className="hidden" />
                      <div className={`p-2 rounded-xl ${formData.paymentType === 'UNIFORM' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Shirt className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-center">زي مدرسي</span>
                    </label>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">حالة الدفعة</label>
                  <div className="relative">
                    <Select 
                      value={formData.status}
                      onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                      options={[
                        { value: 'COMPLETED', label: 'مكتملة (تم استلام المبلغ)' },
                        { value: 'PENDING', label: 'معلقة (قيد المعالجة / شيك)' }
                      ]}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">البيان / ملاحظات إضافية (اختياري)</label>
                  <div className="relative">
                    <FileText className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
                    <textarea 
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="مثال: الدفعة الأولى من القسط الدراسي..." 
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 pr-12 pl-4 min-h-[100px] max-h-[150px] text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm resize-y"
                    ></textarea>
                  </div>
                </div>

              </form>
            </div>

            {/* Footer Actions (Hidden on print) */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0 flex flex-col gap-4 z-20 print:hidden">
              {validationError && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <p className="text-[14px] font-black text-amber-800 flex-1 leading-snug">
                    {validationError}
                  </p>
                  <button onClick={() => setValidationError(null)} className="p-1 hover:bg-amber-100 rounded-md transition-colors">
                    <X className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                  disabled={createStatus === 'loading'}
                >
                  إلغاء
                </button>
                <button 
                  form="add-payment-form"
                  type="submit" 
                  disabled={!formData.studentId || createStatus === 'loading'}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${!formData.studentId || createStatus === 'loading' ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:-translate-y-0.5'}`}
                >
                  {createStatus === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      تأكيد التسجيل
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed.inset-0.z-50.p-4 * {
            visibility: visible;
          }
          .fixed.inset-0.z-50.p-4 {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
});

AddPaymentModal.displayName = 'AddPaymentModal';

export default AddPaymentModal;

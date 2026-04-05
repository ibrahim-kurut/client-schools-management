"use client";
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, 
  TrendingDown, 
  DollarSign, 
  Calendar as CalendarIcon, 
  FileText, 
  User, 
  Search, 
  Loader2, 
  CheckCircle2,
  Tag,
  Plus,
  Printer,
  CheckCircle,
  CreditCard
} from 'lucide-react';
import { createExpense, updateExpense, resetExpensesStatus } from '../../../redux/slices/expensesSlice';
import { fetchMembers } from '../../../redux/slices/membersSlice';

const expenseTypes = [
  { value: 'SALARY', label: 'رواتب', color: 'text-purple-600', bg: 'bg-purple-50', hover: 'hover:text-purple-600 hover:bg-purple-50 hover:border-purple-200' },
  { value: 'MAINTENANCE', label: 'صيانة', color: 'text-orange-600', bg: 'bg-orange-50', hover: 'hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200' },
  { value: 'SUPPLIES', label: 'معدات وتوريدات', color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200' },
  { value: 'RENT', label: 'إيجار', color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200' },
  { value: 'UTILITIES', label: 'خدمات عامة', color: 'text-rose-600', bg: 'bg-rose-50', hover: 'hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200' },
  { value: 'MARKETING', label: 'تسويق', color: 'text-indigo-600', bg: 'bg-indigo-50', hover: 'hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200' },
  { value: 'OTHER', label: 'أخرى', color: 'text-slate-600', bg: 'bg-slate-50', hover: 'hover:text-slate-600 hover:bg-slate-50 hover:border-slate-200' },
];

const expenseTypeLabels = {
  SALARY: "رواتب",
  MAINTENANCE: "صيانة",
  SUPPLIES: "معدات وتوريدات",
  RENT: "إيجار",
  UTILITIES: "خدمات عامة",
  MARKETING: "تسويق",
  OTHER: "أخرى"
};

// Memoized Recipient Item for performance
const RecipientItem = memo(({ member, onSelect }) => (
  <div 
    onClick={() => onSelect(member)}
    className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group"
  >
    <div>
      <div className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">{member.firstName} {member.lastName}</div>
      <div className="text-[10px] text-slate-500 font-bold">{member.role}</div>
    </div>
    <Plus className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
  </div>
));

RecipientItem.displayName = 'RecipientItem';

export default function ExpenseModal({ isOpen, onClose, expense = null, mode = 'form' }) {
  const dispatch = useDispatch();
  const { createStatus, updateStatus, createError, updateError } = useSelector((state) => state.expenses);
  const { members, status: membersStatus } = useSelector((state) => state.members);
  
  const { user } = useSelector((state) => state.auth);
  
  // Get school name from auth dynamically
  const actualUser = user?.userData || user;
  const schoolName = actualUser?.schoolName || actualUser?.school?.name || '-----'; 

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'OTHER',
    date: new Date().toISOString().split('T')[0],
    recipientId: '',
    recipientName: ''
  });

  // Recipient Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const dropdownRef = useRef(null);

  // Voucher View State
  const [isVoucherView, setIsVoucherView] = useState(false);
  const [voucherData, setVoucherData] = useState(null);

  // Initialize form
  useEffect(() => {
    if (isOpen && expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        type: expense.type || 'OTHER',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        recipientId: expense.recipientId || '',
        recipientName: expense.recipientName || ''
      });
      
      if (expense.recipient) {
        const name = `${expense.recipient.firstName} ${expense.recipient.lastName}`;
        setSelectedRecipient({ id: expense.recipientId, name, role: expense.recipient.role });
        setSearchQuery(name);
      } else if (expense.recipientName) {
        setSelectedRecipient(null);
        setSearchQuery(expense.recipientName);
      }

      if (mode === 'voucher') {
        setVoucherData(expense);
        setIsVoucherView(true);
      } else {
        setIsVoucherView(false);
        setVoucherData(null);
      }
    } else if (isOpen) {
      setFormData({
        title: '',
        amount: '',
        type: 'OTHER',
        date: new Date().toISOString().split('T')[0],
        recipientId: '',
        recipientName: ''
      });
      setSelectedRecipient(null);
      setSearchQuery('');
      setIsVoucherView(false);
      setVoucherData(null);
    }
  }, [isOpen, expense, mode]);

  // Handle successful save
  useEffect(() => {
    if (isVoucherView || !isOpen) return;
    
    if (createStatus === 'succeeded' || updateStatus === 'succeeded') {
       // Handled in handleSubmit logic for direct response data
    }
  }, [createStatus, updateStatus, isVoucherView, isOpen]);

  // Debounced Search for Recipients
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() && (!selectedRecipient || searchQuery !== selectedRecipient.name)) {
        dispatch(fetchMembers({ search: searchQuery, limit: 5 }));
        setIsDropdownOpen(true);
      } else {
        setIsDropdownOpen(false);
      }
    }, 400); // Slightly faster debounce
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch, selectedRecipient]);

  // Handle clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectRecipient = useCallback((member) => {
    const name = `${member.firstName} ${member.lastName}`;
    setSelectedRecipient({ id: member.id, name, role: member.role });
    setFormData(prev => ({ ...prev, recipientId: member.id, recipientName: '' }));
    setSearchQuery(name);
    setIsDropdownOpen(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: formData.date,
      recipientId: selectedRecipient ? selectedRecipient.id : null,
      recipientName: !selectedRecipient && searchQuery ? searchQuery : null
    };

    let resultAction;
    if (expense) {
      resultAction = await dispatch(updateExpense({ id: expense.id, expenseData: data }));
    } else {
      resultAction = await dispatch(createExpense(data));
    }

    if (resultAction.type.endsWith('fulfilled')) {
      setVoucherData(resultAction.payload);
      setIsVoucherView(true);
      dispatch(resetExpensesStatus());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const isLoading = createStatus === 'loading' || updateStatus === 'loading';
  const error = createError || updateError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60" dir="rtl">
      {/* Container */}
      <div className={`relative bg-white rounded-[2rem] w-full ${isVoucherView ? 'max-w-2xl h-[85vh]' : 'max-w-lg'} overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col`}>
        
        {isVoucherView && voucherData ? (
          /* ================= REDESIGNED VOUCHER VIEW (وصل صرف) ================= */
          <div className="flex flex-col h-full overflow-hidden print:h-auto print:overflow-visible">
            {/* Header (Action Bar) - Hidden on Print */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 flex items-center justify-between print:hidden">
               <div className="flex items-center gap-2 text-emerald-600 font-bold">
                 <CheckCircle className="w-5 h-5" />
                 تم تسجيل السند بنجاح
               </div>
               <button onClick={onClose} className="w-10 h-10 bg-white hover:bg-slate-100 rounded-xl flex items-center justify-center transition-all border border-slate-200 shadow-sm">
                  <X className="w-5 h-5 text-slate-500" />
               </button>
            </div>

            {/* Voucher Content (Printed area) */}
            <div className="p-8 sm:p-12 overflow-y-auto flex-1 min-h-0 print:overflow-visible print:p-0">
              <div className="border-2 border-slate-200 rounded-3xl p-8 relative overflow-hidden print:border-slate-800 print:rounded-lg">
                
                {/* Watermark style */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none print:opacity-[0.05]">
                  <TrendingDown className="w-96 h-96 text-emerald-600" />
                </div>

                {/* Header */}
                <div className="flex justify-between items-start mb-10 pb-6 border-b border-dashed border-slate-300 print:border-slate-400">
                   <div>
                      <h1 className="text-3xl font-black text-slate-800 tracking-tight print:text-black">وصل صرف</h1>
                      <p className="text-slate-500 font-medium mt-1">نظام إدارة {schoolName}</p>
                   </div>
                   <div className="text-left">
                      <div className="text-sm font-bold text-slate-400 mb-1">رقم الوصل</div>
                      <div className="text-xl font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg print:bg-transparent print:text-black print:px-0">
                        #{voucherData?.id?.slice(-6).toUpperCase() || '---'}
                      </div>
                   </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                   <div>
                      <div className="text-sm font-bold text-slate-400 mb-1 border-r-4 border-emerald-500 pr-2">يصرف للسيد/ة</div>
                      <div className="text-lg font-black text-slate-800">
                        {voucherData?.recipient ? `${voucherData.recipient.firstName} ${voucherData.recipient.lastName}` : (voucherData?.recipientName || '---')}
                      </div>
                      {voucherData?.recipient?.role && (
                        <div className="text-xs text-slate-500 font-bold mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded-md">
                          {voucherData.recipient.role}
                        </div>
                      )}
                   </div>
                   <div className="text-left">
                      <div className="text-sm font-bold text-slate-400 mb-1 border-l-4 border-slate-200 pl-2">تاريخ الصرف</div>
                      <div className="text-lg font-black text-slate-800 dir-ltr">
                         {voucherData?.date ? new Date(voucherData.date).toLocaleDateString('en-GB') : '---'}
                      </div>
                      <div className="text-sm text-slate-500">حالة الصرف: مكتملة (نقد)</div>
                   </div>
                </div>

                {/* Financial Table - Central Summary */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-8 print:bg-white print:border print:border-slate-300">
                   <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 print:border-slate-300">
                      <div className="font-bold text-slate-500">البيان (تفاصيل المصروف)</div>
                      <div className="font-bold text-slate-500">المبلغ المصروف</div>
                   </div>
                   <div className="flex justify-between items-center">
                      <div>
                        <div className="font-black text-lg text-slate-800 uppercase">{voucherData?.title || '---'}</div>
                        <div className="text-xs text-slate-500 mt-1 bg-white px-2 py-0.5 rounded-md inline-block print:border border-slate-100">
                           تصنيف: {expenseTypeLabels[voucherData?.type] || (voucherData?.type || '---')}
                        </div>
                      </div>
                      <div className="text-3xl font-black text-emerald-600 tracking-tight print:text-black">
                        {voucherData?.amount?.toLocaleString() || '0'} <span className="text-sm text-slate-500 font-bold">د.ع</span>
                      </div>
                   </div>
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-center mt-12 pt-4">
                   <div className="text-center">
                      <div className="w-44 h-px bg-slate-300 mx-auto mb-2 print:bg-slate-400"></div>
                      <div className="text-sm font-bold text-slate-600">توقيع المستلم</div>
                      <div className="text-sm text-slate-800 mt-1 font-black">
                        {voucherData?.recipient ? `${voucherData.recipient.firstName} ${voucherData.recipient.lastName}` : (voucherData?.recipientName || '')}
                      </div>
                   </div>
                   <div className="text-center">
                      <div className="w-44 h-px bg-slate-300 mx-auto mb-2 print:bg-slate-400"></div>
                      <div className="text-sm font-bold text-slate-600">أمين الصندوق (المحاسب)</div>
                      <div className="text-sm text-slate-800 mt-1 font-black">
                        {voucherData?.recordedBy?.firstName} {voucherData?.recordedBy?.lastName}
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Footer Form (Print Button) - Hidden on print */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0 flex items-center justify-end gap-3 z-20 print:hidden">
               <button 
                onClick={onClose}
                className="px-6 py-3 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
               >
                 إغلاق
               </button>
               <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
               >
                 <Printer className="w-5 h-5" />
                 طباعة الوصل
               </button>
            </div>
          </div>
        ) : (
          /* ================= OPTIMIZED FORM VIEW (إضافة/تعديل) ================= */
          <>
            {/* Header */}
            <div className="bg-gradient-to-l from-emerald-600 to-emerald-700 p-6 text-white shrink-0 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center ring-1 ring-white/20 shadow-inner">
                      <TrendingDown className="w-6 h-6" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black mb-1">{expense ? 'تعديل مصروف' : 'إضافة مصروف جديد'}</h2>
                     <p className="text-emerald-100 text-sm font-medium">تسجيل وتقييد المصاريف التشغيلية</p>
                   </div>
                </div>
                <button onClick={onClose} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all relative z-10">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16 blur-2xl"></div>
            </div>

            {/* Form Body */}
            <div className="p-6 overflow-y-auto no-scrollbar relative flex-1 bg-slate-50">
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-sm font-bold flex items-center gap-2">
                  {error}
                </div>
              )}

              <form id="expense-form" onSubmit={handleSubmit} className="space-y-5 relative z-10 pb-14">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 mr-1 uppercase">عنوان المصروف</label>
                  <div className="relative">
                    <FileText className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleChange}
                      placeholder="مثال: فاتورة الكهرباء، راتب شهر آذار..." 
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pr-12 pl-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Amount */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 mr-1">المبلغ</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">IQD</div>
                      <input 
                        type="number" 
                        name="amount" 
                        value={formData.amount} 
                        onChange={handleChange}
                        placeholder="0.00" 
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pr-4 pl-14 text-lg font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 mr-1">التاريخ</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Type Selection Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 mr-1 flex items-center gap-2">
                    <Tag className="w-3 h-3 text-emerald-500" />
                    تصنيف المصروف
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {expenseTypes.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setFormData(p => ({...p, type: t.value}))}
                        className={`py-2.5 rounded-xl text-[1rem] cursor-pointer font-black transition-all border ${
                          formData.type === t.value 
                            ? `border-emerald-500 ${t.bg} ${t.color} shadow-sm` 
                            : `border-slate-100 bg-white text-slate-600 ${t.hover}`
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optimized Recipient Selection */}
                <div className="space-y-1.5 relative" ref={dropdownRef}>
                  <label className="text-xs font-black text-slate-500 mr-1">المستلم</label>
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (selectedRecipient && e.target.value !== selectedRecipient.name) setSelectedRecipient(null);
                      }}
                      onFocus={() => {
                        if (searchQuery.trim() && !selectedRecipient) setIsDropdownOpen(true);
                      }}
                      placeholder="ابحث عن العضو أو اكتب الاسم..." 
                      className={`w-full bg-white border ${selectedRecipient ? 'border-emerald-500 ring-emerald-500/10' : 'border-slate-200 focus:border-emerald-500'} rounded-2xl py-3.5 pr-10 pl-4 text-sm font-bold text-slate-700 transition-all outline-none shadow-sm`}
                      required={formData.type === 'SALARY'} 
                    />
                    {selectedRecipient && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        مسجل
                      </div>
                    )}
                  </div>

                  {/* Dropdown with Memoized Items */}
                  {isDropdownOpen && !selectedRecipient && (
                    <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50 max-h-40 overflow-y-auto">
                      {members.length > 0 ? (
                        members.map((member) => (
                          <RecipientItem 
                            key={member.id} 
                            member={member} 
                            onSelect={handleSelectRecipient} 
                          />
                        ))
                      ) : (
                        <div className="p-3 text-center text-[10px] text-slate-400">
                          {membersStatus === 'loading' ? 'جاري البحث...' : 'يمكنك استخدام هذا الاسم يدوياً'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-white border-t border-slate-400 shrink-0 flex items-center justify-end gap-3 z-20">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                disabled={isLoading}
              >
                إلغاء
              </button>
              <button 
                form="expense-form"
                type="submit" 
                disabled={isLoading || (formData.type === 'SALARY' && !searchQuery)}
                className={`px-8 py-3 rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 ${
                  isLoading || (formData.type === 'SALARY' && !searchQuery)
                  ? 'bg-slate-300 shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (expense ? 'تحديث وحفظ' : 'حفظ المصروف')}
              </button>
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
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .fixed.inset-0.z-50.p-4 > div {
             box-shadow: none !important;
             border: none !important;
             max-height: none !important;
             overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}

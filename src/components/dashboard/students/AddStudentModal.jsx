"use client";
import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, GraduationCap, Calendar, Users, Loader2 } from 'lucide-react';

export default function AddStudentModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    // Mock simulation
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-xl" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-1">إضافة طالب جديد</h2>
            <p className="text-blue-100 text-sm">أدخل بيانات الطالب الشخصية وولي الأمر لتسجيله بالنظام</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors relative z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex-1 flex flex-col items-center gap-2 relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 transition-colors duration-300 ${step >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-200 text-slate-500'}`}>
              1
            </div>
            <span className={`text-sm font-bold ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>بيانات الطالب</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2 relative">
            <div className="absolute top-5 right-1/2 w-full h-[2px] bg-slate-200 -z-0 -translate-y-1/2">
              <div className={`h-full bg-blue-600 transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 transition-colors duration-300 ${step >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
              2
            </div>
            <span className={`text-sm font-bold ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>بيانات ولي الأمر والأكاديمية</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الأول</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="أحمد" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">اسم العائلة</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="العلي" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني (إلزامي للدخول)</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" dir="ltr" placeholder="student@example.com" className="w-full text-right bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
                  <div className="relative">
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">***</span>
                    <input type="password" dir="ltr" placeholder="••••••••" className="w-full text-right bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ الميلاد</label>
                  <div className="relative">
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-600 font-sans" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الجنس</label>
                  <div className="relative">
                    <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-600">
                      <option value="MALE">ذكر</option>
                      <option value="FEMALE">أنثى</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف (للتواصل مع الطالب أو ولي الأمر)</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="tel" dir="ltr" placeholder="077xxxxxxxxx" className="w-full text-right bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
                <h3 className="text-sm font-black text-blue-800 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  البيانات الأكاديمية
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">الصف الدراسي</label>
                  <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm">
                    <option>الصف العاشر</option>
                    <option>الصف التاسع</option>
                    <option>الصف الثامن</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6">
                <h3 className="text-sm font-black text-emerald-800 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  البيانات المالية (ملف الطالب)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-700 mb-2">قيمة الخصم المالي (إن وجد)</label>
                    <div className="relative">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">$</span>
                      <input type="number" min="0" placeholder="0" className="w-full text-right bg-white border border-emerald-200 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-emerald-700" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-700 mb-2">ملاحظات الخصم</label>
                    <input type="text" placeholder="مثال: خصم تفوق أو خصم إخوة..." className="w-full bg-white border border-emerald-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm" />
                  </div>
                </div>
              </div>

            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
          <button 
            type="button"
            onClick={() => {
              if (step === 2) setStep(1);
              else onClose();
            }}
            className="px-6 py-3 text-slate-500 hover:text-slate-700 bg-red-200 hover:bg-red-300 rounded-xl font-bold transition-colors cursor-pointer"
          >
            {step === 2 ? 'السابق' : 'إلغاء التنفيذ'}
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center min-w-[140px] px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              step === 1 ? 'متابعة' : 'حفظ وتسجيل'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

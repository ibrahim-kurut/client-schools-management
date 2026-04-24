"use client";
import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Calculator, BookOpen, Check } from 'lucide-react';

export default function RoleChangeModal({ isOpen, onClose, onConfirm, member }) {
  const [selectedRole, setSelectedRole] = useState(member?.role || 'TEACHER');

  if (!isOpen) return null;

  const roles = [
    {
      id: 'TEACHER',
      title: 'معلم',
      desc: 'إدارة الصفوف، المواد الدراسية، والدرجات للطلاب.',
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 'ASSISTANT',
      title: 'معاون',
      desc: 'إشراف إداري شامل، إضافة معلمين ومحاسبين، وإدارة الصفوف.',
      icon: UserCheck,
      color: 'purple'
    },
    {
      id: 'ACCOUNTANT',
      title: 'محاسب',
      desc: 'إدارة الشؤون المالية، رسوم الطلاب، والمصاريف والرواتب.',
      icon: Calculator,
      color: 'amber'
    }
  ];

  const handleConfirm = () => {
    onConfirm(selectedRole);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-[95vh] sm:max-h-[90vh]" 
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900 p-6 sm:p-8 text-white relative overflow-hidden shrink-0">
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
               <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30 shadow-inner">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
               </div>
               <div>
                  <h2 className="text-lg sm:text-xl font-black mb-0.5">تغيير الدور الوظيفي</h2>
                  <p className="text-blue-100/80 text-[10px] sm:text-xs font-bold leading-none">
                    تعديل رتبة: <span className="text-white">{member?.firstName} {member?.lastName}</span>
                  </p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all relative z-20"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-4">
          <p className="text-slate-400 text-[11px] sm:text-sm font-bold px-1 mb-2 sm:mb-6">يرجى اختيار الدور الوظيفي الجديد من القائمة أدناه:</p>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 text-right w-full ${
                  selectedRole === role.id 
                    ? `border-blue-500 bg-blue-50 shadow-md shadow-blue-500/5` 
                    : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-lg'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  selectedRole === role.id 
                    ? `bg-blue-600 text-white scale-110 shadow-lg` 
                    : `bg-blue-100 text-blue-600`
                }`}>
                  <role.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <h3 className={`font-black text-base sm:text-lg ${
                      selectedRole === role.id ? `text-blue-700` : 'text-slate-700'
                    }`}>
                      {role.title}
                    </h3>
                    {selectedRole === role.id && (
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 flex items-center justify-center text-white animate-in zoom-in duration-300`}>
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className="text-slate-400 text-[10px] sm:text-xs font-bold leading-relaxed">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={handleConfirm}
            className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs sm:text-sm"
          >
            تأكيد الدور الجديد
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white text-slate-500 font-bold rounded-2xl border border-slate-200 hover:bg-slate-100 hover:text-slate-700 transition-all text-xs sm:text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

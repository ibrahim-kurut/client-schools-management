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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100" 
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30 shadow-inner">
                  <ShieldCheck className="w-7 h-7 text-white" />
               </div>
               <div>
                  <h2 className="text-xl font-black mb-1">تغيير الدور الوظيفي</h2>
                  <p className="text-blue-100/80 text-xs font-bold leading-none">
                    تعديل رتبة: <span className="text-white">{member?.firstName} {member?.lastName}</span>
                  </p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all relative z-20"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-4">
          <p className="text-slate-400 text-sm font-bold px-1 mb-6">يرجى اختيار الدور الوظيفي الجديد من القائمة أدناه:</p>
          
          <div className="grid grid-cols-1 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative group flex items-start gap-4 p-5 rounded-3xl border-2 transition-all duration-300 text-right w-full ${
                  selectedRole === role.id 
                    ? `border-${role.color}-500 bg-${role.color}-50 shadow-md shadow-${role.color}-500/5` 
                    : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/50'
                }`}
              >
                {/* Visual state for Tailwind 4 bridge (ensuring colors work) */}
                <span className="hidden border-blue-500 bg-blue-50 shadow-blue-500/5 text-blue-600 bg-blue-100"></span>
                <span className="hidden border-purple-500 bg-purple-50 shadow-purple-500/5 text-purple-600 bg-purple-100"></span>
                <span className="hidden border-amber-500 bg-amber-50 shadow-amber-500/5 text-amber-600 bg-amber-100"></span>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  selectedRole === role.id 
                    ? `bg-${role.color}-500 text-white scale-110 shadow-lg` 
                    : `bg-${role.color}-100 text-${role.color}-600`
                }`}>
                  <role.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-black text-lg ${
                      selectedRole === role.id ? `text-${role.color}-700` : 'text-slate-700'
                    }`}>
                      {role.title}
                    </h3>
                    {selectedRole === role.id && (
                      <div className={`w-6 h-6 rounded-full bg-${role.color}-500 flex items-center justify-center text-white animate-in zoom-in duration-300`}>
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs font-bold leading-relaxed">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm"
          >
            تأكيد الدور الجديد
          </button>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-white text-slate-500 font-bold rounded-2xl border border-slate-200 hover:bg-slate-100 hover:text-slate-700 transition-all text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

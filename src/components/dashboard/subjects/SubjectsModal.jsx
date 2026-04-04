"use client";
import React from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import AddSubjectForm from './AddSubjectForm';

export default function SubjectsModal({ isOpen, onClose, onSave, initialData, classes, teachers, loading, error }) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]" 
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative overflow-hidden flex-shrink-0">
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center ring-1 ring-white/30 shadow-lg">
                  <BookOpen className="w-7 h-7" />
               </div>
               <div>
                  <h2 className="text-xl font-black mb-1">
                    {initialData ? 'تعديل بيانات المادة' : 'إضافة مادة دراسية'}
                  </h2>
                  <p className="text-blue-100/80 text-[10px] font-bold uppercase tracking-widest">إدارة المناهج والخطط الدراسية</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all relative z-20 border border-white/20"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl"></div>
        </div>

        {/* Reusable Form Component */}
        <div className="flex-1 overflow-hidden">
          <AddSubjectForm 
            onSubmit={onSave}
            onCancel={onClose}
            initialData={initialData}
            loading={loading}
            error={error}
            classes={classes}
            teachers={teachers}
          />
        </div>
      </div>
    </div>
  );
}

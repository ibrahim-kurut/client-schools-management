"use client";
import React from 'react';
import { Settings, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          الإعدادات العامة
        </h1>
        <p className="text-slate-500 font-bold">تخصيص إعدادات المدرسة والنظام</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-800">بيانات المدرسة</h2>
          </div>
          <p className="text-slate-400 font-bold text-sm">قريباً: تعديل اسم المدرسة، الشعار، ومعلومات الاتصال.</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-800">الإشعارات</h2>
          </div>
          <p className="text-slate-400 font-bold text-sm">قريباً: التحكم في التنبيهات البريدية وإشعارات النظام.</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-800">الأمان</h2>
          </div>
          <p className="text-slate-400 font-bold text-sm">قريباً: تغيير كلمة المرور وإعدادات التحقق بخطوتين.</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Palette className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-800">المظهر</h2>
          </div>
          <p className="text-slate-400 font-bold text-sm">قريباً: تفعيل الوضع الليلي وتغيير ألوان النظام.</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Globe,
  Palette,
  Server,
  Mail,
  Lock
} from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";

const settingsSections = [
  {
    title: "الإعدادات العامة",
    description: "إعدادات المنصة الأساسية والتكوينات العامة",
    icon: Settings,
    color: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-500/20",
    items: ["اسم المنصة", "الوصف", "الشعار", "اللغة الافتراضية"]
  },
  {
    title: "الأمان والحماية",
    description: "إعدادات الأمان وسياسات كلمات المرور",
    icon: Shield,
    color: "from-emerald-600 to-teal-600",
    shadow: "shadow-emerald-500/20",
    items: ["سياسة كلمات المرور", "المصادقة الثنائية", "جلسات المستخدمين", "حد المحاولات"]
  },
  {
    title: "قاعدة البيانات",
    description: "إعدادات الاتصال بقاعدة البيانات والنسخ الاحتياطي",
    icon: Database,
    color: "from-purple-600 to-violet-600",
    shadow: "shadow-purple-500/20",
    items: ["حالة الاتصال", "النسخ الاحتياطي التلقائي", "سجل العمليات"]
  },
  {
    title: "الإشعارات",
    description: "إعدادات الإشعارات والتنبيهات",
    icon: Bell,
    color: "from-amber-600 to-orange-600",
    shadow: "shadow-amber-500/20",
    items: ["إشعارات البريد", "إشعارات النظام", "تنبيهات الاشتراكات"]
  },
  {
    title: "البريد الإلكتروني",
    description: "تكوين خادم البريد الإلكتروني",
    icon: Mail,
    color: "from-rose-600 to-pink-600",
    shadow: "shadow-rose-500/20",
    items: ["خادم SMTP", "قوالب البريد", "سجل الرسائل المرسلة"]
  },
  {
    title: "الخادم والأداء",
    description: "معلومات الخادم وإعدادات الأداء",
    icon: Server,
    color: "from-cyan-600 to-sky-600",
    shadow: "shadow-cyan-500/20",
    items: ["حالة الخادم", "استخدام الموارد", "ذاكرة التخزين المؤقت"]
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <DashboardPageHeader 
        title="الإعدادات العامة"
        description="إدارة وتكوين إعدادات المنصة والنظام."
      />

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div 
              key={index}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm group hover:shadow-xl hover:border-indigo-500/20 transition-all duration-500 cursor-pointer active:scale-[0.98]"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} ${section.shadow} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                    {section.title}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-all duration-200"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-indigo-500 transition-colors" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline hover:underline-offset-4 decoration-indigo-500 transition-all">
                  إدارة الإعدادات ←
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">معلومات النظام</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">إصدار النظام</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">v1.0.4</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">بيئة التشغيل</p>
            <p className="text-lg font-black text-emerald-500">Development</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">آخر تحديث</p>
            <p className="text-lg font-black text-slate-900 dark:text-white" suppressHydrationWarning>
              {new Date().toLocaleDateString('ar-EG')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

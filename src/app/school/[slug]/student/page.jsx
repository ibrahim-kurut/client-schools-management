"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassNotes } from "@/redux/slices/notesSlice";
import { fetchProfile } from "@/redux/slices/profileSlice";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import axiosInstance from "@/lib/axios";

import {
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  Award,
  Wallet,
  Megaphone,
  ChevronLeft,
  GraduationCap,
  Loader2
} from "lucide-react";

export default function StudentDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profileData, loading: profileLoading } = useSelector((state) => state.profile);
  const { notes, loading: notesLoading } = useSelector((state) => state.notes);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Use classId from profileData
  const classId = profileData?.classId;

  // Schedule state
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    if (classId) {
      dispatch(fetchClassNotes(classId));
    }
  }, [dispatch, classId]);

  useEffect(() => {
    const fetchStudentSchedule = async () => {
      if (!classId) return;
      try {
        setLoadingSchedule(true);
        const res = await axiosInstance.get(`/schedules/class/${classId}`);
        setSchedules(res.data.data || []);
      } catch (error) {
        console.error("فشل في تحميل الجدول الدراسي", error);
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchStudentSchedule();
  }, [classId]);

  // Financial summary from profile
  const financial = profileData?.financialSummary || {
    totalPaid: 0,
    remainingBalance: 0,
    netRequired: 0
  };

  // Mock Data for other sections
  const stats = [
    {
      label: "النسبة العامة",
      value: "في التطوير",
      trend: "",
      isPositive: true,
      icon: Award,
      color: "emerald"
    },
    {
      label: "نسبة الحضور",
      value: "في التطوير",
      trend: "",
      isPositive: true,
      icon: Clock,
      color: "blue"
    },
    {
      label: "الرسوم المتبقية",
      value: financial.remainingBalance.toLocaleString(),
      currency: "د.ع",
      status: financial.remainingBalance <= 0 ? "تم التسديد بالكامل" : "يوجد مبالغ مستحقة",
      icon: Wallet,
      color: "indigo"
    }
  ];

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const todaySchedules = schedules
    .filter(s => s.day === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const todayScheduleList = todaySchedules.map((s) => ({
    time: s.startTime,
    subject: s.subject?.name || "بدون مادة",
    teacher: s.teacher ? `أ. ${s.teacher.firstName} ${s.teacher.lastName}` : "غير محدد",
    type: "class",
    status: "قادم"
  }));

  return (
    <div className="space-y-6 pb-12 w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Prompt */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black mb-2 flex items-center gap-2">
              <GraduationCap className="w-8 h-8 opacity-80" />
              مرحباً بك مجدداً في لوحتك التعليمية!
            </h1>
            <p className="text-emerald-50 text-sm lg:text-base font-semibold">
              هنا تجد ملخصاً لكل معلوماتك الأكاديمية والمالية. انطلق بثقة نحو التفوق.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-4 shrink-0 flex items-center gap-4">
            <div className="text-right">
              <div className="text-emerald-50 text-xs font-bold mb-1">التقييم المستمر</div>
              <div className="text-sm font-black tracking-tight mt-1">في مرحلة التطوير</div>
            </div>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-inner">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorStyles = {
            emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
            blue: "bg-blue-50 text-blue-600 border-blue-100",
            indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
          }[stat.color];

          return (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl border ${colorStyles} transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.trend && (
                  <span className={`text-xs font-black px-2 py-1 rounded-lg flex items-center gap-1 ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="text-slate-500 text-sm font-bold mb-1">{stat.label}</div>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</span>
                {stat.currency && <span className="text-sm font-bold text-slate-500 mb-1">{stat.currency}</span>}
              </div>
              {stat.status && (
                <div className="mt-3 text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {stat.status}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Schedule */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                جدول اليوم
              </h2>
              <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                الجدول الكامل <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {loadingSchedule ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-xs font-bold text-slate-400">جاري تحميل الجدول...</p>
                </div>
              ) : todayScheduleList.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">لا يوجد لديك حصص مجدولة لهذا اليوم</p>
                </div>
              ) : (
                todayScheduleList.map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border bg-slate-50 border-slate-100`}>
                    <div className={`shrink-0 w-20 text-center text-sm font-black text-slate-500`}>
                      {item.time}
                    </div>
                    
                    <div className={`w-1 h-12 rounded-full bg-slate-300`} />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-black truncate text-slate-800`}>
                        {item.subject}
                      </h3>
                      <p className={`text-xs font-semibold truncate text-slate-500`}>
                        {item.teacher}
                      </p>
                    </div>

                    <div className="hidden sm:block shrink-0">
                      <span className={`text-[11px] font-black px-3 py-1 rounded-full bg-slate-100 text-slate-400`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right/Side Column */}
        <div className="flex flex-col gap-6">
          {/* Announcements */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" />
                إعلانات المدرسة
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {notesLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-xs font-bold text-slate-400">جاري تحميل الإعلانات...</p>
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Megaphone className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">لا توجد إعلانات حالياً</p>
                </div>
              ) : (
                notes.slice(0, 5).map((note, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-slate-200 transition-colors cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500/30" />
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <h3 className="font-bold text-sm text-slate-800">
                        {note.teacher ? `أ. ${note.teacher.firstName} ${note.teacher.lastName}` : "ملاحظة من المعلم"}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 mr-auto">
                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true, locale: ar })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
            
            <button className="w-full mt-4 p-3 rounded-xl border border-slate-200 border-dashed text-slate-500 text-sm font-bold hover:bg-slate-50 hover:text-slate-700 transition-colors">
              عرض المزيد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

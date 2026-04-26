"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { CalendarDays, Loader2 } from "lucide-react";
import ScheduleGrid from "@/components/dashboard/schedules/ScheduleGrid";
import { toast } from "react-toastify";
import { fetchProfile } from "@/redux/slices/profileSlice";

export default function StudentSchedulePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profileData } = useSelector((state) => state.profile);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    const fetchStudentSchedule = async () => {
      // Use classId from profileData for reliability
      const classId = profileData?.classId || user?.classId;
      
      if (!classId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`/schedules/class/${classId}`);
        setSchedules(res.data.data || []);
      } catch (error) {
        toast.error("فشل في تحميل الجدول الدراسي.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentSchedule();
  }, [profileData?.classId, user?.classId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="font-black text-slate-500">جاري تحميل جدولك الدراسي...</p>
    </div>
  );

  if (!profileData?.classId && !user?.classId) return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-white rounded-3xl border border-dashed border-slate-200">
        <CalendarDays className="w-16 h-16 text-slate-200" />
        <h2 className="text-xl font-black text-slate-800">لم يتم تعيين صف لك بعد</h2>
        <p className="text-slate-500 font-bold max-w-md">الرجاء التواصل مع إدارة المدرسة لتعيينك في صف دراسي حتى تتمكن من رؤية جدولك.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <CalendarDays className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">جدولي الدراسي</h1>
            <p className="text-slate-400 font-bold mt-1">عرض جميع حصصك الأسبوعية المنظمة زمنياً</p>
          </div>
        </div>
      </div>

      {/* Grid Schedule List - Reusable Component */}
      <ScheduleGrid 
        schedules={schedules} 
        isEditable={false} 
      />
    </div>
  );
}

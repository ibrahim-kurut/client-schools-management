"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { 
  CalendarDays, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Clock, 
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DAYS_AR = {
  SUNDAY: 'الأحد',
  MONDAY: 'الإثنين',
  TUESDAY: 'الثلاثاء',
  WEDNESDAY: 'الأربعاء',
  THURSDAY: 'الخميس'
};

const DAY_ORDER = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];

export default function AddBulkSchedulePage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDay, setSelectedDay] = useState('SUNDAY');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Array of lessons to be added
  const [lessons, setLessons] = useState([
    { id: Date.now(), subjectId: '', startTime: '08:00', endTime: '08:45' },
    { id: Date.now() + 1, subjectId: '', startTime: '08:50', endTime: '09:35' },
    { id: Date.now() + 2, subjectId: '', startTime: '09:40', endTime: '10:25' }
  ]);

  // Fetch classes and subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classesRes, subjectsRes] = await Promise.all([
          axios.get(`/classes?schoolSlug=${slug}`),
          axios.get(`/subjects?schoolSlug=${slug}`)
        ]);
        
        const classesList = classesRes.data.classes || [];
        setClasses(classesList);
        setSubjects(subjectsRes.data.subjects || []);
        
        if (classesList.length > 0) {
          setSelectedClassId(classesList[0].id);
        }
      } catch (error) {
        toast.error("فشل في تحميل البيانات الأساسية.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Fetch existing schedules when Class or Day changes
  useEffect(() => {
    if (!selectedClassId || !selectedDay) return;

    const fetchExisting = async () => {
      try {
        const res = await axios.get(`/schedules/class/${selectedClassId}`);
        const existingForDay = (res.data.data || [])
          .filter(s => s.day === selectedDay)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        if (existingForDay.length > 0) {
          setLessons(existingForDay.map(s => ({
            id: s.id,
            subjectId: s.subjectId,
            startTime: s.startTime,
            endTime: s.endTime
          })));
        } else {
          // Reset to default empty rows if no data found
          setLessons([
            { id: Date.now(), subjectId: '', startTime: '08:00', endTime: '08:45' },
            { id: Date.now() + 1, subjectId: '', startTime: '08:50', endTime: '09:35' },
            { id: Date.now() + 2, subjectId: '', startTime: '09:40', endTime: '10:25' }
          ]);
        }
      } catch (error) {
        console.error("Error fetching day schedule", error);
      }
    };

    fetchExisting();
  }, [selectedClassId, selectedDay]);

  const addRow = () => {
    const lastLesson = lessons[lessons.length - 1];
    let nextStart = '11:00';
    let nextEnd = '11:45';
    
    if (lastLesson && lastLesson.endTime) {
      // Simple offset for UX
      const [h, m] = lastLesson.endTime.split(':').map(Number);
      const startMin = m + 5;
      const hour = h + Math.floor(startMin / 60);
      const min = startMin % 60;
      nextStart = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      const endMin = min + 45;
      const endHour = hour + Math.floor(endMin / 60);
      const eMin = endMin % 60;
      nextEnd = `${endHour.toString().padStart(2, '0')}:${eMin.toString().padStart(2, '0')}`;
    }

    setLessons([...lessons, { id: Date.now(), subjectId: '', startTime: nextStart, endTime: nextEnd }]);
  };

  const removeRow = (id) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  const updateLesson = (id, field, value) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleSaveAll = async () => {
    // Validation
    const validLessons = lessons.filter(l => l.subjectId && l.startTime && l.endTime);
    if (validLessons.length === 0) {
      toast.warning("يرجى ملء بيانات حصة واحدة على الأقل.");
      return;
    }

    setSaving(true);
    try {
      const payload = validLessons.map(l => {
        const subject = subjects.find(s => s.id === l.subjectId);
        return {
          subjectId: l.subjectId,
          teacherId: subject?.teacherId || '',
          startTime: l.startTime,
          endTime: l.endTime
        };
      });

      await axios.post('/schedules/sync', { 
        classId: selectedClassId,
        day: selectedDay,
        items: payload 
      });
      toast.success("تم تحديث جدول اليوم بنجاح!");
      router.push(`/school/${slug}/schedules`);
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل حفظ الجدول الجماعي.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="font-black text-slate-500">جاري تهيئة بيئة العمل...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Navigation & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-white hover:bg-slate-100 rounded-2xl shadow-sm transition-all text-slate-400 hover:text-blue-600"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800">إضافة جدول حصص جماعي</h1>
            <p className="text-slate-500 font-bold mt-1">قم بتنظيم حصص اليوم بالكامل في شاشة واحدة</p>
          </div>
        </div>

        <button 
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>حفظ الجدول بالكامل</span>
        </button>
      </div>

      {/* Selection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div className="space-y-3">
          <label className="text-sm font-black text-slate-500 mr-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> الصف الدراسي المستهدف
          </label>
          <select 
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-700 focus:border-blue-500 focus:bg-white outline-none transition-all"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-black text-slate-500 mr-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> اختيار اليوم
          </label>
          <select 
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-700 focus:border-blue-500 focus:bg-white outline-none transition-all"
          >
            {DAY_ORDER.map(d => <option key={d} value={d}>{DAYS_AR[d]}</option>)}
          </select>
        </div>
      </div>

      {/* Bulk Lessons Form */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <Plus className="w-6 h-6 text-blue-600" /> قائمة الحصص الدراسية
          </h2>
          <div className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
            {lessons.length} حصص مخططة
          </div>
        </div>

        <div className="p-8 space-y-6">
          {lessons.map((lesson, index) => {
             const classSubjects = subjects.filter(s => s.classId === selectedClassId);
             
             return (
              <div 
                key={lesson.id} 
                className="group flex flex-col md:flex-row items-end gap-6 p-6 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 rounded-[32px] border-2 border-transparent hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex-1 space-y-3 w-full">
                  <label className="text-xs font-black text-slate-400 mr-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-[10px]">
                      {index + 1}
                    </span>
                    المادة الدراسية والمعلم
                  </label>
                  <select 
                    value={lesson.subjectId}
                    onChange={(e) => updateLesson(lesson.id, 'subjectId', e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">اختر مادة الدراسية...</option>
                    {classSubjects.map(s => (
                      <option key={s.id} value={s.id}>
                          {s.name} — {s.teacher?.firstName ? `${s.teacher.firstName} ${s.teacher.lastName}` : 'بدون معلم'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1 w-full">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 mr-2 flex items-center gap-2">بداية الحصة</label>
                    <input 
                      type="time"
                      value={lesson.startTime}
                      onChange={(e) => updateLesson(lesson.id, 'startTime', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 mr-2 flex items-center gap-2">نهاية الحصة</label>
                    <input 
                      type="time"
                      value={lesson.endTime}
                      onChange={(e) => updateLesson(lesson.id, 'endTime', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => removeRow(lesson.id)}
                  className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  title="حذف الصف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}

          <button 
            onClick={addRow}
            className="w-full py-6 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-[32px] font-black transition-all flex items-center justify-center gap-3 group"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Plus className="w-5 h-5" />
            </div>
            إضافة حصة أخرى لليوم
          </button>
        </div>

        <div className="p-10 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100">
           <div className="flex items-center gap-4 text-slate-500">
              <div className="p-3 bg-white rounded-2xl border border-slate-100">
                 <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-bold max-w-xs leading-relaxed">
                يتم التحقق من تداخل المواعيد تلقائياً عند الحفظ. تأكد من أن كل حصة لا تتداخل مع وقت حصة أخرى لنفس المعلم أو الصف.
              </p>
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto">
              <button 
                onClick={() => router.back()}
                className="flex-1 md:px-12 py-4 bg-white border border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all"
              >
                إلغاء والعودة
              </button>
              <button 
                onClick={handleSaveAll}
                disabled={saving}
                className="flex-[2] md:px-16 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                حفظ كافة الحصص
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

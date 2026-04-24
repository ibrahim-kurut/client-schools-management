"use client";
import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { 
  CalendarDays, 
  Plus, 
  Trash2, 
  Clock, 
  BookOpen, 
  User as UserIcon, 
  Filter,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useParams, useRouter } from 'next/navigation';
import ScheduleGrid from './ScheduleGrid';
import EditScheduleModal from './EditScheduleModal';
import Select from '@/components/ui/Select';

const DAYS_AR = {
  SUNDAY: 'الأحد',
  MONDAY: 'الإثنين',
  TUESDAY: 'الثلاثاء',
  WEDNESDAY: 'الأربعاء',
  THURSDAY: 'الخميس',
  FRIDAY: 'الجمعة',
  SATURDAY: 'السبت'
};

const DAY_ORDER = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

// SchedulesManagement.jsx refactored
export default function SchedulesManagement() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const router = useRouter(); 
  const { slug } = useParams();

  // Fetch initial data (classes)
  useEffect(() => {
    if (!slug) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/classes?schoolSlug=${slug}`);
        const classesList = res.data.classes || [];
        setClasses(classesList);
        
        if (classesList.length > 0) {
          setSelectedClassId(classesList[0].id);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "فشل في تحميل قائمة الصفوف");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [slug]);

  // Navigate to add page
  const handleOpenAddModal = () => {
    router.push(`/school/${slug}/schedules/add`);
  };

  const handleEdit = async (lesson) => {
    setSelectedLesson(lesson);
    if (subjects.length === 0) {
      try {
        const res = await axios.get(`/subjects?schoolSlug=${slug}`);
        setSubjects(res.data.subjects || []);
      } catch (error) {
        toast.error("فشل في تحميل المواد الدراسية.");
      }
    }
    setShowEditModal(true);
  };

  const handleUpdate = (updatedLesson) => {
    setSchedules(prev => prev.map(s => s.id === updatedLesson.id ? updatedLesson : s));
  };

  // Fetch schedules
  useEffect(() => {
    if (!selectedClassId) return;
    const fetchSchedules = async () => {
      try {
        const res = await axios.get(`/schedules/class/${selectedClassId}`);
        setSchedules(res.data.data || []);
      } catch (error) {
        toast.error("فشل في تحميل الجدول");
      }
    };
    fetchSchedules();
  }, [selectedClassId]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم حذف هذه الحصة.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444',
      reverseButtons: true,
      customClass: { popup: 'rounded-[32px] font-sans shadow-2xl' }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/schedules/${id}`);
        setSchedules(prev => prev.filter(s => s.id !== id));
        toast.success("تم الحذف");
      } catch (error) {
        toast.error("فشل الحذف");
      }
    }
  };

  // Component simplified, logic moved to ScheduleGrid

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-500">جاري تحميل البيانات...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section with Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">إدارة الجداول الدراسية</h1>
            <p className="text-slate-500 font-bold text-sm">إدارة الحصص الأسبوعية للأقسام والصفوف</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="w-full md:w-64">
            <Select 
              value={selectedClassId}
              onChange={setSelectedClassId}
              options={classes.map(c => ({ value: c.id, label: c.name }))}
              placeholder="اختر الصف الدراسي..."
            />
          </div>

          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة حصة جديدة</span>
          </button>
        </div>
      </div>

      {/* Grid view of the week - Reusable Component */}
      <ScheduleGrid 
        schedules={schedules} 
        isEditable={true} 
        onDelete={handleDelete} 
        onEdit={handleEdit}
      />

      <EditScheduleModal 
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdate}
        item={selectedLesson}
        subjects={subjects}
        classes={classes}
      />
    </div>
  );
}


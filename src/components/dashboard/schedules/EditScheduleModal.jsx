import React, { useState, useEffect } from 'react';
import { Clock, X, Save, Loader2 } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';
import Select from '@/components/ui/Select';

const DAYS_AR = {
  SUNDAY: 'الأحد',
  MONDAY: 'الإثنين',
  TUESDAY: 'الثلاثاء',
  WEDNESDAY: 'الأربعاء',
  THURSDAY: 'الخميس'
};

const DAY_ORDER = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];

const EditScheduleModal = ({ show, onClose, onSave, item, subjects, classes }) => {
  const [formData, setFormData] = useState({
    day: 'SUNDAY',
    startTime: '08:00',
    endTime: '08:45',
    subjectId: '',
    teacherId: '',
    classId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && item) {
      setFormData({
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
        subjectId: item.subjectId,
        teacherId: item.teacherId,
        classId: item.classId
      });
    }
  }, [show, item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.patch(`/schedules/${item.id}`, formData);
      toast.success("تم تحديث الحصة بنجاح");
      onSave(res.data.data);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل التحديث");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const classSubjects = subjects.filter(s => s.classId === formData.classId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="bg-blue-600 px-8 py-10 text-white relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
           <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-white">تعديل الحصة</h2>
                <p className="text-blue-100 font-bold opacity-80 mt-1">تحديث بيانات الجدول الدراسي</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
           </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-5">
            
            <Select 
              label="الصف الدراسي"
              value={formData.classId}
              onChange={(val) => setFormData({...formData, classId: val, subjectId: '', teacherId: ''})}
              options={classes.map(c => ({ value: c.id, label: c.name }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="اليوم"
                value={formData.day}
                onChange={(val) => setFormData({...formData, day: val})}
                options={DAY_ORDER.map(d => ({ value: d, label: DAYS_AR[d] }))}
              />
              
              <Select 
                label="المادة والمعلم"
                value={formData.subjectId}
                onChange={(val) => {
                  const sub = subjects.find(s => s.id === val);
                  setFormData({...formData, subjectId: val, teacherId: sub?.teacherId || ''});
                }}
                placeholder="اختر مادة..."
                options={classSubjects.map(s => ({
                  value: s.id,
                  label: `${s.name} — ${s.teacher?.firstName ? `${s.teacher.firstName} ${s.teacher.lastName}` : 'بدون معلم'}`
                }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 mr-2 uppercase">بداية الحصة</label>
                <div className="relative">
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                      type="time" 
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full pr-12 pl-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 mr-2 uppercase">نهاية الحصة</label>
                <div className="relative">
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                      type="time" 
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      className="w-full pr-12 pl-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>حفظ التعديلات</span>
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 py-4 rounded-2xl font-black transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScheduleModal;

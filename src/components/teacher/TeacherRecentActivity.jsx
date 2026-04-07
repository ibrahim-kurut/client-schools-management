"use client";
import { Clock, Activity, FileText, CheckCircle, Plus } from "lucide-react";

export default function TeacherRecentActivity({ activities = [] }) {
  // Use a fallback for icons if needed or just use the icon string from backend
  const getActivityIcon = (type) => {
    switch(type) {
      case 'GRADE_ADDED': return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'ATTENDANCE_MARKED': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Plus className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatActivityTime = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return "الآن";
      if (diffInMinutes < 60) return `${diffInMinutes} دقيقة`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعة`;
      return date.toLocaleDateString('ar-EG');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">أحدث الإجراءات</h3>
            <p className="text-xs font-bold text-slate-400">سجل النشاطات الأخيرة</p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {activities.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-sm font-bold text-slate-400">لا توجد نشاطات مؤخراً</p>
            </div>
        ) : (
            activities.map((activity, i) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 group relative"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center flex-shrink-0 border border-slate-100 transition-colors">
                  {getActivityIcon(activity.type)}
                </div>
    
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span className="text-xs font-semibold text-slate-400">{formatActivityTime(activity.time)}</span>
                  </div>
                </div>
    
                {/* Connector line (simplified for dynamic content) */}
                {i < activities.length - 1 && (
                  <div className="absolute right-8 mt-10 w-px h-4 bg-slate-100 hidden sm:block" />
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}

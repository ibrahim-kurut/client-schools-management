import React from 'react';
import { Clock, Trash2, User, Pencil } from 'lucide-react';

const LESSON_NAMES_AR = [
  'الحصة الأولى',
  'الحصة الثانية',
  'الحصة الثالثة',
  'الحصة الرابعة',
  'الحصة الخامسة',
  'الحصة السادسة',
  'الحصة السابعة',
  'الحصة الثامنة',
  'الحصة التاسعة',
  'الحصة العاشرة'
];

const COLORS = [
  { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", icon: "text-emerald-500", label: "bg-emerald-600/10" },
  { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700", icon: "text-blue-500", label: "bg-blue-600/10" },
  { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-700", icon: "text-indigo-500", label: "bg-indigo-600/10" },
  { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", icon: "text-amber-500", label: "bg-amber-600/10" },
  { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-700", icon: "text-rose-500", label: "bg-rose-600/10" },
  { bg: "bg-teal-50", border: "border-teal-100", text: "text-teal-700", icon: "text-teal-500", label: "bg-teal-600/10" },
  { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-700", icon: "text-purple-500", label: "bg-purple-600/10" },
  { bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-700", icon: "text-orange-500", label: "bg-orange-600/10" },
  { bg: "bg-cyan-50", border: "border-cyan-100", text: "text-cyan-700", icon: "text-cyan-500", label: "bg-cyan-600/10" },
  { bg: "bg-pink-50", border: "border-pink-100", text: "text-pink-700", icon: "text-pink-500", label: "bg-pink-600/10" },
];

const ScheduleCard = ({ item, index, isEditable, onDelete, onEdit }) => {
  // Use subject name or id to consistently pick a color
  const colorIndex = item.subject?.name ? (item.subject.name.length % COLORS.length) : (index % COLORS.length);
  const color = COLORS[colorIndex];

  return (
    <div className={`group relative ${color.bg} border-2 ${color.border} p-5 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
      {isEditable && (
        <div className="absolute top-4 left-4 flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-all z-10">
          <button 
            onClick={() => onEdit(item)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white transition-all rounded-xl bg-white/80 backdrop-blur-sm shadow-sm"
            title="تعديل الحصة"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-white transition-all rounded-xl bg-white/80 backdrop-blur-sm shadow-sm"
            title="حذف الحصة"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit ${color.label} ${color.text}`}>
            {LESSON_NAMES_AR[index] || `الحصة ${index + 1}`}
          </span>
          <div className={`font-black ${color.text} text-lg leading-tight`}>
            {item.subject?.name}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t border-black/5">
          <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
            <User className={`w-3.5 h-3.5 ${color.icon}`} />
            <span className="truncate">أ. {item.teacher?.firstName} {item.teacher?.lastName}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-black text-[11px]">
            <Clock className={`w-3.5 h-3.5 ${color.icon}`} />
            <span>{item.startTime} - {item.endTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ScheduleCard);

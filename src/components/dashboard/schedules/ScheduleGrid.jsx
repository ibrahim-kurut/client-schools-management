import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import ScheduleCard from './ScheduleCard';

const DAYS_AR = {
  SUNDAY: 'الأحد',
  MONDAY: 'الإثنين',
  TUESDAY: 'الثلاثاء',
  WEDNESDAY: 'الأربعاء',
  THURSDAY: 'الخميس'
};

const WORK_DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];

const ScheduleGrid = ({ schedules, isEditable, onDelete, onEdit }) => {
  // Get current day Name (English uppercase)
  const currentDayName = useMemo(() => {
    const d = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    return d;
  }, []);

  // Group & Sort
  const groupedSchedules = useMemo(() => {
    return WORK_DAYS.reduce((acc, day) => {
      acc[day] = schedules
        .filter(s => s.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      return acc;
    }, {});
  }, [schedules]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {WORK_DAYS.map(day => {
        const isToday = day === currentDayName;
        const daySchedules = groupedSchedules[day] || [];

        return (
          <div key={day} className={`flex flex-col gap-5 p-5 rounded-[40px] bg-white border transition-all shadow-sm ${isToday ? 'border-blue-300 shadow-lg shadow-blue-500/5' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                <h3 className={`font-black text-lg ${isToday ? 'text-blue-600' : 'text-slate-800'}`}>{DAYS_AR[day]}</h3>
                {isToday && <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full w-fit mt-1">اليوم</span>}
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full ${isToday ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                {daySchedules.length} حصص
              </span>
            </div>
            
            <div className="space-y-4 min-h-[400px]">
              {daySchedules.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[32px] opacity-40">
                   <Clock className="w-8 h-8 text-slate-300 mb-3" />
                   <p className="text-xs text-slate-400 font-black uppercase tracking-widest text-center px-4">لا توجد حصص مجدولة</p>
                </div>
              ) : (
                daySchedules.map((item, index) => (
                  <ScheduleCard 
                    key={item.id} 
                    item={item} 
                    index={index} 
                    isEditable={isEditable}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(ScheduleGrid);

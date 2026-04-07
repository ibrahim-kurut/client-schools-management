"use client";
import { Clock, Activity } from "lucide-react";
import { recentActivities } from "@/data/teacherMockData";

export default function TeacherRecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200/50">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">آخر النشاطات</h3>
            <p className="text-xs font-bold text-slate-400">أحدث الإجراءات</p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {recentActivities.map((activity, i) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center text-lg flex-shrink-0 border border-slate-100 transition-colors">
              {activity.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 leading-relaxed">
                {activity.message}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Clock className="w-3 h-3 text-slate-300" />
                <span className="text-xs font-semibold text-slate-400">{activity.time}</span>
              </div>
            </div>

            {/* Connector line */}
            {i < recentActivities.length - 1 && (
              <div className="absolute right-8 mt-10 w-px h-4 bg-slate-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

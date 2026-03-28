import { Activity, Wallet, UserPlus } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    { title: "تم تسجيل قسط لطالب (محمد عادل) بقيمة 200$", time: "منذ ساعتين", user: "المحاسب", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "تم تسجيل طالب جديد للعام الدراسي الحالي بنجاح", time: "منذ 4 ساعات", user: "شؤون الطلاب", icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "تحديث درجات الفصل الدراسي الأول للصف العاشر", time: "منذ يوم", user: "الأستاذ أحمد", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Activity className="w-5 h-5" />
          </div>
          سجل النشاطات
        </h2>
        <button className="text-slate-400 hover:text-slate-600 text-sm font-bold transition-all">ارشفة الكل</button>
      </div>

      <div className="space-y-6">
        {activities.map((item, i) => (
          <div key={i} className="flex gap-5 items-start group">
            <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 border-b border-slate-50 last:border-0 pb-6 last:pb-0">
              <p className="text-slate-800 font-bold leading-relaxed mb-1 group-hover:text-blue-600 transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-xs font-bold">{item.time}</span>
                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                <span className="text-slate-400 text-xs font-bold">بواسطة {item.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

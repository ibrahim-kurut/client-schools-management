"use client";
export default function SubscriptionStats() {
  const percentage = 62;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-[#1e293b] rounded-[32px] p-8 shadow-xl text-white border border-slate-700 relative overflow-hidden group">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-xl font-black mb-1">حمولة الطلاب</h2>
        <p className="text-slate-500 text-xs font-bold mb-8 uppercase tracking-widest text-blue-400">الباقة الاحترافية</p>
        
        {/* Circular Progress */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-800"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-1000"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black">{percentage}%</span>
            <span className="text-[10px] text-slate-500 font-bold">مستغل</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <div className="flex justify-between text-sm px-2">
            <span className="text-slate-400 font-bold text-xs">الإجمالي المتبقي</span>
            <span className="font-bold text-blue-400">750 طالب</span>
          </div>
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-900/20 active:scale-95">
            ترقية الحساب الآن
          </button>
        </div>
      </div>
    </div>
  );
}

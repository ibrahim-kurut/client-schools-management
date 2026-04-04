import React from 'react';

export default function FinancialChart() {
  const data = [
    { month: "يناير", income: 4000, expense: 2400 },
    { month: "فبراير", income: 3000, expense: 1398 },
    { month: "مارس", income: 9800, expense: 2000 },
    { month: "أبريل", income: 3908, expense: 2780 },
    { month: "مايو", income: 4800, expense: 1890 },
    { month: "يونيو", income: 3800, expense: 2390 },
  ];

  const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expense)));

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-black text-slate-800">مقارنة الإيرادات والمصاريف</h3>
          <p className="text-slate-400 text-sm font-medium mt-1">آخر 6 أشهر</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-xs font-bold text-slate-500">الإيرادات</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span className="text-xs font-bold text-slate-500">المصاريف</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 flex items-end justify-between gap-2 px-4 relative">
        {/* Horizontal Grid Lines */}
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="absolute left-0 right-0 border-t border-slate-100" 
            style={{ bottom: `${(i / 3) * 100}%`, width: '100%' }}
          ></div>
        ))}
        
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-3 group relative z-10">
            <div className="flex items-end gap-1.5 w-full justify-center h-48">
              {/* Income Bar */}
              <div 
                className="w-4 bg-blue-600 rounded-t-lg transition-all duration-500 relative group-hover:bg-blue-700" 
                style={{ height: `${(item.income / maxVal) * 100}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
                  {item.income} $
                </div>
              </div>
              {/* Expense Bar */}
              <div 
                className="w-4 bg-rose-500 rounded-t-lg transition-all duration-500 relative group-hover:bg-rose-600" 
                style={{ height: `${(item.expense / maxVal) * 100}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
                  {item.expense} $
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-800 transition-colors uppercase tracking-wider">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { CheckCircle2, ChevronLeft } from 'lucide-react';

export default function HighlightSection() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      <div className="absolute -bottom-40 right-10 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">جاهز للانتقال بمدرستك إلى المستقبل؟</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              انضم إلى عشرات المدارس التي تثق في EduFlow لإدارة عملياتها اليومية بسلاسة واحترافية. لا مزيد من الأعمال الورقية، ولا مزيد من الأخطاء المالية.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-slate-200 text-lg">
                <CheckCircle2 className="text-blue-400 w-6 h-6" /> دعم فني على مدار الساعة
              </li>
              <li className="flex items-center gap-3 text-slate-200 text-lg">
                <CheckCircle2 className="text-blue-400 w-6 h-6" /> تحديثات دورية مجانية للمنصة
              </li>
              <li className="flex items-center gap-3 text-slate-200 text-lg">
                <CheckCircle2 className="text-blue-400 w-6 h-6" /> نسخ احتياطي آلي للبيانات
              </li>
            </ul>
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-full font-bold text-lg shadow-xl shadow-white/10 transition-transform hover:-translate-y-1">
              اشترك الآن <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
          <div className="lg:w-1/2 relative w-full aspect-video rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center group hidden lg:flex">
            {/* Simulated Dashboard UI Mockup */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col">
              {/* Dashboard Header */}
              <div className="h-10 bg-slate-700/50 rounded-xl mb-6 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-4 w-32 bg-slate-600 rounded"></div>
              </div>
              {/* Dashboard Cards */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="h-24 bg-blue-500/20 rounded-xl border border-blue-500/30 p-4">
                  <div className="h-3 w-16 bg-blue-400/50 rounded mb-2"></div>
                  <div className="h-6 w-24 bg-blue-400 rounded"></div>
                </div>
                <div className="h-24 bg-indigo-500/20 rounded-xl border border-indigo-500/30 p-4 relative overflow-hidden group-hover:bg-indigo-500/30 transition-all">
                  <div className="h-3 w-16 bg-indigo-400/50 rounded mb-2"></div>
                  <div className="h-6 w-24 bg-indigo-400 rounded"></div>
                </div>
                <div className="h-24 bg-purple-500/20 rounded-xl border border-purple-500/30 p-4">
                  <div className="h-3 w-16 bg-purple-400/50 rounded mb-2"></div>
                  <div className="h-6 w-24 bg-purple-400 rounded"></div>
                </div>
              </div>
              {/* Dashboard Main Area */}
              <div className="flex-1 flex gap-4">
                <div className="w-2/3 bg-slate-700/30 rounded-xl border border-slate-600/50 p-4">
                  <div className="h-4 w-40 bg-slate-600 rounded mb-6"></div>
                  <div className="flex items-end gap-2 h-20 mt-auto">
                    <div className="w-1/6 bg-blue-400/60 rounded-t h-1/2"></div>
                    <div className="w-1/6 bg-blue-400/60 rounded-t h-full"></div>
                    <div className="w-1/6 bg-blue-400/60 rounded-t h-3/4"></div>
                    <div className="w-1/6 bg-blue-400/60 rounded-t h-1/4"></div>
                    <div className="w-1/6 bg-blue-400/60 rounded-t h-5/6"></div>
                    <div className="w-1/6 bg-blue-400/60 rounded-t h-2/3"></div>
                  </div>
                </div>
                <div className="w-1/3 bg-slate-700/30 rounded-xl border border-slate-600/50 p-4">
                  <div className="h-4 w-20 bg-slate-600 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-8 bg-slate-600/50 rounded"></div>
                    <div className="h-8 bg-slate-600/50 rounded"></div>
                    <div className="h-8 bg-slate-600/50 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

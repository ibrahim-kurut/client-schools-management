import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50 to-white pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-800 mb-8 font-medium backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            النظام السحابي الأول لإدارة المدارس
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-indigo-600">نقطة</span> لادارة المدارس
          </h1>

          <p className="text-xl md:text-3xl text-blue-600 font-bold mb-6 tracking-wide">
            نقطة بداية التمييز
          </p>

          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-10 max-w-3xl mx-auto font-light">
            نظام متكامل مصمم خصيصاً لأتمتة العمليات الأكاديمية والمالية بدقة وموثوقية، ليمنحك التحكم الكامل بنقرة واحدة.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-blue-600 text-slate-700 hover:text-blue-600 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-slate-100 hover:bg-slate-50">
              اطلب عرضاً توضيحياً
            </Link>
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
              ابدأ تجربتك المجانية
              <ChevronLeft className="w-5 h-5" />
            </Link>

          </div>

          {/* Trust badges */}
          <div className="mt-16 pt-10 border-t border-slate-200/60">
            <p className="text-sm text-slate-500 font-medium mb-6 uppercase tracking-wider">موثوق من قبل المدارس الرائدة</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-xl font-black text-slate-800 flex items-center gap-2"><div className="w-8 h-8 rounded bg-slate-800 rotate-45"></div> مدرسة الأجيال</div>
              <div className="text-xl font-black text-slate-800">أكاديمية المستقبل</div>
              <div className="text-xl font-black text-slate-800 flex items-center gap-1"><span className="text-3xl">⬡</span> رواد التعليم</div>
              <div className="text-xl font-black text-slate-800">مدارس القمة</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

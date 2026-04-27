'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, ChevronDown, ChevronUp, Send, HelpCircle, 
  Phone, Mail, School, Users, ArrowRight, MessageCircle 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const faqs = [
  {
    question: "كيف أقوم بالتسجيل في المنصة؟",
    answer: "عملية التسجيل بسيطة جداً. يمكنك البدء بالضغط على 'ابدأ تجربتك المجانية'، ملء بيانات المدرسة، وسيقوم النظام فوراً بإنشاء لوحة التحكم الخاصة بك وتفعيل الحساب بشكل آلي."
  },
  {
    question: "هل هناك فترة تجريبية مجانية؟",
    answer: "نعم، نوفر فترة تجريبية مجانية بالكامل لمدة 14 يوماً تشمل جميع المميزات، لكي تتمكن من استكشاف النظام والتأكد من ملاءمته لاحتياجات مدرستك قبل الاشتراك."
  },
  {
    question: "هل يمكنني استيراد بيانات الطلاب والمعلمين؟",
    answer: "بالطبع، يدعم نقطة استيراد البيانات من ملفات Excel و CSV بكل سهولة، مما يوفر عليك ساعات من العمل اليدوي في إدخال البيانات."
  },
  {
    question: "هل بيانات مدرستي آمنة؟",
    answer: "الأمان هو أولويتنا القصوى. نستخدم تقنيات تشفير متطورة ونسخ احتياطي يومي بانتظام لضمان عدم فقدان أي معلومة أبداً."
  },
  {
    question: "كيف أحصل على الدعم الفني؟",
    answer: "فريق الدعم الفني لدينا متاح على مدار الساعة عبر الواتساب، البريد الإلكتروني، أو من خلال نظام التذاكر داخل المنصة لمساعدتك في أي استفسار."
  }
];

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    phone: '',
    email: '',
    studentCount: '0-100'
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0); // Open first by default on page

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans rtl">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          
          {/* Hero text */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">احصل على عرض توضيحي مجاني</h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              اكتشف كيف يمكن لنظام نقطة أن يحول مدرستك إلى مؤسسة رقمية ذكية. املأ البيانات وسنقوم بالتواصل معك في أقرب وقت.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              
              {/* Right Side: Form (Primary Action) */}
              <div className="w-full lg:w-3/5 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {!submitted ? (
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <Send className="w-6 h-6 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">بيانات المسؤول</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">اسم المسؤول</label>
                          <div className="relative">
                            <Users className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                            <input 
                              type="text" required
                              className="w-full pr-11 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                              placeholder="أدخل اسمك الكامل"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">اسم المدرسة</label>
                          <div className="relative">
                            <School className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                            <input 
                              type="text" required
                              className="w-full pr-11 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                              placeholder="اسم المنشأة التعليمية"
                              value={formData.schoolName}
                              onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">رقم الجوال</label>
                          <div className="relative">
                            <Phone className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                            <input 
                              type="tel" required
                              className="w-full pr-11 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                              placeholder="+966"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                          <div className="relative">
                            <Mail className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                            <input 
                              type="email" required
                              className="w-full pr-11 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                              placeholder="example@mail.com"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">حجم المؤسسة (عدد الطلاب)</label>
                        <select 
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          value={formData.studentCount}
                          onChange={(e) => setFormData({...formData, studentCount: e.target.value})}
                        >
                          <option value="0-100">أقل من 100 طالب</option>
                          <option value="100-500">من 100 إلى 500 طالب</option>
                          <option value="500-1000">من 500 إلى 1000 طالب</option>
                          <option value="1000+">أكثر من 1000 طالب</option>
                        </select>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3 text-lg group"
                      >
                        إرسال طلب العرض
                        <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                      </button>

                      <p className="text-center text-sm text-slate-400">نحن نحترم خصوصيتك. لن يتم استخدام بياناتك إلا لغرض التواصل للعرض التوضيحي.</p>
                    </form>
                  </div>
                ) : (
                  <div className="p-12 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-14 h-14 text-green-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4">تم استلام طلبك!</h2>
                    <p className="text-xl text-slate-600 mb-10 max-w-md mx-auto">
                      شكراً لتواصلك معنا. سيقوم أحد مستشارينا بالاتصال بك خلال أقل من 24 ساعة لترتيب موعد العرض التوضيحي.
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                      العودة للرئيسية <ArrowRight className="w-5 h-5 rotate-180" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Left Side: FAQs / Info */}
              <div className="w-full lg:w-2/5 space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-800">أسئلة شائعة</h2>
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div 
                        key={index}
                        className={`rounded-2xl transition-all duration-300 ${openFaq === index ? 'bg-blue-50/50 border-blue-100 border' : 'bg-slate-50 border-transparent border hover:bg-slate-100'}`}
                      >
                        <button 
                          onClick={() => toggleFaq(index)}
                          className="w-full flex items-center justify-between p-4 text-right transition-all"
                        >
                          <span className={`font-bold text-sm md:text-base ${openFaq === index ? 'text-blue-700' : 'text-slate-700'}`}>
                            {faq.question}
                          </span>
                          {openFaq === index ? (
                            <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                          )}
                        </button>
                        {openFaq === index && (
                          <div className="px-4 pb-4 pt-1 text-slate-600 text-sm md:text-base leading-relaxed animate-in slide-in-from-top-2 duration-300">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Contact Card */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-blue-600/30 transition-all"></div>
                  <h3 className="text-xl font-bold mb-4 relative z-10">تواصل مباشر؟</h3>
                  <p className="text-slate-400 mb-6 relative z-10">يمكنك التحدث مع فريق المبيعات عبر الواتساب للإجابة السريعة على جميع استفساراتك.</p>
                  <a 
                    href="https://wa.me/9647709367018" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all relative z-10"
                  >
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    محادثة واتساب
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

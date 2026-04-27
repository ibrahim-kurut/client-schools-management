import Link from 'next/link';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="relative border-t border-slate-200/80 bg-gradient-to-b from-slate-50 to-white pt-16 pb-10"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-blue-200 to-transparent"
        aria-hidden
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 lg:items-start mb-14">
          <div className="lg:col-span-4 text-right">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="bg-white border-2 border-blue-600 p-1.5 rounded-xl text-white shadow-md shadow-blue-600/25 transition-transform group-hover:scale-105">
                <img src="/logo.ico" alt="نقطة" className="h-6 w-6 object-contain" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                نقطة
              </span>
            </Link>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md">
              نظام إدارة مدرسية متكامل، يجمع بين كفاءة الأداء وسهولة الاستخدام.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-right">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4">
                المنتج
              </h4>
              <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
                <li>
                  <Link
                    href="/#features"
                    className="inline-block hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
                  >
                    المميزات
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prices"
                    className="inline-block hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
                  >
                    الأسعار
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="inline-block hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
                  >
                    التحديثات
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="inline-block hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
                  >
                    الأمان
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4">
                الشركة
              </h4>
              <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
                <li>
                  <Link
                    href="/#about"
                    className="inline-block hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
                  >
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="inline-block hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
                  >
                    المدونة
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="inline-block hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
                  >
                    الوظائف
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="inline-block hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
                  >
                    اتصل بنا
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4">
                تواصل
              </h4>
              <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
                <li className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden />
                  <a
                    href="mailto:info@nokta.iq"
                    className="hover:text-blue-600 transition-colors break-all text-right"
                  >
                    info@nokta.iq
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" aria-hidden />
                  <a href="tel:+9647701234567" className="tabular-nums hover:text-blue-600 transition-colors" dir="ltr">
                    +964 770 123 4567
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden />
                  <span className="text-right">العراق، الموصل</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between pt-8 border-t border-slate-200/90 text-slate-500 text-sm">
          <p className="text-center sm:text-right">
            &copy; {new Date().getFullYear()} نقطة لادارة المدارس. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2">
            <Link
              href="#"
              className="hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="#"
              className="hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
            >
              شروط الخدمة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

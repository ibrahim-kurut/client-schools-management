import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">EduFlow</span>
            </div>
            <p className="text-slate-500 mb-6 leading-relaxed">
              نظام إدارة مدرسية متكامل، يجمع بين كفاءة الأداء وسهولة الاستخدام.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-slate-900 mb-6">المنتج</h4>
              <ul className="space-y-4 text-slate-500">
                <li><Link href="#features" className="hover:text-blue-600 transition-colors">المميزات</Link></li>
                <li><Link href="#pricing" className="hover:text-blue-600 transition-colors">الأسعار</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">التحديثات</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">الأمان</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">الشركة</h4>
              <ul className="space-y-4 text-slate-500">
                <li><Link href="#about" className="hover:text-blue-600 transition-colors">من نحن</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">المدونة</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">الوظائف</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">اتصل بنا</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">تواصل</h4>
              <ul className="space-y-4 text-slate-500">
                <li>[EMAIL_ADDRESS]</li>
                <li dir="ltr">+964 770 123 4567</li>
                <li>العراق، الموصل</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} EduFlow. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-blue-600 transition-colors">سياسة الخصوصية</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">شروط الخدمة</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

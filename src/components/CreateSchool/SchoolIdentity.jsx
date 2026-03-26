'use client';

import { School, Link2, Image as ImageIcon } from 'lucide-react';
import AuthInput from '../AuthInput';

export default function SchoolIdentity({ formData, setFormData, errors }) {
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData({ ...formData, name, slug });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AuthInput
          id="schoolName"
          label="اسم المدرسة"
          placeholder="مثال: مدرسة النجاح النموذجية"
          icon={School}
          value={formData.name}
          onChange={handleNameChange}
          error={errors.name}
          required
        />
        <AuthInput
          id="schoolSlug"
          label="رابط المدرسة المختصر"
          placeholder="school-name"
          icon={Link2}
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          error={errors.slug}
          className="text-left"
        />
      </div>

      <div className="relative group">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          شعار المدرسة
        </label>
        <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group-hover:bg-slate-100/50 group-hover:border-blue-300 transition-all cursor-pointer">
          <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
            <ImageIcon className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm text-slate-500">اضغط لرفع الشعار</span>
          <span className="text-xs text-slate-400 mt-1">PNG, JPG (حد أقصى 2MB)</span>
        </div>
      </div>
    </div>
  );
}

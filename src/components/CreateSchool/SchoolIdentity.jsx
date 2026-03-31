'use client';

import { School, Link2, Image as ImageIcon, X } from 'lucide-react';
import { useRef } from 'react';
import AuthInput from '../AuthInput';

export default function SchoolIdentity({ formData, setFormData, errors }) {
  const fileInputRef = useRef(null);

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

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };
// handleLogoChange
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً (الأقصى 5MB)');
        return;
      }

      // Store the preview for the UI
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ 
          ...formData, 
          logo: reader.result,   // Preview (Base64)
          logoFile: file         // Actual File object for upload
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (e) => {
    e.stopPropagation();
    setFormData({ ...formData, logo: '', logoFile: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleLogoChange} 
          accept="image/*" 
          className="hidden" 
        />

        <div 
          onClick={handleLogoClick}
          className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden relative ${
            formData.logo 
              ? 'border-blue-400 bg-blue-50/10' 
              : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-blue-300'
          }`}
        >
          {formData.logo ? (
            <div className="relative w-full h-full group/image">
              <img 
                src={formData.logo} 
                alt="Logo Preview" 
                className="w-full h-full object-contain p-2" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                <button 
                  onClick={removeLogo}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-slate-500 font-medium">اضغط لرفع الشعار</span>
              <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider">PNG, JPG (MAX 2MB)</span>
            </>
          )}
        </div>
        {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
      </div>
    </div>
  );
}

'use client';

import { MapPin, Phone } from 'lucide-react';
import AuthInput from '../AuthInput';

export default function SchoolContact({ formData, setFormData, errors }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-backwards delay-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AuthInput
          id="schoolAddress"
          label="عنوان المدرسة"
          placeholder="مثال: شارع الجامعة، العمارة 12"
          icon={MapPin}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          error={errors.address}
        />
        <AuthInput
          id="schoolPhone"
          label="رقم الهاتف"
          placeholder="مثال: 05XXXXXXXX"
          icon={Phone}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
          className="text-left"
          pattern="^\d{10,11}$"
          title="يجب أن يكون رقم الهاتف 10 أو 11 رقماً"
        />
      </div>
    </div>
  );
}

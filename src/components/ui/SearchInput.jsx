import React from 'react';
import { Search } from 'lucide-react';

export default function SearchInput({
  value,
  onChange,
  placeholder = "ابحث...",
  className = ""
}) {
  return (
    <div className={`relative group ${className}`}>
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
      />
    </div>
  );
}

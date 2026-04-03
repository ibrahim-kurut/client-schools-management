"use client";
import { useState, useEffect } from 'react';
import { Link2, Copy, Check, ExternalLink } from 'lucide-react';

export default function SchoolLinkCard({ slug }) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [schoolLoginUrl, setSchoolLoginUrl] = useState('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setSchoolLoginUrl(`${window.location.origin}/school/${slug}/login`);
    }
  }, [slug]);

  const handleCopy = async () => {
    if (!schoolLoginUrl) return;
    try {
      await navigator.clipboard.writeText(schoolLoginUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = schoolLoginUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 h-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-10 bg-slate-100 rounded-2xl" />
          <div className="h-10 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
          <Link2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-800">رابط الدخول للمدرسة</h3>
          <p className="text-xs text-slate-400 mt-0.5">شاركه مع كادر المدرسة</p>
        </div>
      </div>

      {/* URL Display */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 mb-4 overflow-hidden">
        <div className="flex items-center gap-2 text-sm" dir="ltr">
          <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-slate-600 font-mono text-xs truncate select-all">
            {schoolLoginUrl}
          </span>
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
          copied
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200/50 hover:-translate-y-0.5'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            تم النسخ!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            نسخ الرابط
          </>
        )}
      </button>
    </div>
  );
}

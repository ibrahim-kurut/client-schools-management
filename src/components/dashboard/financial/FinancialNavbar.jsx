"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { LayoutDashboard, CreditCard, TrendingDown, ClipboardList } from 'lucide-react';

export default function FinancialNavbar() {
  const pathname = usePathname();
  const { slug } = useParams();

  const navItems = [
    { label: "لوحة التحكم", href: `/school/${slug}/financial/dashboard`, icon: LayoutDashboard },
    { label: "رسوم الطلاب", href: `/school/${slug}/financial/fees`, icon: CreditCard },
    { label: "المصاريف", href: `/school/${slug}/financial/expenses`, icon: TrendingDown },
    { label: "التقارير", href: `/school/${slug}/financial/reports`, icon: ClipboardList },
  ];

  return (
    <div className="grid grid-cols-2 md:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-4 rounded-[2.5rem] md:rounded-[24px] shadow-xl border border-slate-800 w-full md:w-fit mb-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex items-center justify-center gap-2 px-3 md:px-6 py-3.5 md:py-3 rounded-[1.5rem] md:rounded-2xl font-bold text-[14px] md:text-[15px] transition-all duration-300 ${
              isActive 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

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
    <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-[24px] shadow-sm border border-slate-100 w-fit mb-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
              isActive 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

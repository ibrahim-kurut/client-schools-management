"use client";
import React from 'react';
import FinancialNavbar from '@/components/dashboard/financial/FinancialNavbar';

export default function FinancialLayout({ children }) {
  return (
    <div className="space-y-8">
      <FinancialNavbar />
      {children}
    </div>
  );
}

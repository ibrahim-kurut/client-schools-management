'use client';

import { Check, Shield, Zap, Rocket } from 'lucide-react';

const plans = [
  {
    id: 'basic-plan-id', // Mocked ID
    name: 'الخطة الأساسية',
    price: '99',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: ['إدارة الطلاب', 'إدارة المعلمين', 'التقارير الأساسية'],
  },
  {
    id: 'pro-plan-id', // Mocked ID
    name: 'الخطة الاحترافية',
    price: '199',
    icon: Zap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    features: ['جميع مميزات الأساسية', 'إدارة الحسابات', 'نظام الرسائل القصيرة', 'التقارير المتقدمة'],
    recommended: true,
  },
  {
    id: 'enterprise-plan-id', // Mocked ID
    name: 'خطة المؤسسات',
    price: '399',
    icon: Rocket,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    features: ['جميع مميزات الاحترافية', 'دعم فني 24/7', 'تخصيص كامل', 'تطبيق موبايل مخصص'],
  },
];

export default function PlanSelection({ selectedPlanId, onSelectPlan }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-backwards delay-200">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-900">اختر خطة الاشتراك</h3>
        <p className="text-slate-500 mt-2">اختر الخطة الأنسب لاحتياجات مدرستك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={`relative cursor-pointer group transition-all duration-300 transform hover:-translate-y-2 ${
                isSelected
                  ? 'ring-2 ring-blue-600 scale-105 z-10'
                  : 'hover:shadow-xl border border-slate-200 hover:border-blue-200'
              } bg-white rounded-3xl p-6 h-full flex flex-col`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-white/20">
                    موصى به
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`w-12 h-12 ${plan.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${plan.color}`} />
                </div>
                <h4 className="font-bold text-lg text-slate-900">{plan.name}</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-500 text-sm">/شهرياً</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="mt-1 bg-green-50 rounded-full p-0.5 shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className={`mt-auto py-3 px-4 rounded-2xl text-center font-bold text-sm transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700'
              }`}>
                {isSelected ? 'تم الاختيار' : 'اختر الخطة'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

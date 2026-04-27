import {
  Wallet,
  Laptop,
  BarChart3,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import featuresData from '@/data/features.json';

// Icon mapping from string names to actual components
const iconMap = {
  Wallet,
  Laptop,
  BarChart3,
  Users,
  ShieldCheck,
  CheckCircle2,
};

// Color mapping for Tailwind classes
const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'hover:border-blue-200',
    shadow: 'hover:shadow-blue-900/5',
    hoverBg: 'group-hover:bg-blue-600',
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    border: 'hover:border-indigo-200',
    shadow: 'hover:shadow-indigo-900/5',
    hoverBg: 'group-hover:bg-indigo-600',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    border: 'hover:border-purple-200',
    shadow: 'hover:shadow-purple-900/5',
    hoverBg: 'group-hover:bg-purple-600',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    border: 'hover:border-green-200',
    shadow: 'hover:shadow-green-900/5',
    hoverBg: 'group-hover:bg-green-600',
  },
  rose: {
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    border: 'hover:border-rose-200',
    shadow: 'hover:shadow-rose-900/5',
    hoverBg: 'group-hover:bg-rose-600',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    border: 'hover:border-amber-200',
    shadow: 'hover:shadow-amber-900/5',
    hoverBg: 'group-hover:bg-amber-600',
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">لماذا تختار منصة نقطة؟</h2>
          <p className="text-lg text-slate-600">نقدم لك مجموعة من الأدوات القوية المصممة خصيصاً لتلبية كافة احتياجات الإدارة المدرسية الحديثة.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => {
            const IconComponent = iconMap[feature.icon];
            const colors = colorClasses[feature.color];

            return (
              <div
                key={feature.id}
                className={`bg-slate-50 flex flex-col rounded-3xl p-8 border border-slate-100 ${colors.border} hover:shadow-2xl ${colors.shadow} transition-all duration-300 group`}
              >
                <div className='flex flex-col items-end justify-end w-full'>
                  <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 ${colors.hoverBg} group-hover:text-white transition-all`}>
                    {IconComponent && <IconComponent className="w-8 h-8" />}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-right">{feature.description}</p>

                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

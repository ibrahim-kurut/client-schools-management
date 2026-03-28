import { Check } from 'lucide-react';

export default function PriceCard({ plan }) {
  const {
    name,
    price,
    currency,
    billingPeriod,
    description,
    features,
    highlight,
    ctaLabel,
  } = plan;

  return (
    <div
      className={[
        'relative h-full rounded-3xl border bg-white p-6 sm:p-7 shadow-sm transition-all',
        highlight
          ? 'border-blue-200 shadow-blue-100 ring-1 ring-blue-200'
          : 'border-slate-200 hover:shadow-md',
      ].join(' ')}
    >
      {highlight && (
        <div className="absolute -top-3 start-6 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-bold text-white shadow">
          الأكثر شيوعاً
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">{name}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <div className="text-4xl font-black tracking-tight text-slate-900">
          {price === 0 ? 'مجاني' : price}
        </div>
        {price !== 0 && (
          <div className="pb-1 text-sm font-semibold text-slate-500">
            {currency} / {billingPeriod}
          </div>
        )}
      </div>

      <button
        type="button"
        className={[
          'mt-6 w-full rounded-2xl px-5 py-3 text-sm font-bold transition-all',
          highlight
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/35 hover:-translate-y-0.5'
            : 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        ].join(' ')}
      >
        {ctaLabel || 'ابدأ الآن'}
      </button>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-sm font-bold text-slate-900">يشمل:</p>
        <ul className="mt-4 space-y-3">
          {features?.map((feature, idx) => (
            <li key={`${plan.id}-f-${idx}`} className="flex items-start gap-3">
              <span
                className={[
                  'mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full',
                  highlight ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700',
                ].join(' ')}
              >
                <Check className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


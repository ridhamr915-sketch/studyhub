import React from 'react';
import { Sparkles } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-[#DDD6FE] my-4">
      <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-[#1F2937] tracking-tight">{title}</h3>
      <p className="text-xs text-[#6B7280] max-w-sm mt-1 mb-5">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-all shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

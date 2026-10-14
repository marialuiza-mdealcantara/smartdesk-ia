import React from 'react';
import { 
  Ticket, 
  AlertTriangle, 
  FolderTree, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info
} from 'lucide-react';
import type { MetricCardData } from '../types/ticket';

interface MetricCardProps {
  data: MetricCardData;
  loading?: boolean;
}

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  Ticket,
  AlertTriangle,
  FolderTree,
  Users,
};

export const MetricCard: React.FC<MetricCardProps> = ({ data, loading }) => {
  const IconComponent = ICONS[data.iconName] || Ticket;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded w-28"></div>
          <div className="w-9 h-9 rounded-lg bg-slate-200"></div>
        </div>
        <div className="mt-4">
          <div className="h-7 bg-slate-200 rounded w-20"></div>
          <div className="h-3.5 bg-slate-100 rounded w-36 mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
            {data.title}
          </span>
          {data.tooltip && (
            <span title={data.tooltip} className="text-slate-400 hover:text-slate-600 cursor-help shrink-0">
              <Info className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {data.badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200/60">
              {data.badge}
            </span>
          )}
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors flex items-center justify-center">
            <IconComponent className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Metric Main Value */}
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] truncate" title={String(data.value)}>
          {data.value}
        </div>
        <div className="text-xs text-slate-500 mt-1 truncate" title={data.subtitle}>
          {data.subtitle}
        </div>
      </div>

      {/* Trend comparison (if available) */}
      {data.trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          {data.trend.diff > 0 ? (
            <TrendingUp className={`w-3.5 h-3.5 ${data.trend.isPositive ? 'text-emerald-600' : 'text-amber-600'}`} />
          ) : data.trend.diff < 0 ? (
            <TrendingDown className={`w-3.5 h-3.5 ${data.trend.isPositive ? 'text-emerald-600' : 'text-amber-600'}`} />
          ) : (
            <Minus className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className={`font-medium ${
            data.trend.diff === 0 
              ? 'text-slate-500' 
              : data.trend.isPositive 
              ? 'text-emerald-700' 
              : 'text-amber-700'
          }`}>
            {data.trend.text}
          </span>
        </div>
      )}
    </div>
  );
};

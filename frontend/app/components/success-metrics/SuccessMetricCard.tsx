import Link from 'next/link';
import { SuccessMetric } from '@/app/types/outcomeTypes';

interface SuccessMetricCardProps {
  metric: SuccessMetric;
  outcomeId: string;
}

export default function SuccessMetricCard({ metric, outcomeId }: SuccessMetricCardProps) {
  const progress = metric.target_value > 0 ? (metric.current_value / metric.target_value) * 100 : 0;
  const isComplete = progress >= 100;
  const isOnTrack = progress >= 50 && progress < 100;
  const isBehind = progress < 50;

  return (
    <Link
      href={`/u/outcomes/${outcomeId}/metrics/${metric.id}`}
      className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300
                 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
            {metric.metric_name}
          </h3>
          {metric.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {metric.description}
            </p>
          )}
        </div>
        <svg className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
        </svg>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm">
            <span className="font-bold text-2xl text-purple-600">{metric.current_value}</span>
            <span className="text-gray-500 mx-1">/</span>
            <span className="font-medium text-gray-700">{metric.target_value}</span>
            <span className="text-gray-500 ml-1">{metric.unit}</span>
          </div>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isComplete ? 'bg-green-100 text-green-800' :
            isOnTrack ? 'bg-blue-100 text-blue-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            {Math.round(progress)}%
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              isComplete ? 'bg-green-500' :
              isOnTrack ? 'bg-blue-500' :
              'bg-amber-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

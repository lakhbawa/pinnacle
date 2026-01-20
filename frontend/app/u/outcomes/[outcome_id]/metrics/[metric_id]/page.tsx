'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { outcomeAPI } from '@/utils/fetchWrapper';
import { SuccessMetric, SuccessMetricResponse } from '@/app/types/outcomeTypes';

export default function ViewSuccessMetricPage({
  params,
}: {
  params: Promise<{ outcome_id: string; metric_id: string }>;
}) {
  const { outcome_id, metric_id } = use(params);
  const router = useRouter();
  const [metric, setMetric] = useState<SuccessMetric | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await outcomeAPI.get<SuccessMetricResponse>(`/success-metrics/${metric_id}`);
        setMetric(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load success metric');
      } finally {
        setLoading(false);
      }
    }

    if (metric_id) {
      fetchData();
    }
  }, [metric_id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this success metric? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await outcomeAPI.delete(`/success-metrics/${metric_id}`);
      router.push(`/u/outcomes/${outcome_id}`);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete success metric');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 mb-4 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading success metric...</p>
        </div>
      </div>
    );
  }

  if (error || !metric) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-md shadow-sm">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Success Metric</h3>
          <p className="text-red-600">{error || 'Success metric not found'}</p>
          <Link
            href={`/u/outcomes/${outcome_id}`}
            className="mt-4 inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Back to Outcome
          </Link>
        </div>
      </div>
    );
  }

  const progress = metric.target_value > 0 ? (metric.current_value / metric.target_value) * 100 : 0;
  const isComplete = progress >= 100;
  const isOnTrack = progress >= 50 && progress < 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/u/outcomes"
                className="text-gray-500 hover:text-purple-600 transition-colors font-medium"
              >
                Outcomes
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link
                href={`/u/outcomes/${outcome_id}`}
                className="text-gray-500 hover:text-purple-600 transition-colors font-medium"
              >
                Outcome Details
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">Success Metric</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-6 sm:px-8 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {metric.metric_name}
                  </h1>
                  {metric.description && (
                    <p className="mt-2 text-gray-700">{metric.description}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/u/outcomes/${outcome_id}/metrics/${metric_id}/update`}
                  className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Value</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">{metric.current_value}</span>
                  <span className="ml-2 text-xl text-gray-600">{metric.unit}</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Target Value</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-blue-600">{metric.target_value}</span>
                  <span className="ml-2 text-xl text-gray-600">{metric.unit}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isComplete ? 'bg-green-100 text-green-800' :
                  isOnTrack ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {Math.round(progress)}% Complete
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    isComplete ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    isOnTrack ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    'bg-gradient-to-r from-amber-500 to-amber-600'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-sm text-gray-600">
                <span>{metric.current_value} {metric.unit}</span>
                <span>{metric.target_value - metric.current_value} {metric.unit} remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

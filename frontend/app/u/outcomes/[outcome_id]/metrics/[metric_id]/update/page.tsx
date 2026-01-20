'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { outcomeAPI } from '@/utils/fetchWrapper';
import { SuccessMetric, SuccessMetricResponse } from '@/app/types/outcomeTypes';
import SuccessMetricForm from '@/app/components/success-metrics/SuccessMetricForm';

export default function UpdateSuccessMetricPage({
  params,
}: {
  params: Promise<{ outcome_id: string; metric_id: string }>;
}) {
  const { outcome_id, metric_id } = use(params);
  const [metric, setMetric] = useState<SuccessMetric | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <span className="text-gray-900 font-medium">Edit Success Metric</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 sm:px-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Edit Success Metric</h1>
                <p className="mt-1 text-sm text-gray-600">Update the details of this success metric</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <SuccessMetricForm outcomeId={outcome_id} metric={metric} mode="edit" />
          </div>
        </div>
      </div>
    </div>
  );
}

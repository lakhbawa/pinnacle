'use client';

import { use } from 'react';
import Link from 'next/link';
import SuccessMetricForm from '@/app/components/success-metrics/SuccessMetricForm';

export default function CreateSuccessMetricPage({ params }: { params: Promise<{ outcome_id: string }> }) {
  const { outcome_id } = use(params);

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
              <span className="text-gray-900 font-medium">Create Success Metric</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 sm:px-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Create Success Metric</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Define a measurable metric to track progress toward your outcome
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <SuccessMetricForm outcomeId={outcome_id} mode="create" />
          </div>
        </div>
      </div>
    </div>
  );
}

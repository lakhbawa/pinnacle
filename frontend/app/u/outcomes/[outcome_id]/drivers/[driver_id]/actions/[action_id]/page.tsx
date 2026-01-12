'use client'
import { use, useEffect, useState } from "react";
import { outcomeAPI } from "@/utils/fetchWrapper";
import Link from "next/link";
import {Action, ActionResponse} from "@/app/types/outcomeTypes";

export default function ViewActionPage({ params }: { params: Promise<{ outcome_id: string, driver_id: string, action_id: string,  }> }) {
  const [actionData, setActionData] = useState<Action | undefined>();
  const { outcome_id, driver_id, action_id } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await outcomeAPI.get<ActionResponse>(`/actions/${action_id}`);
        setActionData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load action');
      } finally {
        setLoading(false);
      }
    }

    if (action_id) {
      fetchData();
    }
  }, [action_id]);

  const toggleActionCompletion = async () => {
    if (!actionData) return;

    try {
      await outcomeAPI.patch<ActionResponse>(`/actions/${action_id}`, {
        is_completed: !actionData.is_completed
      });
      setActionData(prev => prev ? { ...prev, is_completed: !prev.is_completed } : undefined);
    } catch (error) {
      console.error('Failed to update action status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading action...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-md shadow-sm">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Action</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!actionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-600 font-medium">No action found</p>
          <Link
            href={`/u/outcomes/${outcome_id}/drivers/${driver_id}`}
            className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Driver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href={`/u/outcomes`}
                className="text-gray-500 hover:text-primary-600 transition-colors font-medium"
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
                className="text-gray-500 hover:text-primary-600 transition-colors font-medium"
              >
                {actionData.outcome.title}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link
                href={`/u/outcomes/${outcome_id}/drivers/${driver_id}`}
                className="text-gray-500 hover:text-primary-600 transition-colors font-medium"
              >
                {actionData.driver.title}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">Action Details</span>
            </li>
          </ol>
        </nav>

        {/* Status Badge */}
        <div className="mb-6">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              actionData.is_completed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${
              actionData.is_completed ? 'bg-green-600' : 'bg-yellow-600'
            }`} />
            {actionData.is_completed ? 'Completed' : 'In Progress'}
          </span>
        </div>

        {/* Main Action Card */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-6 sm:px-8 sm:py-8 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
            <div className="flex items-start space-x-4">
              <button
                onClick={toggleActionCompletion}
                className={`w-8 h-8 rounded-lg border-2 flex-shrink-0 transition-all duration-200 hover:scale-110
                  ${actionData.is_completed
                    ? 'bg-green-500 border-green-500 shadow-md'
                    : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-primary-50'
                  }`}
              >
                {actionData.is_completed && (
                  <svg className="w-full h-full text-white p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1">
                <h1 className={`text-2xl sm:text-3xl font-bold ${
                  actionData.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {actionData.title}
                </h1>
                {actionData.description && (
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {actionData.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Outcome Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-blue-900">Outcome</p>
                </div>
                <p className="text-base text-blue-800 font-medium">
                  {actionData.outcome.title}
                </p>
              </div>

              {/* Driver Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-sm font-semibold text-purple-900">Driver</p>
                </div>
                <p className="text-base text-purple-800 font-medium">
                  {actionData.driver.title}
                </p>
              </div>

              {/* Created Date */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-700">Created</p>
                </div>
                <p className="text-base text-gray-900">
                  {new Date(actionData.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Scheduled Date */}
              {actionData.scheduled_for && (
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold text-amber-900">Scheduled For</p>
                  </div>
                  <p className="text-base text-amber-800 font-medium">
                    {new Date(actionData.scheduled_for).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 sm:px-8 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Link
                href={`/u/outcomes/${outcome_id}/drivers/${driver_id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 border border-gray-300
                         shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <svg className="mr-2 h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Driver
              </Link>

              <Link
                href={`/u/outcomes/${outcome_id}/drivers/${driver_id}/actions/${action_id}/update`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-transparent
                         shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Action
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
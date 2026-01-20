'use client'
import { use, useEffect, useState } from "react";
import { outcomeAPI } from "@/utils/fetchWrapper";
import Link from "next/link";
import {Driver, DriverResponse} from "@/app/types/outcomeTypes";

export default function ViewDriverPage({ params }: { params: Promise<{ outcome_id: string, driver_id: string }> }) {
  const [driverData, setDriverData] = useState<Driver | undefined>();
  const { outcome_id, driver_id } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await outcomeAPI.get<DriverResponse>(`/drivers/${driver_id}`);
        setDriverData(data.data);
        console.log(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load initiative');
      } finally {
        setLoading(false);
      }
    }

    if (driver_id) {
      fetchData();
    }
  }, [driver_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading initiative...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-md shadow-sm">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Initiative</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md
                     hover:bg-red-200 transition-colors"
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

  if (!driverData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-600 font-medium">No initiative found</p>
          <Link
            href={`/u/outcomes/${outcome_id}`}
            className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md
                     hover:bg-gray-200 transition-colors"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Outcome
          </Link>
        </div>
      </div>
    );
  }

  const completedActions = driverData.actions.filter(a => a.is_completed).length;
  const totalActions = driverData.actions.length;
  const completionPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {driverData.outcome?.title}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">Initiative Details</span>
            </li>
          </ol>
        </nav>

        {/* Header Card */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-6 sm:px-8 sm:py-8 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <div className="md:flex md:items-start md:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {driverData.title}
                    </h1>
                  </div>
                </div>

                {/* Outcome Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3">
                  <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Outcome:</span>
                  <span className="ml-1">{driverData.outcome?.title}</span>
                </div>

                {driverData.description && (
                  <p className="text-gray-600 leading-relaxed max-w-3xl">
                    {driverData.description}
                  </p>
                )}

                {/* Progress Bar */}
                {totalActions > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress: {completedActions} of {totalActions} actions completed
                      </span>
                      <span className="text-sm font-bold text-purple-700">
                        {Math.round(completionPercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                <Link
                  href={`/u/outcomes/${outcome_id}/drivers/${driver_id}/update`}
                  className="inline-flex items-center px-5 py-2.5 border border-purple-300 rounded-lg shadow-sm
                           text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none
                           focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Initiative
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 sm:px-8 border-b border-gray-200 bg-gray-50">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <svg className="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Actions
                  {totalActions > 0 && (
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {totalActions}
                    </span>
                  )}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Track and manage specific actions for this initiative
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  href={`/u/outcomes/${outcome_id}/drivers/${driver_id}/actions/create`}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm
                           text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none
                           focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Action
                </Link>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            {driverData.actions.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No actions yet</h3>
                <p className="text-sm text-gray-500 mb-6">Get started by creating your first action for this initiative.</p>
                <Link
                  href={`/u/outcomes/${outcome_id}/drivers/${driver_id}/actions/create`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm
                           text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create First Action
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {driverData.actions.map((action) => (
                  <Link
                    key={action.id}
                    href={`/u/outcomes/${outcome_id}/drivers/${driver_id}/actions/${action.id}`}
                    className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-300
                             hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    {/* Completion Status Badge */}
                    <div className="absolute top-4 right-4">
                      {action.is_completed ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>

                    <h3 className={`text-base font-semibold pr-8 group-hover:text-primary-600 transition-colors ${
                      action.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {action.title}
                    </h3>

                    {action.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {action.description}
                      </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center text-gray-500">
                        <svg className="mr-1.5 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(action.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      {action.scheduled_for && (
                        <div className="flex items-center text-amber-600 font-medium">
                          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Due
                        </div>
                      )}
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
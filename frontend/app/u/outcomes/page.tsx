'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { outcomeAPI } from "@/utils/fetchWrapper";
import {useSession} from "next-auth/react";

interface Outcome {
  id: string;
  title: string;
  user_id: string;
  why_it_matters: string;
  success_metric_value: number;
  success_metric_unit: string;
  status: string;
  deadline?: string;
  drivers?: any[];
}

interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  next_page?: string;
}

interface ListOutcomesResponse {
  success: boolean;
  data: Outcome[];
  meta: Meta;
}

type StatusFilter = 'ALL' | 'ACTIVE' | 'PARKED' | 'COMPLETED';

export default function Outcomes() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const { data: session, status } = useSession();

  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') return;

    // Check if user is logged in
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    fetchOutcomes();
  }, [session?.user?.id, status, statusFilter])

  function fetchOutcomes() {
    if (!session?.user?.id) return;

    setLoading(true);

    const params: any = {
      user_id: session.user.id,
      page_size: 20
    };

    // Add status filter if not ALL
    if (statusFilter !== 'ALL') {
      params.status = statusFilter;
    }

    outcomeAPI.get<ListOutcomesResponse>('/outcomes', { params })
        .then((response) => {
          console.log('response', response);
          setOutcomes(response.data || []);
          setMeta(response.meta);
        })
        .catch((error) => {
          console.error('Failed to fetch outcomes:', error);
        })
        .finally(() => {
          setLoading(false);
        })
  }

  const handleStatusChange = async (outcomeId: string, newStatus: string) => {
    try {
      await outcomeAPI.patch(`/outcomes/${outcomeId}`, {
        status: newStatus
      });

      // Refresh the list
      fetchOutcomes();
    } catch (error) {
      console.error('Failed to update outcome status:', error);
      alert('Failed to update outcome status');
    }
  };

  const deleteOutcome = (id: string) => async () => {
    console.log("deleting outcome", id);
    const confirmed = confirm("Are you sure you want to delete this outcome?")
    if (confirmed) {
      try {
        await outcomeAPI.delete(`/outcomes/${id}`)
        setOutcomes(outcomes.filter(p => p.id !== id))
        console.log('Outcome deleted successfully')
      } catch (error) {
        console.error('Failed to delete outcome:', error)
        alert('Failed to delete outcome')
      }
    }
  }

  const filteredOutcomes = outcomes.filter(outcome =>
    outcome.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count outcomes by status
  const activeCount = outcomes.filter(o => o.status?.toUpperCase() === 'ACTIVE').length;
  const parkedCount = outcomes.filter(o => o.status?.toUpperCase() === 'PARKED').length;
  const completedCount = outcomes.filter(o => o.status?.toUpperCase() === 'COMPLETED').length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"/>
          <p className="text-gray-600 text-lg font-medium">Loading outcomes...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <p className="text-gray-900 font-medium text-lg">Authentication Required</p>
          <p className="text-gray-600 mt-2">You must be logged into your account.</p>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                  <svg className="h-8 w-8 mr-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your Outcomes
                </h1>
                <p className="text-sm text-gray-600 ml-11">
                  {outcomes.length === 0
                    ? 'No outcomes yet'
                    : filteredOutcomes.length === outcomes.length
                    ? `${outcomes.length} ${outcomes.length === 1 ? 'outcome' : 'outcomes'}`
                    : `Showing ${filteredOutcomes.length} of ${outcomes.length} outcomes`
                  }
                </p>
              </div>
              <Link
                  href={`/u/outcomes/create`}
                  className="mt-4 sm:mt-0 inline-flex items-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700
                       text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 ease-in-out"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                Create Outcome
              </Link>
            </div>

            {/* Status Filter Tabs */}
            <div className="mt-6 flex items-center space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === 'ALL'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All ({outcomes.length})
              </button>
              <button
                onClick={() => setStatusFilter('ACTIVE')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === 'ACTIVE'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Active ({activeCount})
                </span>
              </button>
              <button
                onClick={() => setStatusFilter('PARKED')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === 'PARKED'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                  Parked ({parkedCount})
                </span>
              </button>
              <button
                onClick={() => setStatusFilter('COMPLETED')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Completed ({completedCount})
                </span>
              </button>
            </div>

            {/* Search Bar - Only show if there are outcomes */}
            {outcomes.length > 0 && (
              <div className="mt-6">
                <div className="relative max-w-md">
                  <input
                      type="text"
                      placeholder="Search outcomes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2.5 pl-11 pr-10 text-gray-900 placeholder-gray-500 bg-white border border-gray-300
                           rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors"
                    >
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Outcomes List */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
            {filteredOutcomes.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {searchQuery ? 'No matching outcomes' : 'No outcomes yet'}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first outcome"}
                </p>
                {!searchQuery && (
                  <Link
                    href={`/u/outcomes/create`}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700
                             text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Create Your First Outcome
                  </Link>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredOutcomes.map((outcome) => {
                  const daysUntilDeadline = outcome.deadline
                    ? Math.ceil((new Date(outcome.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : null;
                  const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0;
                  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
                  const outcomeStatus = outcome.status?.toUpperCase();

                  return (
                    <li
                      key={outcome.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="px-6 py-5 sm:px-8">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 mr-4">
                            <Link
                              href={`/u/outcomes/${outcome.id}`}
                              className="group block"
                            >
                              <div className="flex items-center flex-wrap gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                  {outcome.title}
                                </h3>

                                {/* Status Badge */}
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  outcomeStatus === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800'
                                    : outcomeStatus === 'PARKED'
                                    ? 'bg-amber-100 text-amber-800'
                                    : outcomeStatus === 'COMPLETED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {outcomeStatus || 'ACTIVE'}
                                </span>

                                {daysUntilDeadline !== null && outcomeStatus !== 'COMPLETED' && (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    isOverdue 
                                      ? 'bg-red-100 text-red-800' 
                                      : isUrgent
                                      ? 'bg-orange-100 text-orange-800'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {isOverdue
                                      ? 'Overdue'
                                      : daysUntilDeadline === 0
                                      ? 'Due Today'
                                      : `${daysUntilDeadline}d left`
                                    }
                                  </span>
                                )}
                              </div>

                              {outcome.why_it_matters && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                  {outcome.why_it_matters}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-4 text-sm">
                                {outcome.success_metric_value && (
                                  <div className="flex items-center text-gray-500">
                                    <svg className="w-4 h-4 mr-1.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                    </svg>
                                    <span className="font-medium">Target:</span>
                                    <span className="ml-1">{outcome.success_metric_value} {outcome.success_metric_unit}</span>
                                  </div>
                                )}

                                {outcome.deadline && (
                                  <div className="flex items-center text-gray-500">
                                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                    <span className="font-medium">Deadline:</span>
                                    <span className="ml-1">
                                      {new Date(outcome.deadline).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                )}

                                {outcome.drivers && outcome.drivers.length > 0 && (
                                  <div className="flex items-center text-gray-500">
                                    <svg className="w-4 h-4 mr-1.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span className="font-medium">{outcome.drivers.length}</span>
                                    <span className="ml-1">{outcome.drivers.length === 1 ? 'driver' : 'drivers'}</span>
                                  </div>
                                )}
                              </div>
                            </Link>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {/* Status Toggle Buttons */}
                            {outcomeStatus === 'ACTIVE' ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleStatusChange(outcome.id, 'PARKED');
                                }}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-700
                                         bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100
                                         transition-colors duration-150"
                                title="Park Outcome"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="ml-1.5 hidden sm:inline">Park</span>
                              </button>
                            ) : outcomeStatus === 'PARKED' ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleStatusChange(outcome.id, 'ACTIVE');
                                }}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700
                                         bg-green-50 border border-green-200 rounded-lg hover:bg-green-100
                                         transition-colors duration-150"
                                title="Activate Outcome"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="ml-1.5 hidden sm:inline">Activate</span>
                              </button>
                            ) : null}

                            <Link
                              href={`/u/outcomes/${outcome.id}`}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                                       bg-white border border-gray-300 rounded-lg hover:bg-gray-50
                                       transition-colors duration-150"
                              title="View Details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                              </svg>
                              <span className="ml-1.5 hidden sm:inline">View</span>
                            </Link>
                            <Link
                              href={`/u/outcomes/${outcome.id}/update`}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                                       bg-white border border-gray-300 rounded-lg hover:bg-gray-50
                                       transition-colors duration-150"
                              title="Edit Outcome"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                              <span className="ml-1.5 hidden sm:inline">Edit</span>
                            </Link>
                            <button
                              onClick={deleteOutcome(outcome.id)}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700
                                       bg-red-50 border border-red-200 rounded-lg hover:bg-red-100
                                       transition-colors duration-150"
                              title="Delete Outcome"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                              <span className="ml-1.5 hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
  );
}
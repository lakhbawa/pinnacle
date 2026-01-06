'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { outcomeAPI } from "@/utils/fetchWrapper";

interface Outcome {
  id: string;
  title: string;
  user_id: string;
  why_it_matters: string;
  success_metric_value: number;
  success_metric_unit: string;
  status: string;
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

export default function Outcomes() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const username = 'lakhbawa'

  useEffect(() => {
    outcomeAPI.get<ListOutcomesResponse>('/outcomes', {
      params: {user_id: 'user-123', page_size: 20}
    })
        .then((response) => {
          console.log('response', response);
          setOutcomes(response.data);
          setMeta(response.meta);
        })
        .catch((error) => {
          console.error('Failed to fetch outcomes:', error);
        })
        .finally(() => {
          setLoading(false);
        })
  }, [])

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


  if (loading) return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div
              className="h-8 w-8 mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading outcomes...</p>
        </div>
      </div>
  );

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Outcomes</h1>
              {meta && (
                  <p className="text-sm text-gray-600">
                    Showing {outcomes.length} of {meta.total} outcomes
                  </p>
              )}
            </div>
            <Link
                href={`/u/${username}/outcomes/create`}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700
                     text-white text-sm font-medium rounded-md transition-colors duration-150 ease-in-out"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Create Outcome
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <input
                  type="text"
                  placeholder="Search outcomes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 border border-gray-300
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Outcomes Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOutcomes.length === 0 ? (
              <div className="col-span-full">
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No outcomes found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first outcome"}
                  </p>
                </div>
              </div>
          ) : (
              filteredOutcomes.map((outcome) => (
                  <div
                      key={outcome.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md
                       transition-shadow duration-200 ease-in-out"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link
                              href={`/u/${username}/outcomes/${outcome.id}`}
                              className="block text-lg font-semibold text-gray-900 hover:text-primary-600
                               transition-colors duration-150 ease-in-out mb-2"
                          >
                            {outcome.title}
                          </Link>
                          {outcome.why_it_matters && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                {outcome.why_it_matters}
                              </p>
                          )}
                          {outcome.success_metric_value && (
                              <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                                Target: {outcome.success_metric_value} {outcome.success_metric_unit}
                              </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                        <Link
                            href={`/u/${username}/outcomes/${outcome.id}/update`}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700
                             bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150 ease-in-out"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                          Edit
                        </Link>
                        <button
                            onClick={deleteOutcome(outcome.id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700
                             bg-red-100 hover:bg-red-200 rounded-md transition-colors duration-150 ease-in-out"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  );
}
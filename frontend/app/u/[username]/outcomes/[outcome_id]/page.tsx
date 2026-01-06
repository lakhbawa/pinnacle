'use client'
import {use, useEffect, useState} from "react";
import {outcomeAPI} from "@/utils/fetchWrapper";
import Link from "next/link";
import {Outcome} from "@/app/types/outcomeTypes";

export default function ViewOutcomePage({params}: { params: Promise<{ outcome_id: string, username: string }> }) {
    const [outcomeData, setOutcomeData] = useState<Outcome | null>(null);
    const {outcome_id, username} = use(params);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await outcomeAPI.get(`/outcomes/${outcome_id}?include[]=lists&include[]=lists.issues`);
                setOutcomeData(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load outcome');
            } finally {
                setLoading(false);
            }
        }

        if (outcome_id) {
            fetchData();
        }
    }, [outcome_id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div
                        className="h-8 w-8 mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"/>
                    <p className="text-gray-600">Loading outcome...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-md shadow-sm">
                    <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Outcome</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md
                     hover:bg-red-200 transition-colors"
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                  clipRule="evenodd"/>
                        </svg>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!outcomeData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md text-center shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p className="mt-4 text-gray-600 font-medium">No outcome found</p>
                    <Link
                        href={`/u/${username}/outcomes`}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md
                     hover:bg-gray-200 transition-colors"
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"/>
                        </svg>
                        Back to Outcomes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {outcomeData.title}
                            </h1>
                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                         fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    Due: {new Date(outcomeData.deadline).toLocaleDateString()}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                         fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    Target: {outcomeData.success_metric_value} {outcomeData.success_metric_unit}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <Link
                                href={`/u/${username}/outcomes/${outcome_id}/update`}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm
                         text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                <svg className="mr-2 h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                </svg>
                                Edit Outcome
                            </Link>
                        </div>
                    </div>
                    {outcomeData.why_it_matters && (
                        <div className="mt-6 bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Why This Matters</h3>
                                <div className="mt-2 text-sm text-gray-500">
                                    {outcomeData.why_it_matters}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg leading-6 font-medium text-gray-900">Drivers</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Key activities driving this outcome
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <Link
                                    href={`/u/${username}/outcomes/${outcome_id}/drivers/create`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
                           text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
                           focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    Add Driver
                                </Link>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {outcomeData.drivers.map((driver) => (
                                <Link
                                    key={driver.id}
                                    href={`/u/${username}/outcomes/${outcome_id}/drivers/${driver.id}`}
                                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset
                           focus-within:ring-primary-500 hover:bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-600">
                                            {driver.title}
                                        </h3>
                                        <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                             viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    {driver.description && (
                                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                            {driver.description}
                                        </p>
                                    )}
                                </Link>
                            ))}
                            {outcomeData.drivers.length === 0 && (
                                <div
                                    className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No drivers</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating</p>
                                </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}


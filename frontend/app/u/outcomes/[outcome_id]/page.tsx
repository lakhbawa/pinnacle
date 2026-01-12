'use client'
import {use, useEffect, useState} from "react";
import {outcomeAPI} from "@/utils/fetchWrapper";
import Link from "next/link";
import {Outcome, OutcomeResponse} from "@/app/types/outcomeTypes";

export default function ViewOutcomePage({params}: { params: Promise<{ outcome_id: string }> }) {
    const [outcomeData, setOutcomeData] = useState<Outcome | undefined>();
    const {outcome_id} = use(params);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await outcomeAPI.get<OutcomeResponse>(`/outcomes/${outcome_id}`);
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
                        href={`/u/outcomes`}
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

    const totalDrivers = outcomeData.drivers.length;
    const totalActions = outcomeData.drivers.reduce((sum, driver) => sum + (driver.actions?.length || 0), 0);
    const completedActions = outcomeData.drivers.reduce(
        (sum, driver) => sum + (driver.actions?.filter(a => a.is_completed).length || 0),
        0
    );
    const completionPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

    // Calculate days until deadline
    const today = new Date();
    const deadline = new Date(outcomeData.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;

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
                            <span className="text-gray-900 font-medium">Outcome Details</span>
                        </li>
                    </ol>
                </nav>

                {/* Header Card */}
                <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden mb-8">
                    <div className="px-6 py-6 sm:px-8 sm:py-8 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                        <div className="md:flex md:items-start md:justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            {outcomeData.title}
                                        </h1>
                                    </div>
                                </div>

                                {/* Key Metrics Row */}
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {/* Deadline Badge */}
                                    <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium shadow-sm ${
                                        isOverdue 
                                            ? 'bg-red-100 text-red-800 border border-red-200' 
                                            : daysRemaining <= 7 
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                            : 'bg-green-100 text-green-800 border border-green-200'
                                    }`}>
                                        <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                                        </svg>
                                        <span className="font-semibold">
                                            {isOverdue ? 'Overdue' : daysRemaining === 0 ? 'Due Today' : `${daysRemaining} days left`}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>{deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>

                                    {/* Success Metric Badge */}
                                    <div className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 shadow-sm">
                                        <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                        </svg>
                                        <span className="font-semibold">Target:</span>
                                        <span className="ml-1">{outcomeData.success_metric_value} {outcomeData.success_metric_unit}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {totalActions > 0 && (
                                    <div className="mt-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Overall Progress: {completedActions} of {totalActions} actions completed
                                            </span>
                                            <span className="text-sm font-bold text-blue-700">
                                                {Math.round(completionPercentage)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${completionPercentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                                <Link
                                    href={`/u/outcomes/${outcome_id}/update`}
                                    className="inline-flex items-center px-5 py-2.5 border border-blue-300 rounded-lg shadow-sm
                                             text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none
                                             focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                    </svg>
                                    Edit Outcome
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Why It Matters Section */}
                    {outcomeData.why_it_matters && (
                        <div className="px-6 py-6 sm:px-8 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-orange-100">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Why This Matters</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {outcomeData.why_it_matters}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Row */}
                    <div className="px-6 py-5 sm:px-8 bg-gray-50 grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{totalDrivers}</div>
                            <div className="text-sm text-gray-600 font-medium mt-1">Drivers</div>
                        </div>
                        <div className="text-center border-l border-r border-gray-200">
                            <div className="text-3xl font-bold text-purple-600">{totalActions}</div>
                            <div className="text-sm text-gray-600 font-medium mt-1">Total Actions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{completedActions}</div>
                            <div className="text-sm text-gray-600 font-medium mt-1">Completed</div>
                        </div>
                    </div>
                </div>

                {/* Drivers Section */}
                <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 sm:px-8 border-b border-gray-200 bg-gray-50">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <svg className="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Drivers
                                    {totalDrivers > 0 && (
                                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                            {totalDrivers}
                                        </span>
                                    )}
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Key activities driving this outcome forward
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <Link
                                    href={`/u/outcomes/${outcome_id}/drivers/create`}
                                    className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm
                                             text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none
                                             focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                                >
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                                    </svg>
                                    Add Driver
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6 sm:px-8">
                        {outcomeData.drivers.length === 0 ? (
                            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No drivers yet</h3>
                                <p className="text-sm text-gray-500 mb-6">Get started by creating your first driver for this outcome.</p>
                                <Link
                                    href={`/u/outcomes/${outcome_id}/drivers/create`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm
                                             text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                                >
                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                                    </svg>
                                    Create First Driver
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {outcomeData.drivers.map((driver) => {
                                    const driverActions = driver.actions?.length || 0;
                                    const driverCompleted = driver.actions?.filter(a => a.is_completed).length || 0;
                                    const driverProgress = driverActions > 0 ? (driverCompleted / driverActions) * 100 : 0;

                                    return (
                                        <Link
                                            key={driver.id}
                                            href={`/u/outcomes/${outcome_id}/drivers/${driver.id}`}
                                            className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-300
                                                     hover:shadow-lg transition-all duration-200"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                                        {driver.title}
                                                    </h3>
                                                </div>
                                                <svg className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                                                </svg>
                                            </div>

                                            {driver.description && (
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                    {driver.description}
                                                </p>
                                            )}

                                            {/* Driver Progress */}
                                            {driverActions > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                                        <span className="font-medium">{driverCompleted}/{driverActions} actions</span>
                                                        <span className="font-bold text-primary-600">{Math.round(driverProgress)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 rounded-full transition-all duration-300"
                                                            style={{ width: `${driverProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
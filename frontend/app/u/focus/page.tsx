"use client"
import {useEffect, useState, useMemo, useRef} from "react";
import {Action, Driver, Outcome} from "@/app/types/outcomeTypes";
import {outcomeAPI} from "@/utils/fetchWrapper";
import {useSession} from "next-auth/react";
import Link from "next/link";

interface ListOutcomesResponse {
    success: boolean;
    data: Outcome[];
}

export default function FocusPage() {
    const [outcomes, setOutcomes] = useState<Outcome[]>([])
    const [currentOutcome, setCurrentOutcome] = useState<Outcome | undefined>()
    const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const {data: session, status} = useSession();

    const [showAddDriver, setShowAddDriver] = useState(false)
    const [showAddAction, setShowAddAction] = useState(false)
    const [newDriverTitle, setNewDriverTitle] = useState('')
    const [newActionTitle, setNewActionTitle] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const driverInputRef = useRef<HTMLInputElement>(null)
    const actionInputRef = useRef<HTMLInputElement>(null)

    const {activeOutcomes, parkedOutcomes, totalOutcomes} = useMemo(() => {
        const active = outcomes.filter(o => {
            if (!o.status) return true;
            return o.status.toUpperCase() === 'ACTIVE';
        }).slice(0, 3);

        const parked = outcomes.filter(o => o.status && o.status.toUpperCase() === 'PARKED');

        return {
            activeOutcomes: active,
            parkedOutcomes: parked,
            totalOutcomes: outcomes.length
        };
    }, [outcomes]);

    useEffect(() => {
        async function loadOutcomes() {
            if (status === 'loading') {
                console.log('Session still loading, waiting...');
                return;
            }

            if (status === 'unauthenticated') {
                console.log('User not authenticated');
                setLoading(false);
                return;
            }

            if (!session || !session.user || !session.user.id) {
                console.log('Incomplete session data, waiting...', {
                    session,
                    user: session?.user,
                    id: session?.user?.id
                });
                return;
            }

            console.log('Starting to fetch outcomes for user:', session.user.id);
            setLoading(true);

            try {
                const response = await outcomeAPI.get<ListOutcomesResponse>('/outcomes', {
                    params: {user_id: session.user.id, page_size: 20}
                });

                console.log('API Response:', response);
                console.log('Response data:', response.data);
                console.log('Response data length:', response.data?.length);

                if (response.data && Array.isArray(response.data)) {
                    console.log('Setting outcomes with:', response.data.length, 'items');
                    setOutcomes(response.data);

                    if (response.data.length > 0 && !currentOutcome) {
                        const activeOnes = response.data.filter(o => {
                            if (!o.status) return true;
                            return o.status.toUpperCase() === 'ACTIVE';
                        }).slice(0, 3);

                        console.log('Active outcomes found:', activeOnes.length);

                        if (activeOnes.length > 0) {
                            const first = activeOnes[0];
                            console.log('Selecting first outcome:', first.title);
                            setCurrentOutcome(first);
                            setSelectedDriverIds(first.drivers?.length > 0 ? [first.drivers[0].id] : []);
                        }
                    }
                } else {
                    console.error('Invalid response structure:', response);
                    setOutcomes([]);
                }
            } catch (error) {
                console.error('Failed to fetch outcomes - Error:', error);
                setOutcomes([]);
            } finally {
                console.log('Fetch complete, setting loading to false');
                setLoading(false);
            }
        }

        loadOutcomes();
    }, [session, status]);

    useEffect(() => {
        if (showAddDriver && driverInputRef.current) {
            driverInputRef.current.focus()
        }
    }, [showAddDriver])

    useEffect(() => {
        if (showAddAction && actionInputRef.current) {
            actionInputRef.current.focus()
        }
    }, [showAddAction])

    const drivers = currentOutcome?.drivers ?? []

    const actions = useMemo(() => {
        if (!currentOutcome || selectedDriverIds.length === 0) {
            return []
        }
        return currentOutcome.drivers
            .filter(d => selectedDriverIds.includes(d.id))
            .flatMap(d => d.actions ?? [])
    }, [currentOutcome, selectedDriverIds])

    const selectedDrivers = drivers.filter(d => selectedDriverIds.includes(d.id))

    function fetchOutcomes() {
        if (!session?.user?.id) {
            console.log('No user ID, skipping fetch');
            return;
        }

        console.log('Starting to fetch outcomes for user:', session.user.id);
        setLoading(true)

        outcomeAPI.get<ListOutcomesResponse>('/outcomes', {
            params: {user_id: session.user.id, page_size: 20}
        })
            .then((response) => {
                console.log('API Response:', response);
                console.log('Response data:', response.data);
                console.log('Response data length:', response.data?.length);

                if (response.data && Array.isArray(response.data)) {
                    console.log('Setting outcomes with:', response.data.length, 'items');
                    setOutcomes(response.data)
                } else {
                    console.error('Invalid response structure:', response);
                    setOutcomes([])
                }

                // Auto-select first active outcome on initial load
                if (response.data && response.data.length > 0 && !currentOutcome) {
                    const activeOnes = response.data.filter(o => {
                        if (!o.status) return true;
                        return o.status.toUpperCase() === 'ACTIVE';
                    }).slice(0, 3);

                    console.log('Active outcomes found:', activeOnes.length);

                    if (activeOnes.length > 0) {
                        const first = activeOnes[0]
                        console.log('Selecting first outcome:', first.title);
                        setCurrentOutcome(first)
                        setSelectedDriverIds(first.drivers?.length > 0 ? [first.drivers[0].id] : [])
                    }
                }
            })
            .catch((error) => {
                console.error('Failed to fetch outcomes - Error:', error)
                console.error('Error details:', error.message, error.response);
                setOutcomes([])
            })
            .finally(() => {
                console.log('Fetch complete, setting loading to false');
                setLoading(false)
            })
    }

    function selectOutcome(outcome: Outcome) {
        setCurrentOutcome(outcome)
        setSelectedDriverIds(outcome?.drivers?.length ? [outcome.drivers[0].id] : [])
        setShowAddDriver(false)
        setShowAddAction(false)
    }

    function toggleDriver(id: string) {
        setSelectedDriverIds(prev => {
            if (prev.includes(id)) {
                if (prev.length === 1) return prev
                return prev.filter(dId => dId !== id)
            }
            return [...prev, id]
        })
    }

    async function handleParkOutcome(outcomeId: string) {
        try {
            await outcomeAPI.patch(`/outcomes/${outcomeId}`, {
                status: 'PARKED'
            })
            fetchOutcomes()
            if (currentOutcome?.id === outcomeId) {
                setCurrentOutcome(undefined)
            }
        } catch (error) {
            console.error('Failed to park outcome:', error)
        }
    }

    async function handleCompleteOutcome(outcomeId: string) {
        const confirmed = confirm("Mark this outcome as completed?")
        if (!confirmed) return

        try {
            await outcomeAPI.patch(`/outcomes/${outcomeId}`, {
                status: 'COMPLETED'
            })
            fetchOutcomes()
            if (currentOutcome?.id === outcomeId) {
                setCurrentOutcome(undefined)
            }
        } catch (error) {
            console.error('Failed to complete outcome:', error)
        }
    }

    async function handleAddDriver(e: React.FormEvent) {
        e.preventDefault()
        if (!newDriverTitle.trim() || !currentOutcome || !session?.user?.id) return

        setIsSubmitting(true)
        try {
            await outcomeAPI.post(`/drivers`, {
                title: newDriverTitle.trim(),
                outcome_id: currentOutcome.id,
                user_id: session.user.id
            })
            setNewDriverTitle('')
            setShowAddDriver(false)
            fetchOutcomes()
        } catch (error) {
            console.error('Failed to add driver:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleAddAction(e: React.FormEvent) {
        e.preventDefault()
        if (!newActionTitle.trim() || selectedDriverIds.length === 0 || !session?.user?.id) return

        const targetDriverId = selectedDriverIds[0]

        setIsSubmitting(true)
        try {
            await outcomeAPI.post(`/actions`, {
                title: newActionTitle.trim(),
                driver_id: targetDriverId,
                outcome_id: currentOutcome?.id,
                user_id: session.user.id
            })
            setNewActionTitle('')
            setShowAddAction(false)
            fetchOutcomes()
        } catch (error) {
            console.error('Failed to add action:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function toggleActionCompletion(action: Action) {
        if (!currentOutcome || !session) return;

        const optimisticOutcome = {
            ...currentOutcome,
            drivers: currentOutcome.drivers.map(driver => ({
                ...driver,
                actions: driver.actions?.map(a =>
                    a.id === action.id
                        ? {...a, is_completed: !a.is_completed}
                        : a
                ) ?? []
            }))
        };

        setCurrentOutcome(optimisticOutcome);
        setOutcomes(prev => prev.map(o =>
            o.id === currentOutcome.id ? optimisticOutcome : o
        ));

        try {
            await outcomeAPI.patch(`/actions/${action.id}`, {
                is_completed: !action.is_completed
            });
        } catch (error) {
            console.error('Failed to toggle action:', error);

            setCurrentOutcome(currentOutcome);
            setOutcomes(prev => prev.map(o =>
                o.id === currentOutcome.id ? currentOutcome : o
            ));

            alert('Failed to update action. Please try again.');
        }
    }

    function handleKeyDown(e: React.KeyboardEvent, onCancel: () => void) {
        if (e.key === 'Escape') {
            onCancel()
        }
    }

    const formatDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    // Handle loading and auth states
    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div
                        className="h-12 w-12 mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"/>
                    <p className="text-gray-600 text-lg font-medium">Loading your focus area...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-900 font-medium text-lg">Authentication Required</p>
                    <p className="text-gray-600 mt-2">You must be logged into your account.</p>
                </div>
            </div>
        );
    }

    console.log('Rendering - Total outcomes:', totalOutcomes);
    console.log('Rendering - Active outcomes:', activeOutcomes.length);
    console.log('Rendering - Active outcomes data:', activeOutcomes);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <svg className="w-8 h-8 mr-3 text-primary-600" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                            Today's Focus
                        </h1>
                        <span className="text-sm text-gray-500 font-medium">{formatDate()}</span>
                    </div>

                    {totalOutcomes > 0 && (
                        <div
                            className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span className="text-sm font-medium text-blue-900">
                                    Showing {activeOutcomes.length} active outcome{activeOutcomes.length !== 1 ? 's' : ''} out of {totalOutcomes} total
                                </span>
                            </div>
                            <Link
                                href="/u/outcomes"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                            >
                                Manage Outcomes
                                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>


                {activeOutcomes.length === 0 ? (
                    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Outcomes</h3>
                        <p className="text-gray-500 mb-6">Get started by creating or activating an outcome to focus
                            on.</p>
                        <Link
                            href="/u/outcomes"
                            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700
                                     text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                            </svg>
                            Create Your First Outcome
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {activeOutcomes.map((outcome) => {
                                const totalActions = outcome.drivers?.reduce((sum, d) => sum + (d.actions?.length ?? 0), 0) ?? 0
                                const completedActions = outcome.drivers?.reduce((sum, d) =>
                                    sum + (d.actions?.filter(a => a.is_completed).length ?? 0), 0
                                ) ?? 0
                                const progress = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0
                                const isSelected = currentOutcome?.id === outcome.id

                                const daysUntilDeadline = outcome.deadline
                                    ? Math.ceil((new Date(outcome.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                    : null
                                const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0
                                const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline >= 0

                                return (
                                    <div
                                        key={outcome.id}
                                        onClick={() => selectOutcome(outcome)}
                                        className={`
                                            bg-white rounded-xl border-2 transition-all cursor-pointer
                                            ${isSelected
                                            ? 'border-primary-500 shadow-lg ring-2 ring-primary-100'
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                        }
                                        `}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                                                    {outcome.title}
                                                </h3>
                                                {daysUntilDeadline !== null && (
                                                    <span
                                                        className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                                            isOverdue
                                                                ? 'bg-red-100 text-red-800'
                                                                : isUrgent
                                                                    ? 'bg-amber-100 text-amber-800'
                                                                    : 'bg-green-100 text-green-800'
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

                                            <div className="mb-4">
                                                <div
                                                    className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                                    <span className="font-medium">Progress</span>
                                                    <span className="font-bold">{progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                                                        style={{width: `${progress}%`}}
                                                    />
                                                </div>
                                                <div
                                                    className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                                    <span>{completedActions} of {totalActions} actions done</span>
                                                    <span>{outcome.drivers?.length ?? 0} initiatives</span>
                                                </div>
                                            </div>

                                            {/*{outcome.success_metric_value && (*/}
                                            {/*    <div className="mb-4 p-3 bg-gray-50 rounded-lg">*/}
                                            {/*        <div className="text-xs text-gray-500 mb-1">Success Target</div>*/}
                                            {/*        <div className="text-sm font-semibold text-gray-900">*/}
                                            {/*            {outcome.success_metric_value} {outcome.success_metric_unit}*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*)}*/}

                                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                                <Link
                                                    href={`/u/outcomes/${outcome.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100
                                                             hover:bg-gray-200 rounded-lg transition-colors text-center"
                                                >
                                                    View Details
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleParkOutcome(outcome.id)
                                                    }}
                                                    className="px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50
                                                             hover:bg-amber-100 rounded-lg transition-colors"
                                                    title="Park Outcome"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                                         stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"/>
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleCompleteOutcome(outcome.id)
                                                    }}
                                                    className="px-3 py-2 text-xs font-medium text-green-700 bg-green-50
                                                             hover:bg-green-100 rounded-lg transition-colors"
                                                    title="Complete Outcome"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                                         stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {activeOutcomes.length < 3 && (
                                <Link
                                    href="/u/outcomes"
                                    className="bg-white rounded-xl border-2 border-dashed border-gray-300
                                             hover:border-primary-400 hover:bg-primary-50 transition-all p-6
                                             flex flex-col items-center justify-center text-center min-h-[280px]"
                                >
                                    <div
                                        className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 4v16m8-8H4"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                                        {parkedOutcomes.length > 0 ? 'Activate Parked Outcome' : 'Create New Outcome'}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {parkedOutcomes.length > 0
                                            ? `${parkedOutcomes.length} parked outcome${parkedOutcomes.length !== 1 ? 's' : ''} available`
                                            : 'Add another goal to focus on'
                                        }
                                    </p>
                                </Link>
                            )}
                        </div>

                        {currentOutcome && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                {/* Initiative Tabs */}
                                <div className="border-b border-gray-200 px-6">
                                    <div className="flex items-center gap-2 -mb-px overflow-x-auto">
                                        <span
                                            className="text-sm font-medium text-gray-500 py-4 flex-shrink-0">Initiatives:</span>
                                        {drivers.map((driver) => {
                                            const isSelected = selectedDriverIds.includes(driver.id)
                                            const driverActions = driver.actions ?? []
                                            const completed = driverActions.filter(a => a.is_completed).length

                                            return (
                                                <button
                                                    key={driver.id}
                                                    onClick={() => toggleDriver(driver.id)}
                                                    className={`
                                                        px-4 py-4 text-sm font-medium transition-all relative flex-shrink-0
                                                        ${isSelected
                                                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                    }
                                                    `}
                                                >
                                                    {driver.title}
                                                    {driverActions.length > 0 && (
                                                        <span
                                                            className={`ml-2 text-xs ${isSelected ? 'text-primary-500' : 'text-gray-400'}`}>
                                                            {completed}/{driverActions.length}
                                                        </span>
                                                    )}
                                                </button>
                                            )
                                        })}

                                        <button
                                            onClick={() => setShowAddDriver(true)}
                                            className="px-3 py-4 text-gray-400 hover:text-primary-600 transition-colors flex-shrink-0"
                                            title="Add initiative"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                                 stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M12 4v16m8-8H4"/>
                                            </svg>
                                        </button>
                                    </div>

                                    {showAddDriver && (
                                        <form onSubmit={handleAddDriver} className="py-3 flex gap-2">
                                            <input
                                                ref={driverInputRef}
                                                type="text"
                                                value={newDriverTitle}
                                                onChange={(e) => setNewDriverTitle(e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, () => {
                                                    setShowAddDriver(false)
                                                    setNewDriverTitle('')
                                                })}
                                                placeholder="Initiative name..."
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg
                                                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                disabled={isSubmitting}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newDriverTitle.trim() || isSubmitting}
                                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600
                                                         rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Adding...' : 'Add'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowAddDriver(false)
                                                    setNewDriverTitle('')
                                                }}
                                                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    )}
                                </div>

                                <div className="p-6">
                                    {drivers.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500 mb-4">No initiatives yet. Add one to break down
                                                your
                                                outcome.</p>
                                            <button
                                                onClick={() => setShowAddDriver(true)}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                                                         text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M12 4v16m8-8H4"/>
                                                </svg>
                                                Add Initiative
                                            </button>
                                        </div>
                                    ) : selectedDriverIds.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            Select an initiative to see actions
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {actions.length > 0 && (
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        Actions {selectedDrivers.length === 1
                                                        ? `for ${selectedDrivers[0].title}`
                                                        : `for ${selectedDrivers.length} initiatives`}
                                                    </h3>
                                                    <span
                                                        className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        {actions.filter(a => a.is_completed).length} of {actions.length} done
                                                    </span>
                                                </div>
                                            )}

                                            {actions.map((action) => {
                                                const isCompleted = action.is_completed
                                                const actionDriver = drivers.find(d => d.id === action.driver_id)

                                                return (
                                                    <div
                                                        key={action.id}
                                                        className={`
                                                            flex items-start gap-3 p-4 bg-white border rounded-lg transition-all
                                                            ${isCompleted
                                                            ? 'border-gray-100 bg-gray-50'
                                                            : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'
                                                        }
                                                        `}
                                                    >
                                                        <button
                                                            onClick={() => toggleActionCompletion(action)}
                                                            className={`
                                                                w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 transition-all 
                                                                flex items-center justify-center
                                                                ${isCompleted
                                                                ? 'bg-green-500 border-green-500'
                                                                : 'border-gray-300 hover:border-primary-500'
                                                            }
                                                            `}
                                                        >
                                                            {isCompleted && (
                                                                <svg className="w-3 h-3 text-white" fill="none"
                                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          strokeWidth={3} d="M5 13l4 4L19 7"/>
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <div className="flex-1 min-w-0">
                                                            <span
                                                                className={`text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                                {action.title}
                                                            </span>
                                                            {selectedDriverIds.length > 1 && actionDriver && (
                                                                <span
                                                                    className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                                    {actionDriver.title}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {action.scheduled_for && !isCompleted && (
                                                            <span className="text-xs text-gray-400 flex-shrink-0">
                                                                {new Date(action.scheduled_for).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            })}

                                            {showAddAction ? (
                                                <form onSubmit={handleAddAction}
                                                      className="flex gap-2 p-3 bg-white border-2 border-primary-200 rounded-lg">
                                                    <input
                                                        ref={actionInputRef}
                                                        type="text"
                                                        value={newActionTitle}
                                                        onChange={(e) => setNewActionTitle(e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, () => {
                                                            setShowAddAction(false)
                                                            setNewActionTitle('')
                                                        })}
                                                        placeholder="What needs to be done?"
                                                        className="flex-1 px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0"
                                                        disabled={isSubmitting}
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={!newActionTitle.trim() || isSubmitting}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600
                                                                 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmitting ? 'Adding...' : 'Add'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowAddAction(false)
                                                            setNewActionTitle('')
                                                        }}
                                                        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </form>
                                            ) : (
                                                <button
                                                    onClick={() => setShowAddAction(true)}
                                                    className="w-full flex items-center justify-center gap-2 p-4 text-sm font-medium
                                                             text-gray-600 hover:text-primary-600 hover:bg-primary-50 border-2
                                                             border-dashed border-gray-200 hover:border-primary-300 rounded-lg
                                                             transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                                         stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M12 4v16m8-8H4"/>
                                                    </svg>
                                                    Add action
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
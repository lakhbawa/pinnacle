"use client"
import {useEffect, useState, useMemo, useRef} from "react";
import {Action, Driver, Outcome} from "@/app/types/outcomeTypes";
import {outcomeAPI} from "@/utils/fetchWrapper";
import {useSession} from "next-auth/react";

interface ListOutcomesResponse {
    success: boolean;
    data: Outcome[];
}

export default function FocusPage() {
    const [outcomes, setOutcomes] = useState<Outcome[]>([])
    const [currentOutcome, setCurrentOutcome] = useState<Outcome | undefined>()
    const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    const {data: session, status} = useSession();

    const isLoggedIn = !!session;
    if (!isLoggedIn) {
        return (
            <>
                You must be logged into your account.
            </>
        )
    }
    let userId: string | undefined;
    if (isLoggedIn) {
        userId = session?.user?.id
    }

    const [showAddDriver, setShowAddDriver] = useState(false)
    const [showAddAction, setShowAddAction] = useState(false)
    const [newDriverTitle, setNewDriverTitle] = useState('')
    const [newActionTitle, setNewActionTitle] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const driverInputRef = useRef<HTMLInputElement>(null)
    const actionInputRef = useRef<HTMLInputElement>(null)


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

    useEffect(() => {
        fetchOutcomes()
    }, [])

    // Auto-focus inputs when forms open
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

    function fetchOutcomes() {
        setLoading(true)
        outcomeAPI.get<ListOutcomesResponse>('/focus/' + userId, {
            params: {user_id: 'user-123', page_size: 20}
        })
            .then((response) => {
                setOutcomes(response.data)

                if (currentOutcome) {
                    // Preserve selection if possible
                    const updated = response.data.find(o => o.id === currentOutcome.id)
                    if (updated) {
                        setCurrentOutcome(updated)
                        // Keep only valid driver selections
                        const validIds = selectedDriverIds.filter(id =>
                            updated.drivers.find(d => d.id === id)
                        )
                        if (validIds.length > 0) {
                            setSelectedDriverIds(validIds)
                        } else if (updated.drivers.length > 0) {
                            setSelectedDriverIds([updated.drivers[0].id])
                        }
                    }
                } else if (response.data.length > 0) {
                    // Auto-select first outcome on initial load
                    const first = response.data[0]
                    setCurrentOutcome(first)
                    setSelectedDriverIds(first.drivers.length > 0 ? [first.drivers[0].id] : [])
                }
            })
            .catch((error) => {
                console.error('Failed to fetch outcomes:', error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function selectOutcome(id: string) {
        const outcome = outcomes.find(o => o.id === id)
        setCurrentOutcome(outcome)
        setSelectedDriverIds(outcome?.drivers.length ? [outcome.drivers[0].id] : [])
        setShowAddDriver(false)
        setShowAddAction(false)
    }

    function toggleDriver(id: string) {
        setSelectedDriverIds(prev => {
            if (prev.includes(id)) {
                // Don't allow deselecting the last driver
                if (prev.length === 1) return prev
                return prev.filter(dId => dId !== id)
            }
            return [...prev, id]
        })
    }

    const formatDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    async function handleAddDriver(e: React.FormEvent) {
        e.preventDefault()
        if (!newDriverTitle.trim() || !currentOutcome) return

        setIsSubmitting(true)
        try {
            await outcomeAPI.post(`/drivers`, {
                title: newDriverTitle.trim(),
                outcome_id: currentOutcome.id,
                user_id: userId
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
        if (!newActionTitle.trim() || selectedDriverIds.length === 0) return

        // Add to the first selected driver
        const targetDriverId = selectedDriverIds[0]

        setIsSubmitting(true)
        try {
            await outcomeAPI.post(`/actions`, {
                title: newActionTitle.trim(),
                driver_id: targetDriverId,
                outcome_id: currentOutcome?.id,
                user_id: userId
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
        try {
            await outcomeAPI.patch(`/actions/${action.id}`, {
                completed_at: action.completed_at ? null : new Date().toISOString()
            })
            fetchOutcomes()
        } catch (error) {
            console.error('Failed to toggle action:', error)
        }
    }

    function handleKeyDown(e: React.KeyboardEvent, onCancel: () => void) {
        if (e.key === 'Escape') {
            onCancel()
        }
    }

    if (loading && outcomes.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-gray-500 text-sm">Loading...</div>
                </div>
            </div>
        )
    }

    const totalActions = drivers.reduce((sum, driver) => sum + (driver.actions?.length ?? 0), 0)
    const completedActions = drivers.reduce((sum, driver) =>
        sum + (driver.actions?.filter(a => a.completed_at !== null).length ?? 0), 0
    )
    const progressPercentage = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-baseline justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Today's Focus</h1>
                    <span className="text-sm text-gray-500">{formatDate()}</span>
                </div>

                {/* Outcome Selector */}
                <section className="mb-6">
                    <label className="text-xs font-semibold text-gray-500 tracking-wider uppercase block mb-3">
                        Outcome
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {outcomes.map((outcome) => (
                            <button
                                key={outcome.id}
                                onClick={() => selectOutcome(outcome.id)}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${currentOutcome?.id === outcome.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                                }
                                `}
                            >
                                {outcome.title}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Current Outcome Details */}
                {currentOutcome && (
                    <section className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {currentOutcome.title}
                                </h2>
                                {currentOutcome.why_it_matters && (
                                    <p className="text-gray-500 text-sm mt-1">
                                        {currentOutcome.why_it_matters}
                                    </p>
                                )}
                            </div>
                            {currentOutcome.success_metric_value && (
                                <div className="text-right text-sm">
                                    <span className="text-gray-500">Target:</span>
                                    <span className="ml-1 font-semibold text-gray-900">
                                        {currentOutcome.success_metric_value} {currentOutcome.success_metric_unit}
                                    </span>
                                </div>
                            )}
                        </div>

                        {totalActions > 0 && (
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                        style={{width: `${progressPercentage}%`}}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 tabular-nums">
                                    {completedActions}/{totalActions}
                                </span>
                            </div>
                        )}
                    </section>
                )}

                {/* Driver Tabs */}
                {currentOutcome && (
                    <section className="mb-6">
                        <div className="flex items-center gap-2 border-b border-gray-200">
                            {drivers.map((driver) => {
                                const isSelected = selectedDriverIds.includes(driver.id)
                                const driverActions = driver.actions ?? []
                                const completed = driverActions.filter(a => a.completed_at !== null).length

                                return (
                                    <button
                                        key={driver.id}
                                        onClick={() => toggleDriver(driver.id)}
                                        className={`
                                            px-4 py-3 text-sm font-medium transition-all relative
                                            ${isSelected
                                            ? 'text-blue-600 border-b-2 border-blue-600 -mb-px bg-blue-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }
                                        `}
                                    >
                                        {driver.title}
                                        {driverActions.length > 0 && (
                                            <span
                                                className={`ml-2 text-xs ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>
                                                {completed}/{driverActions.length}
                                            </span>
                                        )}
                                    </button>
                                )
                            })}

                            {/* Add Driver Button */}
                            <button
                                onClick={() => setShowAddDriver(true)}
                                className="px-3 py-3 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Add driver"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>
                        </div>

                        {/* Add Driver Form */}
                        {showAddDriver && (
                            <form onSubmit={handleAddDriver} className="mt-3 flex gap-2">
                                <input
                                    ref={driverInputRef}
                                    type="text"
                                    value={newDriverTitle}
                                    onChange={(e) => setNewDriverTitle(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, () => {
                                        setShowAddDriver(false)
                                        setNewDriverTitle('')
                                    })}
                                    placeholder="Driver name..."
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="submit"
                                    disabled={!newDriverTitle.trim() || isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </section>
                )}

                {/* Actions List */}
                <section>
                    {!currentOutcome ? (
                        <div className="text-center py-12 text-gray-500">
                            Select an outcome to get started
                        </div>
                    ) : drivers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No drivers yet. Add one to break down your outcome.</p>
                            <button
                                onClick={() => setShowAddDriver(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 4v16m8-8H4"/>
                                </svg>
                                Add Driver
                            </button>
                        </div>
                    ) : selectedDriverIds.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Select a driver to see actions
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {actions.length > 0 && (
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-700">
                                        Actions {selectedDrivers.length === 1
                                        ? `for ${selectedDrivers[0].title}`
                                        : `for ${selectedDrivers.length} drivers`}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {actions.filter(a => a.completed_at).length} of {actions.length} done
                                    </span>
                                </div>
                            )}

                            {actions.map((action) => {
                                const isCompleted = action.completed_at !== null
                                const actionDriver = drivers.find(d => d.id === action.driver_id)

                                return (
                                    <div
                                        key={action.id}
                                        className={`
                                            flex items-start gap-3 p-4 bg-white border rounded-lg transition-all
                                            ${isCompleted
                                            ? 'border-gray-100 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                                        `}
                                    >
                                        <button
                                            onClick={() => toggleActionCompletion(action)}
                                            className={`
                                                w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 transition-all flex items-center justify-center
                                                ${isCompleted
                                                ? 'bg-green-500 border-green-500'
                                                : 'border-gray-300 hover:border-blue-500'
                                            }
                                            `}
                                        >
                                            {isCompleted && (
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24"
                                                     stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
                                                          d="M5 13l4 4L19 7"/>
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

                            {/* Add Action */}
                            {showAddAction ? (
                                <form onSubmit={handleAddAction}
                                      className="flex gap-2 p-2 bg-white border border-blue-200 rounded-lg">
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
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className="w-full flex items-center gap-2 p-3 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-gray-200 hover:border-blue-300 rounded-lg transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 4v16m8-8H4"/>
                                    </svg>
                                    Add action
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
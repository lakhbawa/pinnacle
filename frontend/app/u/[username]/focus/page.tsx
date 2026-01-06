"use client"
import {useEffect, useState, useMemo} from "react";
import {Action, Driver, Outcome} from "@/app/types/outcomeTypes";
import {outcomeAPI} from "@/utils/fetchWrapper";

interface ListOutcomesResponse {
    success: boolean;
    data: Outcome[];
}

export default function FocusPage() {
    const [outcomes, setOutcomes] = useState<Outcome[]>([])
    const [currentOutcome, setCurrentOutcome] = useState<Outcome | undefined>()
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const username = 'lakhbawa'

    const drivers = currentOutcome?.drivers ?? []

    const actions = useMemo(() => {
        if (!currentOutcome || !selectedDriverId) {
            return []
        }
        const driver = currentOutcome.drivers.find(d => d.id === selectedDriverId)
        return driver?.actions ?? []
    }, [currentOutcome, selectedDriverId])

    useEffect(() => {
        outcomeAPI.get<ListOutcomesResponse>('/focus/' + username, {
            params: {user_id: 'user-123', page_size: 20}
        })
            .then((response) => {
                setOutcomes(response.data);
            })
            .catch((error) => {
                console.error('Failed to fetch outcomes:', error);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [])

    function selectOutcome(id: string) {
        const outcome = outcomes.find(o => o.id === id)
        setCurrentOutcome(outcome)
        setSelectedDriverId(outcome?.drivers[0]?.id ?? null)
    }

    function selectDriver(id: string) {
        setSelectedDriverId(id)
    }

    const formatDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    function switchActionCompletion(action: Action) {
      // set action to completed
        console.log("compelte action", id)
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    return (


            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Title Row */}
                <div className="flex items-baseline justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Today</h1>
                    <span className="text-sm text-gray-500 font-mono">{formatDate()}</span>
                </div>

                {/* Outcome Selector */}
                <div className="mb-6">
                    <label className="text-xs font-semibold text-blue-600 tracking-wider uppercase block mb-2">
                        Select Outcome
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {outcomes.map((outcome) => (
                            <button
                                key={outcome.id}
                                onClick={() => selectOutcome(outcome.id)}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${currentOutcome?.id === outcome.id
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                {outcome.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Current Outcome Card */}
                {currentOutcome && (
                    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                        <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
                            Current Outcome
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900 mt-2">
                            {currentOutcome.title}
                        </h3>
                        {currentOutcome.why_it_matters && (
                            <p className="text-gray-500 text-sm mt-2">
                                {currentOutcome.why_it_matters}
                            </p>
                        )}
                        {currentOutcome.success_metric_value && (
                            <p className="text-gray-600 text-sm mt-2">
                                Target: {currentOutcome.success_metric_value} {currentOutcome.success_metric_unit}
                            </p>
                        )}
                    </div>
                )}

                {/* Driver Tabs */}
                {drivers.length > 0 && (
                    <div className="flex gap-1 border-b border-gray-200 mb-6">
                        {drivers.map((driver) => {
                            const isSelected = driver.id === selectedDriverId
                            const driverActions = driver.actions ?? []
                            const completed = driverActions.filter(a => a.completed_at !== null).length

                            return (
                                <button
                                    key={driver.id}
                                    onClick={() => selectDriver(driver.id)}
                                    className={`
                                        px-4 py-3 text-sm font-medium transition-all relative
                                        ${isSelected
                                            ? 'text-gray-900 border-b-2 border-gray-900 -mb-px'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }
                                    `}
                                >
                                    <span>{driver.title}</span>
                                    {driverActions.length > 0 && (
                                        <span className={`ml-2 text-xs ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                                            {completed}/{driverActions.length}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Actions List */}
                <div className="space-y-3">
                    {!currentOutcome ? (
                        <div className="text-center py-8 text-gray-500">
                            Select an outcome to see drivers and actions
                        </div>
                    ) : !selectedDriverId ? (
                        <div className="text-center py-8 text-gray-500">
                            Select a driver to see actions
                        </div>
                    ) : actions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No actions for this driver yet
                        </div>
                    ) : (
                        actions.map((action) => {
                            const isCompleted = action.completed_at !== null

                            return (
                                <div
                                    key={action.id}
                                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <button onClick={() => switchActionCompletion(action)}
                                            className={`
                                                w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 transition-all
                                                ${isCompleted
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }
                                            `}
                                        >
                                            {isCompleted && (
                                                <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                        <p className={`text-gray-900 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                                            {action.title}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </main>

    )
}
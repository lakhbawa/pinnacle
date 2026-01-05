'use client'
import {use, useEffect, useState} from "react";
import {outcomeAPI} from "@/utils/fetchWrapper";
import Link from "next/link";
import {Outcome} from "@/app/types/outcomeTypes";


export default function ViewOutcomePage({params}: { params: Promise<{ outcome_id: string, username:string }> }) {

    const [outcomeData, setOutcomeData] = useState<Outcome | null>(null);
    const {outcome_id, username} = use(params);

    // const username = 'lakhbawa'
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const data = await outcomeAPI.get(`/outcomes/${outcome_id}?include[]=lists&include[]=lists.issues`);
                setOutcomeData(data.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load project')
            } finally {
                setLoading(false)
            }
        }

        if (outcome_id) {
            fetchData()
        }
    }, [outcome_id])
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-slate-600">Loading project...</p>
                </div>
            </div>
        )
    }

        if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-md shadow-sm">
                    <h3 className="text-red-800 font-semibold text-lg mb-2">Error Occurred</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!outcomeData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-8 max-w-md text-center shadow-sm">
                    <p className="text-slate-600 font-medium">No project found</p>
                    <Link
                        href="/outcomes"
                        className="mt-4 inline-block px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                    >
                        Back to Outcomes
                    </Link>
                </div>
            </div>
        )
    }
    return (
        <>
            <h1>Outcome Details</h1>

            Title : { outcomeData.title}

            <h2 className="p-3 font-semibold">Drivers</h2>
            <div>

            </div>
            { outcomeData.drivers.map((driver) => (
                <div key={driver.id}>

                    <Link href={`/u/${username}/outcomes/${outcome_id}/drivers/${driver.id}`} className="p-3">
                        { driver.title}
                    </Link>
                </div>

            ))}
        </>
    )


}
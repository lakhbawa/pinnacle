'use client'
import {use, useEffect, useState} from "react";
import {outcomeAPI} from "@/utils/fetchWrapper";
import Link from "next/link";
import {Driver} from "@/app/types/outcomeTypes";


export default function ViewDriverPage({params}: { params: Promise<{ outcome_id: string, driver_id: string, username:string }> }) {

    const [driverData, setDriverData] = useState<Driver | null>(null);
    const {outcome_id, driver_id, username} = use(params);

    // const username = 'lakhbawa'
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const data = await outcomeAPI.get(`/drivers/${driver_id}`);
                setDriverData(data.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load driver')
            } finally {
                setLoading(false)
            }
        }

        if (driver_id) {
            fetchData()
        }
    }, [driver_id])
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-slate-600">Loading driver...</p>
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

    if (!driverData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-8 max-w-md text-center shadow-sm">
                    <p className="text-slate-600 font-medium">No driver found</p>
                    <Link
                        href="/outcomes"
                        className="mt-4 inline-block px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                    >
                        Back to Drivers
                    </Link>
                </div>
            </div>
        )
    }
    return (
        <>
            { JSON.stringify(driverData)}
            <h1>Driver Details</h1>

            Title : { driverData.title}

            <h2 className="p-3 font-semibold">Actions</h2>
            <div>

            </div>
            { driverData.actions.map((action) => (
                <>

                    <Link href={`/u/${username}/outcomes/${outcome_id}/drivers/${driver_id}/actions/${action.id}`} className="p-3">
                        { action.title}
                    </Link>
                </>

            ))}
        </>
    )


}
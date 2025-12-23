'use client'
import {use, useEffect, useState} from "react";
import api from "@/utils/fetchWrapper";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
}

export default function ViewProjectPage({params}: { params: Promise<{ id: string, username:string }> }) {

    const [projectData, setProjectData] = useState<Project | null>(null);
    const {id, username} = use(params);

    // const username = 'lakhbawa'
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const data = await api.get(`/projects/${id}?include[]=lists&include[]=lists.issues`);
                setProjectData(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load project')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchData()
        }
    }, [id])
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

    if (!projectData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-8 max-w-md text-center shadow-sm">
                    <p className="text-slate-600 font-medium">No project found</p>
                    <Link
                        href="/projects"
                        className="mt-4 inline-block px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                    >
                        Back to Projects
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-slate-800">{projectData.title}</h2>
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-sm">
                                ID: {id}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={`/u/${username}/projects/${id}/lists`}
                            className="flex-1 text-center py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm"
                        >
                            View Lists
                        </Link>
                        <Link
                            href={`/u/${username}/projects`}
                            className="px-4 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )

}
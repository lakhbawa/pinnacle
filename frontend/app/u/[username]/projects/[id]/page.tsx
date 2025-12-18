'use client'
import {use, useEffect, useState} from "react";
import api from "@/utils/fetchWrapper";

interface Project {
    id: string;
    title: string;
}

export default function UpdateProject({params}: { params: Promise<{ id: string }> }) {
    const [projectData, setProjectData] = useState<Project | null>(null);
    const {id} = use(params);

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const data = await api.get(`/projects/${id}`);
                console.log(data)
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
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <p className="text-red-800 font-semibold mb-2">Error</p>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        )
    }

    if (!projectData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                    <p className="text-slate-600">No project found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-slate-800 mb-1">Project</h2>
                    <p className="text-slate-500 text-sm">ID: {id}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                    <p className="text-lg text-slate-700">{projectData.title}</p>
                </div>
            </div>
        </div>
    )
}
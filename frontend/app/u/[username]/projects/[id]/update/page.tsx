'use client'
import {use, useEffect, useState} from "react";
import api from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";

export default function UpdateProject({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);


    const [formData, setFormData] = useState({
        title: ''
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const data = await api.get(`/projects/${id}`);
                console.log(data)
                setFormData({
                    ...formData,
                    title: data.title,
                })
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

    const router = useRouter()

    const updateProject = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const response = await api.patch(`/projects/${id}`, formData)
            console.log(response)
            router.push('/u/lakhbawa/projects/');
            // TODO: Show success message or redirect
        } catch (err) {
            console.error('Update failed:', err)
        }
    }

        if (loading) return <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">Loading...</div>
    </div>

    if (error) return <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        Error: {error}
    </div>

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Update Project
                <span className="text-sm font-normal text-gray-500 ml-2">ID: {id}</span>
            </h2>

            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <form onSubmit={updateProject} className="space-y-4">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Project Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter project title"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2
                                     focus:ring-blue-500 focus:border-blue-500 outline-none
                                     transition-colors duration-200"
                            value={formData.title}
                            onChange={(e) => setFormData({title: e.target.value})}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium
                                     rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2
                                     focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Update Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

}
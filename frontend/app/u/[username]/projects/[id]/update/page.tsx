'use client'
import {use, useEffect, useState} from "react";
import api from "@/utils/fetchWrapper";

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
                setFormData(data)
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

    const updateProject = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const response = await api.patch(`/projects/${id}`, formData)
            console.log(response)
            // TODO: Show success message or redirect
        } catch (err) {
            console.error('Update failed:', err)
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-500">Error: {error}</div>

    return (
        <>
            <h2>Update Project (ID: {id})</h2>
            <div className="bg-gray-500 p-5">
                <form onSubmit={updateProject}>
                    <label htmlFor="title">
                        Project Title
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            required
                            className="border-2 ml-2 px-2"
                            value={formData.title}
                            onChange={(e) => setFormData({title: e.target.value})}
                        />
                    </label>
                    <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-1">
                        Update
                    </button>
                </form>
            </div>
        </>
    )
}
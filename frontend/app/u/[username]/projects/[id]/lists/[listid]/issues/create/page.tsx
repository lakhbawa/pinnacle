'use client'
import {use, useEffect, useState} from "react";
import fetchWrapper, {api} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";
import {list} from "postcss";
import {Project} from "@/app/types/projectTypes";

export default function CreateIssue({params}: { params: Promise<{ id: string, listid: string }> }) {
    const router = useRouter();
    const {id, listid} = use(params);

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState(
        {
            title: '',
            listId: listid
        }
    )
    const [project, setProject] = useState<Project>()
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const data = await api.get(`/projects/${id}`);
                setProject(data)
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


    const onFieldChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }


    const createIssue = function (event: any) {
        event.preventDefault()
        const res = fetchWrapper.post('/issues', formData)
        if (res) {
            router.push('/u/lakhbawa/projects/' + id);
            console.log("issue created successfully")
            console.log(res)
        } else {
            console.error("error creating list")
        }
    }
        if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Project: {project && project.title}
                </h2>
                <h3 className="text-xl text-gray-600">Create New Issue</h3>
            </div>

            <form onSubmit={createIssue} className="space-y-4">
                <input type="hidden" name="list_id" value={id}/>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        name="title"
                        onChange={onFieldChange}
                        placeholder="Enter issue title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Issue
                </button>
            </form>
        </div>
    )

}
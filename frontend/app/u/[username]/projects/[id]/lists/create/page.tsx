'use client'
import {use, useEffect, useState} from "react";
import fetchWrapper, {api} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";

export default function CreateList({params}: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const {id} = use(params);

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState(
        {
            title: '',
            project_id: id
        }
    )
    const [project, setProject] = useState()
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


    const createList = function (event: any) {
        event.preventDefault()
        const res = fetchWrapper.post('/lists', formData)
        if (res) {
            router.push('/u/lakhbawa/projects/' + id + '/lists');
            console.log("list created successfully")
            console.log(res)
        } else {
            console.error("error creating list")
        }
    }
    if (loading) {
        return (
            <>
                loading...
            </>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Project: {project && (
                    <span className="text-blue-600">{project.title}</span>
                )}
                </h2>
                <h3 className="text-xl font-semibold text-gray-700">Create New List</h3>
            </div>

            <form onSubmit={createList} className="space-y-4">
                <input type="hidden" name="project_id" value={id}/>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        List Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={onFieldChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Enter list title"
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Create List
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}
        </div>
    )

}
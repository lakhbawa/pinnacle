'use client'
import {use, useEffect, useState} from "react";
import fetchWrapper, {api} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";

export default function CreateList({params}: { params: Promise<{ id: string, listid: string }> }) {
    const router = useRouter();
    const {id, listid} = use(params);

    console.log(listid);

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState(
        {
            title: '',
            project_id: id
        }
    )
    const [project, setProject] = useState()
    const [list, setList] = useState()
    useEffect(() => {
        async function fetchProjectData() {
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

        async function fetchListData() {
            try {
                setLoading(true)
                const data = await api.get(`/lists/${listid}`);
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
            fetchProjectData()
        }
        if (listid) {
            fetchListData()
        }
    }, [id])


    const onFieldChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }


    const updateList = function (event: any) {
        event.preventDefault()
        const res = fetchWrapper.patch('/lists/' + listid, formData)
        if (res) {
            router.push('/u/lakhbawa/projects/' + id + '/lists');
            console.log("list updated successfully")
            console.log(res)
        } else {
            console.error("error updating list")
        }
    }
        if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Project: <span className="text-blue-600">{project && project.title}</span>
                </h2>
                <h3 className="text-xl font-semibold text-gray-700 mt-2">Edit List</h3>
            </div>

            <form onSubmit={updateList} className="space-y-6">
                <input type="hidden" name="project_id" value={id}/>

                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        List Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={onFieldChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter list title"
                        required
                    />
                </div>

                {error && (
                    <div className="text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Update List
                    </button>
                </div>
            </form>
        </div>
    )

}
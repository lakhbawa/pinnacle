'use client'
import {use, useEffect, useState} from "react";
import fetchWrapper, {api} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";

export default function UpdateIssue({params}: { params: Promise<{ id: string, listid: string, issueid: string }> }) {
    const router = useRouter();
    const {id, listid, issueid} = use(params);

    console.log(issueid);

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState(
        {
            title: '',
            listId: listid,
        }
    )
    const [project, setProject] = useState()
    const [list, setList] = useState()
    useEffect(() => {

        async function fetchIssueData() {
            try {
                setLoading(true)
                const data = await api.get(`/issues/${issueid}`);
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

        if (issueid) {
            fetchIssueData()
        }

    }, [issueid])


    const onFieldChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }


    const updateIssue = function (event: any) {
        event.preventDefault()
        const res = fetchWrapper.patch('/issues/' + issueid, formData)
        if (res) {
            router.push('/u/lakhbawa/projects/' + id + '/lists/' + listid + '/issues');
            console.log("issue updated successfully")
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

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-500 rounded-lg">
                {error}
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
                {project?.title && (
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Project: {project.title}
                    </h2>
                )}
                <h1 className="text-xl font-semibold text-gray-700">
                    Update Issue
                </h1>
            </div>

            <form onSubmit={updateIssue} className="space-y-6">
                <input type="hidden" name="listId" value={listid}/>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Issue Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={onFieldChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter issue title"
                        required
                    />
                </div>

                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Update Issue
                    </button>
                </div>
            </form>
        </div>
    )

}
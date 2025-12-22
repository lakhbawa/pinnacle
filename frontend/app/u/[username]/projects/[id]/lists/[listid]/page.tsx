'use client'
import {use, useEffect, useState} from "react";
import fetchWrapper, {api} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";

interface Project {
    id: string,
    title: string,
}
interface List {
    id: string,
    title: string,
    project: Project,
}
export default function ShowList({params}: { params: Promise<{ id: string, listid: string }> }) {
    const router = useRouter();
    const {id, listid} = use(params);

    console.log(listid);

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    const [list, setList] = useState<List>()
    useEffect(() => {


        async function fetchListData() {
            try {
                setLoading(true)
                const data = await api.get(`/lists/${listid}?include=project`);
                setList(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load project')
            } finally {
                setLoading(false)
            }
        }
        if (listid) {
            fetchListData()
        }
    }, [listid])

    console.log(list)
    if (loading || !list) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading list details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="border-b pb-4 mb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {list.title}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        From project: {list.project.title}
                    </p>
                </div>

                <div className="space-y-4">
                    {/* You can add more list details here */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                        >
                            ← Back to project
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}
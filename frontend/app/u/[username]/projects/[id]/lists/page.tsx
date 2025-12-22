'use client'
import Link from "next/link";
import {use, useEffect, useState} from "react";
import api from "@/utils/fetchWrapper";

interface Project {
    id: string;
    title: string;
}
interface List {
    id: string;
    title: string;
    project: Project;
}

export default function Lists({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const projectId: string = id
    console.log("Project Id", projectId)
    const [lists, setLists] = useState<List[]>([]);
    const [loading, setLoading] = useState(true);

    const username = 'lakhbawa'

    useEffect(() => {
        api.get<List[]>('/lists/?include=project&project_id=' + projectId)
            .then((data) => {
                setLists(data);
            })
            .catch((error) => {
                console.error('Failed to fetch lists:', error);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [])

    const deleteList = (listId: string) => async () => {
        const confirmed = confirm("Are you sure you want to delete this list?")
        if (confirmed) {
            try {
                await api.delete(`/lists/${listId}`)
                // ✅ Remove deleted project from state
                setLists(lists.filter(l => l.id !== id))
                console.log('List deleted successfully')
            } catch (error) {
                console.error('Failed to delete list:', error)
                alert('Failed to delete list')
            }
        }
    }

    if (loading) return <div className="p-4">Loading lists...</div>

    return (
        <>
            <h1 className="p-4 font-bold">Lists</h1>
            {lists.length === 0 ? (
                <div className="p-4 text-gray-500">No lists yet. Create your first one!</div>
            ) : (
                lists.map((list) => (
                    <div className="p-3 bg-gray-100 border-2 border-gray-300 flex flex-row items-center justify-between"
                         key={list.id}>
                        <div>
                            <Link href={`/u/${username}/lists/${list.id}`} >
                            {list.title}

                            </Link>
                        </div>
                        <div className="actions flex gap-3">
                            <Link href={`/u/${username}/projects/${list.projectId}/lists/${list.id}/update`}
                                  className="font-medium bg-blue-500 p-3 shadow-2xl text-white rounded">
                                Update
                            </Link>
                            {/* ✅ Pass function reference, not function call */}
                            <button
                                onClick={deleteList(list.id)}
                                className="font-medium bg-red-500 p-3 shadow-2xl text-white rounded cursor-pointer hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
            <Link href={`/u/${username}/projects/` + projectId + '/lists/create'}
                  className="font-medium bg-blue-500 p-3 my-3 inline-block shadow-2xl text-white rounded">
                Create List
            </Link>
        </>
    )
}
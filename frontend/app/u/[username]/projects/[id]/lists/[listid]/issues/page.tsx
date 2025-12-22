'use client'
import Link from "next/link";
import {use, useEffect, useState} from "react";
import api from "@/utils/fetchWrapper";

interface List {
    id: string;
    title: string;
}
interface Issue {
    id: string;
    title: string;
    list: List;
}

export default function Issues({params}: { params: Promise<{ id: string, listid: string }> }) {
    const {id, listid} = use(params);
    const projectId = id
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    const username = 'lakhbawa'

    useEffect(() => {
        api.get<Issue[]>('/issues/?include=list&list_id=' + listid)
            .then((data) => {
                setIssues(data);
            })
            .catch((error) => {
                console.error('Failed to fetch issues:', error);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [])

    const deleteIssue = (issueid: string) => async () => {
        const confirmed = confirm("Are you sure you want to delete this list?")
        if (confirmed) {
            try {
                await api.delete(`/issues/${issueid}`)
                // ✅ Remove deleted project from state
                setIssues(issues.filter(l => l.id !== issueid))
                console.log('Issue deleted successfully')
            } catch (error) {
                console.error('Failed to delete list:', error)
                alert('Failed to delete list')
            }
        }
    }

    if (loading) return <div className="p-4">Loading issues...</div>

    return (
        <>
            <h1 className="p-4 font-bold">Issues</h1>
            {issues.length === 0 ? (
                <div className="p-4 text-gray-500">No issues yet. Create your first one!</div>
            ) : (
                issues.map((issue) => (
                    <div className="p-3 bg-gray-100 border-2 border-gray-300 flex flex-row items-center justify-between"
                         key={issue.id}>
                        <div>
                            <Link href={`/u/${username}/issues/${issue.id}`} >
                            {issue.title}

                            </Link>
                        </div>
                        <div className="actions flex gap-3">
                            <Link href={`/u/${username}/projects/${projectId}/lists/${listid}/issues/${issue.id}/update`}
                                  className="font-medium bg-blue-500 p-3 shadow-2xl text-white rounded">
                                Update
                            </Link>
                            {/* ✅ Pass function reference, not function call */}
                            <button
                                onClick={deleteIssue(issue.id)}
                                className="font-medium bg-red-500 p-3 shadow-2xl text-white rounded cursor-pointer hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
            <Link href={`/u/${username}/projects/${projectId}/lists/${listid}/issues/create`}
                  className="font-medium bg-blue-500 p-3 my-3 inline-block shadow-2xl text-white rounded">
                Create Issue
            </Link>
        </>
    )
}
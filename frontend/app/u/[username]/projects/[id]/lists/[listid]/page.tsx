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
            <>
                loading...
            </>
        )
    }

    return (
        <>
            <h2>

            </h2>
            List Details
            Title: { list.title}
            Project: { list.project.title}
        </>
    )
}
'use client'
import {use, useEffect, useState} from "react";
import fetchWrapper, {api} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";
import {list} from "postcss";

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


    const createIssue = function (event: any) {
        event.preventDefault()
        const res = fetchWrapper.post('/issues', formData)
        if (res) {
            router.push('/u/lakhbawa/projects/' + id + '/lists/' + listid);
            console.log("issue created successfully")
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
        <>
            <h2>
                Project Title: {project && project.title}

            </h2>
            Create issue
            <form onSubmit={createIssue}>
                <input type="hidden" name="list_id" value={id}/>
                <input type="text" value={formData.title} name="title" onChange={onFieldChange}/>
                <button type="submit">Create</button>
            </form>
        </>
    )
}
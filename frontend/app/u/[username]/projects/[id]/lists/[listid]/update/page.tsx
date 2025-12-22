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
            Create list
            <form onSubmit={updateList}>
                <input type="hidden" name="project_id" value={id}/>
                <input type="text" value={formData.title} name="title" onChange={onFieldChange}/>
                <button type="submit">Update</button>
            </form>
        </>
    )
}
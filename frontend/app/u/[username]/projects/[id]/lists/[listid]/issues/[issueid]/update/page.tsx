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
            Update Issue
            <form onSubmit={updateIssue}>
                <input type="hidden" name="listId" value={listid}/>
                <input type="text" value={formData.title} name="title" onChange={onFieldChange}/>
                <button type="submit">Update</button>
            </form>
        </>
    )
}
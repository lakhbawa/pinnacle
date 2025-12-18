'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/utils/fetchWrapper";

interface Project {
    id: string;
    title: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const username = 'lakhbawa'

    useEffect(() => {
        api.get<Project[]>('/projects')
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => {
                console.error('Failed to fetch projects:', error);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [])

    const deleteProject = (id: string) => async () => {
        const confirmed = confirm("Are you sure you want to delete this project?")
        if (confirmed) {
            try {
                await api.delete(`/projects/${id}`)
                // ✅ Remove deleted project from state
                setProjects(projects.filter(p => p.id !== id))
                console.log('Project deleted successfully')
            } catch (error) {
                console.error('Failed to delete project:', error)
                alert('Failed to delete project')
            }
        }
    }

    if (loading) return <div className="p-4">Loading projects...</div>

    return (
        <>
            <h1 className="p-4 font-bold">Projects</h1>
            {projects.length === 0 ? (
                <div className="p-4 text-gray-500">No projects yet. Create your first one!</div>
            ) : (
                projects.map((project) => (
                    <div className="p-3 bg-gray-100 border-2 border-gray-300 flex flex-row items-center justify-between"
                         key={project.id}>
                        <div>
                            <Link href={`/u/${username}/projects/${project.id}`} >
                            {project.title}

                            </Link>
                        </div>
                        <div className="actions flex gap-3">
                            <Link href={`/u/${username}/projects/${project.id}/update`}
                                  className="font-medium bg-blue-500 p-3 shadow-2xl text-white rounded">
                                Update
                            </Link>
                            {/* ✅ Pass function reference, not function call */}
                            <button
                                onClick={deleteProject(project.id)}
                                className="font-medium bg-red-500 p-3 shadow-2xl text-white rounded cursor-pointer hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
            <Link href={`/u/${username}/projects/create`}
                  className="font-medium bg-blue-500 p-3 my-3 inline-block shadow-2xl text-white rounded">
                Create Project
            </Link>
        </>
    )
}
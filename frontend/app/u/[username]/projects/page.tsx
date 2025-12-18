'use client'
import Link from "next/link";
import {useEffect, useState} from "react";
import api from "@/utils/fetchWrapper";

export default function Projects(props: {}) {
    const [projects, setProjects] = useState([]);

    const username = 'lakhbawa'

    useEffect(() => {
        api.get('http://localhost:4000/api/projects').then((data) => {
            setProjects(data);
        })
    }, [])

    return (
        <>
            <h1 className="p-4 font-bold">Projects</h1>
            {projects.map((board) => (
                <div className="p-3 bg-gray-100 border-2 border-gray-300 flex flex-row items-center justify-between"
                     key={board.id}>
                    <div>{board.title}</div>
                    <div className="actions">
                        <Link href={`/u/${username}/projects/` + board.id + "/update"}
                              className="font-medium bg-blue-500 p-3 mx-3 shadow-2xl text-white">Update</Link>
                        <Link href={`/u/${username}/projects/` + board.id + "/delete"}
                              className="font-medium bg-red-500 p-3 my-3 shadow-2xl text-white">Delete</Link>
                    </div>
                </div>

            ))}
            <Link href={"/u/" + username + "/projects/create"}
                  className="font-medium bg-blue-500 p-3 my-3 inline-block shadow-2xl text-white">Create Board</Link>
        </>
    )
}
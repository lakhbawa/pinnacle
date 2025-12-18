'use client'
import {useState} from "react";
import api from "@/utils/fetchWrapper";

export default function CreateProject() {
    const [formData, setFormData] = useState({
        title: ''
    })

    const createProject = async(event: any) => {
        event.preventDefault()
        const response = await api.post('http://localhost:4000/api/projects', formData)
        console.log(response)
    }

    return (
        <>
            Create Board
            <div className="bg-gray-500 p-5">
                <form onSubmit={createProject} method="POST">
                    <label htmlFor="title">Board Title
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            required
                            className="border-2"
                            value={formData.title}
                            onChange={(e) => setFormData({ title: e.target.value })}
                        />
                    </label>
                    <button type="submit">Create</button>
                </form>
            </div>
        </>
    )
}
'use client'
import {useState} from "react";

export default function CreateBoard() {
    const [formData, setFormData] = useState({
        title: ''
    })

    const createBoard = async(event: any) => {
        event.preventDefault()
        const response = await fetch('http://localhost:4000/api/boards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData) // Remove the wrapping object
        })
        const data = await response.json()
        console.log(data)
    }

    return (
        <>
            Create Board
            <div className="bg-gray-500 p-5">
                <form onSubmit={createBoard} method="POST">
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
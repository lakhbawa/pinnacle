'use client'
import Link from "next/link";
import {useEffect, useState} from "react";

export default function Boards(props: {}) {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/boards', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json()).then((data) => {
            setBoards(data);
        })
    }, [])

    return (
        <>
            <h1>Boards</h1>
            {boards.map((board) => (
                <div key={board.uuid}>{board.title}</div>
            ))}
             <Link href="/u/lakhbawa/boards/create">Create Board</Link>
        </>
    )
}
import Link from "next/link";

export default function Boards(props: {}) {

    return (
        <>
            <h1>Boards</h1>
             <Link href="/u/lakhbawa/boards/create">Create Board</Link>
        </>
    )
}
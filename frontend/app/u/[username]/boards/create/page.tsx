export default function CreateBoard() {
    return (
        <>
            Create Board
            <div className="bg-gray-500 p-5">
                <form action="/" method="POST">
                    <label htmlFor="title">Board Title

                        <input type="text" name="title" placeholder="Title" required className="border-2"/>
                    </label>
                </form>
            </div>

        </>
    )
}
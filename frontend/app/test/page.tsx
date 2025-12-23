export default function TestPage() {
    const lists = ['List 1', 'List 2', 'List 3', 'List 4', 'List 5', 'List 6', 'List 7'];
    const tasks = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
    return (
        <>
            <h2 className="font-semibold text-3xl p-3 bg-gray-400 mb-3">Board Name</h2>

            <section
                className=" h-screen grid gap-4 overflow-x-auto scroll-smooth"
                style={{ 'gridTemplateColumns': `repeat(${lists.length}, 180px)` }}
            >
                {lists.map((list, index) => (
                    <div key={index}>
                        <section className="h-20 flex justify-center items-center bg-primary-500 mb-2">
                            {list}
                        </section>
                        <section className="tasks flex flex-col gap-2">
                            {tasks.map((task, taskIndex) => (
                                <div className="bg-gray-300 p-5 flex items-center justify-center" key={taskIndex}>
                                    {task}
                                </div>
                            ))}
                        </section>
                    </div>
                ))}
            </section>
        </>
    )
}
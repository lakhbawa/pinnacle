import {Issue} from "@/app/types/projectTypes";
import Link from "next/link";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export default function IssueComponent({id, issue, username, projectId}: {
    id: string;
    issue: Issue,
    projectId: string,
    username: string
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: issue.id})

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
        >
            <div className="flex flex-col items-start justify-between">
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-slate-700 font-medium">
                        {issue.title}
                    </h3>
                    <Link
                        href={`/u/${username}/projects/${projectId}/lists/${issue.listId}/issues/${issue.id}/update`}
                        className="font-medium bg-blue-500 p-3 shadow-2xl text-white rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24"
                             strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                        </svg>
                    </Link>
                </div>

                <div className="mt-2 flex items-center gap-2">
                                                    <span
                                                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs capitalize">
                                                        {issue.issueType}
                                                    </span>
                    {issue.dueDate && (
                        <span className="text-xs text-slate-500">
                                                            Due: {new Date(issue.dueDate).toLocaleDateString()}
                                                        </span>
                    )}


                </div>
            </div>
        </div>
    )
}
import {List} from "@/app/types/projectTypes";
import IssueComponent from "@/app/components/projectView/Issue";
import {SortableContext, verticalListSortingStrategy, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useDroppable} from "@dnd-kit/core";
import Link from "next/link";

export function ListComponent({list, username, projectId}: { list: List, username: string, projectId: string }) {
    const {setNodeRef: setDroppableRef} = useDroppable({
        id: list.id
    });

    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: list.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const setRefs = (node: HTMLDivElement | null) => {
        setDroppableRef(node);
        setSortableRef(node);
    };

    return (
        <div
            ref={setRefs}
            style={style}
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
        >
            <div className="flex items-stretch justify-between pb-3" {...attributes} {...listeners}>
                <h2 className="text-xl font-semibold text-slate-700 mb-4">
                    {list.title}
                </h2>
                <Link
                    href={`/u/${username}/projects/${projectId}/lists/${list.id}/update`}
                    className="font-medium bg-blue-500 p-3 shadow-2xl text-white rounded"
                    onClick={(e) => e.stopPropagation()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                    </svg>
                </Link>
            </div>

            <div className="space-y-3">
                <SortableContext items={list.issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    {list.issues.map((issue) => (
                        <IssueComponent
                            issue={issue}
                            projectId={projectId}
                            username={username}
                            key={issue.id}
                            id={issue.id}
                        />
                    ))}
                </SortableContext>
            </div>

            <Link href={`/u/${username}/projects/${projectId}/lists/${list.id}/issues/create`}>
                <button
                    className="mt-4 w-full py-2 px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                    + Add Issue
                </button>
            </Link>
        </div>
    );
}
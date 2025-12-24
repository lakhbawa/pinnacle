import {List} from "@/app/types/projectTypes";
import IssueComponent from "@/app/components/projectView/Issue";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";

export function ListComponent({list, username, projectId}: { list: List, username: string, projectId: string }) {

    const {setNodeRef} = useDroppable({
            id: list.id

        }
    )
    console.log(list)
    return (
        <div className="space-y-3" ref={setNodeRef} id={list.id}>
            <SortableContext items={list.issues} strategy={verticalListSortingStrategy}>
                {list.issues.map((issue) => (
                    <IssueComponent issue={issue} projectId={projectId} username={username}
                                    key={issue.id} id={issue.id}/>
                ))}
            </SortableContext>
        </div>
    )
}
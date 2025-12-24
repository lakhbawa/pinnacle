'use client'
import {Issue, Project} from "@/app/types/projectTypes";
import Link from "next/link";
import {ListComponent} from "@/app/components/projectView/List";
import {
    closestCorners,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core";
import {arrayMove, sortableKeyboardCoordinates, SortableContext, horizontalListSortingStrategy} from "@dnd-kit/sortable";
import {useState} from "react";

export default function ProjectLists({projectData, projectId, username}: {
    projectData: Project,
    projectId: string,
    username: string
}) {
    const [project, setProject] = useState<Project>(projectData);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setProject((prevProject) => {
            const findIssueInProject = (issueId: string, projectToSearch: Project) => {
                for (let i = 0; i < projectToSearch.lists.length; i++) {
                    for (let j = 0; j < projectToSearch.lists[i].issues.length; j++) {
                        if (projectToSearch.lists[i].issues[j].id === issueId) {
                            return {
                                listIndex: i,
                                issueIndex: j,
                                issue: projectToSearch.lists[i].issues[j]
                            };
                        }
                    }
                }
                return undefined;
            };

            const findListIndex = (listId: string, projectToSearch: Project) => {
                return projectToSearch.lists.findIndex(list => list.id === listId);
            };

            const activeListIndex = findListIndex(active.id as string, prevProject);
            const overListIndex = findListIndex(over.id as string, prevProject);

            if (activeListIndex !== -1 && overListIndex !== -1) {
                // We're sorting lists
                const newLists = arrayMove(prevProject.lists, activeListIndex, overListIndex);
                return {
                    ...prevProject,
                    lists: newLists
                };
            }

            const activeIssue = findIssueInProject(active.id as string, prevProject);
            if (!activeIssue) return prevProject;

            let overIssue = findIssueInProject(over.id as string, prevProject);
            let targetListIndex = -1;
            let targetPosition = 0;

            if (overIssue) {
                targetListIndex = overIssue.listIndex;
                targetPosition = overIssue.issueIndex;
            } else {
                targetListIndex = findListIndex(over.id as string, prevProject);
                targetPosition = 0;

                if (targetListIndex === -1) return prevProject;
            }

            const newProject = {
                ...prevProject,
                lists: prevProject.lists.map(list => ({
                    ...list,
                    issues: [...list.issues]
                }))
            };

            if (activeIssue.listIndex !== targetListIndex) {
                const [movedIssue] = newProject.lists[activeIssue.listIndex].issues.splice(activeIssue.issueIndex, 1);
                movedIssue.listId = newProject.lists[targetListIndex].id;
                newProject.lists[targetListIndex].issues.splice(targetPosition, 0, movedIssue);
            } else {
                const updatedIssues = arrayMove(
                    newProject.lists[activeIssue.listIndex].issues,
                    activeIssue.issueIndex,
                    targetPosition
                );
                newProject.lists[activeIssue.listIndex].issues = updatedIssues;
            }

            return newProject;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">{project.title}</h1>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SortableContext
                            items={project.lists.map(list => list.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            {project.lists.map((list) => (
                                <ListComponent
                                    key={list.id}
                                    list={list}
                                    username={username}
                                    projectId={projectId}
                                />
                            ))}
                        </SortableContext>

                        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-6 flex items-center justify-center">
                            <Link href={`/u/${username}/projects/${projectId}/lists/create`}>
                                <button className="text-slate-600 hover:text-slate-800 transition-colors">
                                    + Add New List
                                </button>
                            </Link>
                        </div>
                    </div>
                </DndContext>
            </div>
        </div>
    );
}
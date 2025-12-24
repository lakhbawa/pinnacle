'use client'
import {Issue, Project} from "@/app/types/projectTypes";
import Link from "next/link";
import {ListComponent} from "@/app/components/projectView/List";
import {closestCorners, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, sortableKeyboardCoordinates} from "@dnd-kit/sortable";
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
    function findIssue(issueId: string) {
        for (let i = 0; i < project.lists.length; i++) {
            for (let j= 0; j < project.lists[i].issues.length; j++) {
                if (project.lists[i].issues[j].id === issueId) {
                    return { listIndex: i, issueIndex: j, issue: project.lists[i].issues[j]};
                }
            }
        }
        return null
    }

    const findListIndex = (listId: string, projectToSearch: Project) => {
            return projectToSearch.lists.findIndex(list => list.id === listId);
        };

    const handleDragEnd = (event: any) => {
        const { active, over} = event;

        if(active.id === over.id) return;

        const activeIssue: {listIndex: number, issueIndex: number, issue: Issue} | null = findIssue(active.id);

        if (!activeIssue) return project;

        const overIssue: {listIndex: number, issueIndex: number, issue: Issue} | null = findIssue(over.id);
        let targetListIndex = -1;
        let targetPosition = 0;
        if (overIssue) {
            targetListIndex = overIssue.listIndex;
            targetPosition = overIssue.issueIndex;
        } else {
            targetListIndex = findListIndex(over.id, project);
            targetPosition = 0;

            if (targetListIndex === -1) return project;
        }

       setProject((prevProject) => {
        // Create a deep copy of the project
        const newProject = {
            ...prevProject,
            lists: prevProject.lists.map(list => ({
                ...list,
                issues: [...list.issues]
            }))
        };

        if (activeIssue.listIndex !== targetListIndex) {
            // Moving between different lists
            const [movedIssue] = newProject.lists[activeIssue.listIndex].issues.splice(activeIssue.issueIndex, 1);
            movedIssue.listId = newProject.lists[targetListIndex].id;
            newProject.lists[targetListIndex].issues.splice(targetPosition, 0, movedIssue);
        } else {
            // Moving within the same list
            const updatedIssues = arrayMove(
                newProject.lists[activeIssue.listIndex].issues,
                activeIssue.issueIndex,
                targetPosition,
            );
            newProject.lists[activeIssue.listIndex].issues = updatedIssues;
        }

        return newProject;
    });
        // console.log("Active", active.id);
        // console.log("Over", over);

    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">{project.title}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
                    {project.lists.map((list, index) => (
                        <div
                            key={list.id}
                            className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
                        >
                            <div className="flex items-stretch justify-between pb-3">
                                <h2 className="text-xl font-semibold text-slate-700 mb-4">
                                    {list.title}
                                </h2>
                                <Link href={`/u/${username}/projects/${projectId}/lists/${list.id}/update`}
                                      className="font-medium bg-blue-500 p-3 shadow-2xl text-white rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                    </svg>
                                </Link>
                            </div>



                            <ListComponent list={project.lists[index]} username={username} projectId={projectId} key={list.id}/>
                            <Link href={`/u/${username}/projects/${projectId}/lists/${list.id}/issues/create`}>
                                <button
                                    className="mt-4 w-full py-2 px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                    + Add Issue
                                </button>
                            </Link>
                        </div>
                    ))}
                    </DndContext>

                    <div
                        className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-6 flex items-center justify-center">
                        <Link href={`/u/${username}/projects/${projectId}/lists/create`}>
                            <button className="text-slate-600 hover:text-slate-800 transition-colors">
                                + Add New List
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
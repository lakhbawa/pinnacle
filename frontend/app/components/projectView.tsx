'use client'
import {Project} from "@/app/types/projectTypes";
import Link from "next/link";


export default function ProjectLists({projectData, projectId, username}: {
    projectData: Project,
    projectId: string,
    username: string
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">{projectData.title}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectData.lists.map((list) => (
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


                            <div className="space-y-3">
                                {list.issues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                                    >
                                        <div className="flex flex-col items-start justify-between">
                                                <div className="flex justify-between items-center w-full">
                                                    <h3 className="text-slate-700 font-medium">
                                                        {issue.title}
                                                    </h3>
                                                    <Link
                                                        href={`/u/${username}/projects/${projectId}/lists/${list.id}/issues/${issue.id}/update`}
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
                                ))}
                            </div>

                            <Link href={`/u/${username}/projects/${projectId}/lists/${list.id}/issues/create`}>
                                <button
                                    className="mt-4 w-full py-2 px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                    + Add Issue
                                </button>
                            </Link>
                        </div>
                    ))}

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
'use client'
import {useState} from "react";
import api from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";

export default function CreateProject() {
    const [formData, setFormData] = useState({
        title: ''
    })
    const router = useRouter();

    const createProject = async (event: any) => {
        event.preventDefault()
        const response = await api.post('http://localhost:4000/api/projects', formData)
        if (response) {
            router.push('/u/lakhbawa/projects');
        } else {
            console.log(response)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Create New Project</h1>
                    <p className="text-slate-600">Set up a new project board to organize your work</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                    <form onSubmit={createProject} className="space-y-6">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-semibold text-slate-700 mb-2"
                            >
                                Project Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="e.g., Website Redesign, Marketing Campaign"
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg
                                     focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                                     outline-none transition-all duration-200
                                     placeholder:text-slate-400"
                                value={formData.title}
                                onChange={(e) => setFormData({title: e.target.value})}
                            />
                            <p className="mt-2 text-sm text-slate-500">
                                Choose a descriptive name for your board
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                                     py-3 px-6 rounded-lg transition-colors duration-200
                                     shadow-md hover:shadow-lg active:scale-[0.98]
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Project
                            </button>
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-3 border-2 border-slate-300 text-slate-700
                                     font-semibold rounded-lg hover:bg-slate-50
                                     transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 flex items-start gap-3 text-sm text-slate-600 bg-blue-50
                          border border-blue-200 rounded-lg p-4">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"/>
                    </svg>
                    <div>
                        <p className="font-semibold text-blue-900 mb-1">Pro tip</p>
                        <p>You can add tasks, set deadlines, and invite team members after creating your board.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
'use client'
import {useState} from "react";
import api from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";

export default function CreateOutcome() {
    const [formData, setFormData] = useState({
        title: ''
    })
    const router = useRouter();

    const createOutcome = async (event: any) => {
        event.preventDefault()
        const response = await api.post('/outcomes', formData)
        if (response) {
            router.push('/u/lakhbawa/outcomes');
        } else {
            console.log(response)
        }
    }

    return (

        <form onSubmit={createOutcome} className="space-y-6">
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                >
                    Outcome Title
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
                    Choose a descriptive name for your outcome
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
                    Create Outcome
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
    )
}
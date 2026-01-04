'use client'
import {use, useEffect, useState} from "react";
import {outcomeAPI} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";
import FormErrors from "@/app/components/FormErrors";

export default function UpdateOutcome({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);


    const userId = 'user-123'
    const [formData, setFormData] = useState({
        title: '',
        why_it_matters: '',           // Changed
        success_metric_unit: '',      // Changed
        success_metric_value: 0,      // Changed
        deadline: '',
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const handleChange = (event: any) => {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    function toDateTimeLocal(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16); // "2026-01-21T13:31"
}

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const data = await outcomeAPI.get(`/outcomes/${id}`);
                const outcomeData = data.data
                console.log(outcomeData)
                setFormData({
                    ...formData,
                    title: outcomeData.title,
                    why_it_matters: outcomeData.why_it_matters,
                    success_metric_unit: outcomeData.success_metric_unit,
                    success_metric_value: outcomeData.success_metric_value,
                    deadline: toDateTimeLocal(outcomeData.deadline),
                })

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load project')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchData()
        }
    }, [id])

    const router = useRouter()

    const updateOutcome = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const response = await outcomeAPI.patch(`/outcomes/${id}`, {
      ...formData,
      deadline: new Date(formData.deadline)
    })
            console.log(response)
            router.push('/u/lakhbawa/outcomes/');
            // TODO: Show success message or redirect
        } catch (err) {
            console.error('Update failed:', err)
        }
    }

        if (loading) return <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">Loading...</div>
    </div>

    if (error) return <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        Error: {error}
    </div>

    return (
        <>

            <FormErrors errors={errors}/>
            <form onSubmit={updateOutcome} className="space-y-6">

                <input type="hidden" name="userId" value={userId}/>

                <div>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Outcome Title"
                        required
                        className="border-2 border-gray-300 rounded-lg"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                <textarea className="border-2 border-gray-300 rounded-lg" name="why_it_matters" id="why_it_matters"
                          placeholder="Why It matters" cols="30" rows="10" value={formData.why_it_matters}
                          onChange={handleChange}></textarea>
                </div>

                <div>

                    <div>
                        <input
                            type="text"
                            id="success_metric_unit"
                            name="success_metric_unit"
                            placeholder="Success Metric Unit"
                            required
                            className="border-2 border-gray-300 rounded-lg"
                            value={formData.success_metric_unit}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <input
                            type="number"
                            id="success_metric_value"
                            name="success_metric_value"
                            placeholder="Success Metric Value"
                            required
                            className="border-2 border-gray-300 rounded-lg"
                            value={formData.success_metric_value}
                            onChange={handleChange}
                        />
                    </div>


                    <div>
                        <input
                            type="datetime-local"
                            id="deadline"
                            name="deadline"
                            placeholder="Deadline"
                            required
                            className="border-2 border-gray-300 rounded-lg"
                            value={formData.deadline}
                            onChange={handleChange}

                        />
                    </div>

                    <button
                        type="submit"
                        className="border-2 border-gray-300 rounded-lg bg-black text-white p-3"
                    >
                        Update Outcome
                    </button>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className=""
                    >
                        Cancel
                    </button>
                </div>


            </form>
        </>
    )
}
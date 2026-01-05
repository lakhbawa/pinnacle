'use client'
import {use, useEffect, useState} from "react";
import {outcomeAPI} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";
import FormErrors from "@/app/components/FormErrors";

export default function UpdateOutcome({params}: { params: Promise<{ outcome_id: string, driver_id: string, username:string }> }) {
    const {outcome_id, driver_id, username} = use(params);


    const userId = 'user-123'
    const [formData, setFormData] = useState({
        title: '',
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
                const data = await outcomeAPI.get(`/drivers/${driver_id}`);
                const outcomeData = data.data
                console.log(outcomeData)
                setFormData({
                    ...formData,
                    title: outcomeData.title,
                })

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load project')
            } finally {
                setLoading(false)
            }
        }

        if (driver_id) {
            fetchData()
        }
    }, [driver_id])

    const router = useRouter()

    const updateDriver = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const response = await outcomeAPI.patch(`/drivers/${driver_id}`, {
      ...formData,
    })
            console.log(response)
            router.push(`/u/${username}/outcomes/${outcome_id}/drivers`);
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
            <form onSubmit={updateDriver} className="space-y-6">

                <input type="hidden" name="userId" value={userId}/>

                <div>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Driver Title"
                        required
                        className="border-2 border-gray-300 rounded-lg"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>


                    <button
                        type="submit"
                        className="border-2 border-gray-300 rounded-lg bg-black text-white p-3"
                    >
                        Update Driver
                    </button>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className=""
                    >
                        Cancel
                    </button>


            </form>
        </>
    )
}
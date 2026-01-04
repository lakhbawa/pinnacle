'use client'
import {useState} from "react";
import {outcomeAPI} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";

export default function CreateOutcome() {

    const userId = 'user-123'
    const [formData, setFormData] = useState({
        title: '',
        userId: userId,
        why_it_matters: '',
        success_metric_unit: '',
        success_metric_value: 0,
        deadline: new Date(),
    })

    const handleChange = (event: any) => {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const router = useRouter();

    const createOutcome = async (event: any) => {
        event.preventDefault()

        console.log('Creating Outcome...', formData);

        formData.deadline = new Date(formData.deadline)


        const response = await outcomeAPI.post('/outcomes', formData)
        if (response) {
            console.log(response)
            router.push('/u/lakhbawa/outcomes');
        } else {
            console.log(response)
        }
    }

    return (

        <form onSubmit={createOutcome} className="space-y-6">

            <input type="hidden" name="user_id" value={userId}/>

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
                    Create Outcome
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
    )
}
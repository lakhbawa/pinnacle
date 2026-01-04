'use client'
import {useState} from "react";
import {APIError, outcomeAPI} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";
import FieldError from "@/app/components/FieldError";
import FormErrors from "@/app/components/FormErrors";

interface ApiResponseError {
    message: string;
    code: string;
    errors: Record<string, string> | undefined;
}

interface ApiResponse {
    success: boolean;
    error?: ApiResponseError;
}

export default function CreateOutcome() {

    const userId = 'user-123'
    const [formData, setFormData] = useState({
        title: '',
        userId: userId,
        whyItMatters: '',           // Changed
        successMetricUnit: '',      // Changed
        successMetricValue: 0,      // Changed
        deadline: '',
    })

    const [errors, setErrors] = useState<Record<string, string[]>>({})

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


        const response = await outcomeAPI.post<ApiResponse>
        ('/outcomes', {
            ...formData,
            deadline: new Date(formData.deadline)
        }).then(res => {
            console.log('Creating Outcome...');
            console.log(res)
            router.push('/u/lakhbawa/outcomes');
        }).catch(error => {

            if (error instanceof APIError) {
                const fieldErrors = error.getValidationErrors();
                setErrors(fieldErrors ?? {})  // Use empty object if null
            }
        })
    }

    console.log(errors)

    return (
        <>

            <FormErrors errors={errors}/>
            <form onSubmit={createOutcome} className="space-y-6">

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
                <textarea className="border-2 border-gray-300 rounded-lg" name="whyItMatters" id="whyItMatters"
                          placeholder="Why It matters" cols="30" rows="10" value={formData.whyItMatters}
                          onChange={handleChange}></textarea>
                </div>

                <div>

                    <div>
                        <input
                            type="text"
                            id="success_metric_unit"
                            name="successMetricUnit"
                            placeholder="Success Metric Unit"
                            required
                            className="border-2 border-gray-300 rounded-lg"
                            value={formData.successMetricUnit}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <input
                            type="number"
                            id="success_metric_value"
                            name="successMetricValue"
                            placeholder="Success Metric Value"
                            required
                            className="border-2 border-gray-300 rounded-lg"
                            value={formData.successMetricValue}
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
        </>
    )
}
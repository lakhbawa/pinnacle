'use client'
import { useState } from "react";
import { APIError, outcomeAPI } from "@/utils/fetchWrapper";
import { useRouter } from "next/navigation";
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
  const user_id = 'user-123'
  const [formData, setFormData] = useState({
    title: '',
    user_id: user_id,
    why_it_matters: '',
    success_metric_unit: '',
    success_metric_value: 0,
    deadline: '',
  })

  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const router = useRouter();

  const createOutcome = async (event: any) => {
    event.preventDefault()
    setErrors({})

    console.log('Creating Outcome...', formData);

    await outcomeAPI.post<ApiResponse>('/outcomes', {
      ...formData,
      deadline: new Date(formData.deadline)
    }).then(res => {
      console.log('Creating Outcome...');
      console.log(res)
      router.push('/u/lakhbawa/outcomes');
    }).catch(error => {
      if (error instanceof APIError) {
        const fieldErrors = error.getValidationErrors();
        setErrors(fieldErrors ?? {})
      }
    })
  }

  return (
    <>
      <FormErrors errors={errors} />
      <form onSubmit={createOutcome} className="space-y-6">

        <input type="hidden" name="user_id" value={user_id} />

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
          <FieldError errors={errors} field="title" />
        </div>

        <div>
          <textarea
            className="border-2 border-gray-300 rounded-lg"
            name="why_it_matters"
            id="why_it_matters"
            placeholder="Why It matters"
            cols={30}
            rows={10}
            value={formData.why_it_matters}
            onChange={handleChange}
          />
          <FieldError errors={errors} field="why_it_matters" />
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
            <FieldError errors={errors} field="success_metric_unit" />
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
            <FieldError errors={errors} field="success_metric_value" />
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
            <FieldError errors={errors} field="deadline" />
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
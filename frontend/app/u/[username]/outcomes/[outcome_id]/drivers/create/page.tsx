'use client'
import {use, useState} from "react";
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

export default function CreateDriver({params}: { params: Promise<{ outcome_id: string, username:string }> }) {
  const {outcome_id, username} = use(params);
  const userId = 'sadfasdf';
  const [formData, setFormData] = useState({
    title: '',
    user_id: userId,
    outcome_id: outcome_id,
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

  const createDriver = async (event: any) => {
    event.preventDefault()
    setErrors({})

    console.log('Creating Driver...', formData);

    await outcomeAPI.post<ApiResponse>('/drivers', {
      ...formData,
    }).then(res => {
      console.log('Creating Driver...');
      console.log(res)
      router.push('/u/lakhbawa/outcomes/' + outcome_id);
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
      <form onSubmit={createDriver} className="space-y-6">


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
          <FieldError errors={errors} field="title" />
        </div>

          <button
            type="submit"
            className="border-2 border-gray-300 rounded-lg bg-black text-white p-3"
          >
            Create Driver
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
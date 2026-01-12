'use client'
import { useState } from "react";
import { APIError, outcomeAPI } from "@/utils/fetchWrapper";
import { useRouter } from "next/navigation";
import FieldError from "@/app/components/FieldError";
import FormErrors from "@/app/components/FormErrors";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {showToast} from "nextjs-toast-notify";

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
const { data: session, status } = useSession();
    const isLoggedIn = !!session;
    if (!isLoggedIn) {
        return (
            <>
            You must be logged into your account.
            </>
        )
    }
    let userId: string = '';
    if (isLoggedIn) {
        userId = session?.user?.id;
    }

  const [formData, setFormData] = useState({
    title: '',
    user_id: userId,
    why_it_matters: '',
    success_metric_unit: '',
    success_metric_value: 0,
    deadline: '',
  })

  const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

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
      router.push('/u/outcomes');
      showToast.success(` Outcome: ${formData.title} created successfully.`);
    }).catch(error => {
      if (error instanceof APIError) {
        const fieldErrors = error.getValidationErrors();
        setErrors(fieldErrors ?? {})
        showToast.error("Validation Failed, Please check input and try again.")
      }
    })
  }

    return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Keep existing header section */}

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <FormErrors errors={errors} />

            <form onSubmit={createOutcome} className="space-y-8">
              <input type="hidden" name="user_id" value={userId} />

              {/* Title Field - Improved */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                  What do you want to achieve?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    placeholder="e.g., Acquire 100 paying customers"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900
                             placeholder:text-gray-400 focus:outline-none focus:ring-2
                             focus:ring-primary-500 focus:border-primary-500"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Make it specific and measurable
                </p>
                <FieldError errors={errors} field="title" />
              </div>

              {/* Why It Matters - Improved */}
              <div className="space-y-2">
                <label htmlFor="why_it_matters" className="block text-sm font-medium text-gray-900">
                  Why does this outcome matter?
                </label>
                <div className="relative">
                  <textarea
                    id="why_it_matters"
                    name="why_it_matters"
                    rows={6}
                    placeholder="Explain why achieving this outcome is important..."
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900
                             placeholder:text-gray-400 focus:outline-none focus:ring-2
                             focus:ring-primary-500 focus:border-primary-500 resize-none"
                    value={formData.why_it_matters}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Describe the impact this outcome will have on your business
                </p>
                <FieldError errors={errors} field="why_it_matters" />
              </div>

              {/* Success Metrics - Improved */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Define Success Metrics</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Set clear, measurable targets for your outcome
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="success_metric_value" className="block text-sm font-medium text-gray-900">
                      Target Value
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="success_metric_value"
                        name="success_metric_value"
                        required
                        placeholder="100"
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900
                                 placeholder:text-gray-400 focus:outline-none focus:ring-2
                                 focus:ring-primary-500 focus:border-primary-500"
                        value={formData.success_metric_value}
                        onChange={handleChange}
                      />
                    </div>
                    <FieldError errors={errors} field="success_metric_value" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="success_metric_unit" className="block text-sm font-medium text-gray-900">
                      Unit of Measurement
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="success_metric_unit"
                        name="success_metric_unit"
                        required
                        placeholder="e.g., customers, revenue, users"
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900
                                 placeholder:text-gray-400 focus:outline-none focus:ring-2
                                 focus:ring-primary-500 focus:border-primary-500"
                        value={formData.success_metric_unit}
                        onChange={handleChange}
                      />
                    </div>
                    <FieldError errors={errors} field="success_metric_unit" />
                  </div>
                </div>
              </div>

              {/* Deadline - Improved */}
              <div className="space-y-2">
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-900">
                  When do you want to achieve this by?
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    id="deadline"
                    name="deadline"
                    required
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Set a realistic timeline for achieving your outcome
                </p>
                <FieldError errors={errors} field="deadline" />
              </div>

              {/* Form Actions - Improved */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-3 border border-gray-300
                           shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                           transition-colors duration-150"
                >
                  <svg className="mr-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-3 border border-transparent
                           text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Outcome'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
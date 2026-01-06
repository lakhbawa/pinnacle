
'use client'
import { use, useState } from "react";
import { APIError, outcomeAPI } from "@/utils/fetchWrapper";
import { useRouter } from "next/navigation";
import FieldError from "@/app/components/FieldError";
import FormErrors from "@/app/components/FormErrors";
import Link from "next/link";

interface ApiResponseError {
  message: string;
  code: string;
  errors: Record<string, string> | undefined;
}

interface ApiResponse {
  success: boolean;
  error?: ApiResponseError;
}

export default function CreateAction({ params }: { params: Promise<{ outcome_id: string, driver_id: string, username: string }> }) {
  const { outcome_id, driver_id, username } = use(params);
  const userId = 'sadfasdf';
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_for: '',
    user_id: userId,
    outcome_id: outcome_id,
    driver_id: driver_id,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const createAction = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await outcomeAPI.post<ApiResponse>('/actions', formData);
      router.push(`/u/${username}/outcomes/${outcome_id}/drivers/${driver_id}/actions`);
    } catch (error) {
      if (error instanceof APIError) {
        const fieldErrors = error.getValidationErrors();
        setErrors(fieldErrors ?? {});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between md:space-x-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Create New Action</h1>
            <p className="mt-2 text-sm text-gray-500">
              Add a new action to track your progress
            </p>
          </div>
          <Link
            href={`/u/${username}/outcomes/${outcome_id}/drivers/${driver_id}`}
            className="mt-4 md:mt-0 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Driver
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <FormErrors errors={errors} />

            <form onSubmit={createAction} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                  Action Title
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    placeholder="Enter action title"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 
                             placeholder:text-gray-400 focus:outline-none focus:ring-2 
                             focus:ring-primary-500 focus:border-primary-500"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <FieldError errors={errors} field="title" />
                <p className="text-sm text-gray-500">
                  Give your action a clear, descriptive title
                </p>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                  Description
                </label>
                <div className="relative rounded-md shadow-sm">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe what needs to be done..."
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 
                             placeholder:text-gray-400 focus:outline-none focus:ring-2 
                             focus:ring-primary-500 focus:border-primary-500 resize-none"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Optional: Add more details about this action
                </p>
              </div>

              {/* Schedule Field */}
              <div className="space-y-2">
                <label htmlFor="scheduled_for" className="block text-sm font-medium text-gray-900">
                  Schedule
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="datetime-local"
                    id="scheduled_for"
                    name="scheduled_for"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.scheduled_for}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Optional: Set a schedule for this action
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 
                           space-y-4 space-y-reverse sm:space-y-0 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-3 border 
                           border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 
                           bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-150"
                >
                  <svg className="mr-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-3 border 
                           border-transparent text-sm font-medium rounded-lg text-white 
                           bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" 
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Creating...
                    </>) : (
                    <>
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create Action
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
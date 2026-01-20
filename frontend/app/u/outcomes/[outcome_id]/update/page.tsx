'use client'
import {use, useEffect, useState} from "react";
import {outcomeAPI} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";
import FormErrors from "@/app/components/FormErrors";
import Link from "next/link";
import {OutcomeResponse} from "@/app/types/outcomeTypes";
import {useSession} from "next-auth/react";
import {showToast} from "nextjs-toast-notify";

export default function UpdateOutcome({params}: { params: Promise<{ outcome_id: string }> }) {
    const {outcome_id} = use(params);


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
        why_it_matters: '',
        deadline: '',
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
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
                const data = await outcomeAPI.get<OutcomeResponse>(`/outcomes/${outcome_id}`);
                const outcomeData = data.data
                if (outcomeData) {
                    setFormData({
                        ...formData,
                        title: outcomeData.title,
                        why_it_matters: outcomeData.why_it_matters,
                        deadline: toDateTimeLocal(outcomeData.deadline),
                    })
                }


            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load project')
            } finally {
                setLoading(false)
            }
        }

        if (outcome_id) {
            fetchData()
        }
    }, [outcome_id])

    const router = useRouter()

    const updateOutcome = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const response = await outcomeAPI.patch(`/outcomes/${outcome_id}`, {
      ...formData,
      deadline: new Date(formData.deadline)
    })
            console.log(response)
            router.push('/u/outcomes');
            showToast.success(`Successfully updated outcome`, {})
            // TODO: Show success message or redirect
        } catch (err) {
            console.error('Update failed:', err)
        }
    }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-8 mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Loading outcome...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between md:space-x-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Update Outcome</h1>
            <p className="mt-2 text-sm text-gray-500">
              Make changes to your outcome and its success metrics.
            </p>
          </div>
          <Link
            href="/u/outcomes"
            className="mt-4 md:mt-0 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Outcomes
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <FormErrors errors={errors} />

            <form onSubmit={updateOutcome} className="space-y-8">

              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  What do you want to achieve?
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm
                           focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Why It Matters */}
              <div>
                <label htmlFor="why_it_matters" className="block text-sm font-medium text-gray-700 mb-1">
                  Why does this outcome matter?
                </label>
                <textarea
                  id="why_it_matters"
                  name="why_it_matters"
                  rows={6}
                  className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm
                           focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.why_it_matters}
                  onChange={handleChange}
                />
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  When do you want to achieve this by?
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  required
                  className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm
                           focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
                           text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
                           focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
                           text-sm font-medium text-white bg-primary-600 hover:bg-primary-700
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Outcome'
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
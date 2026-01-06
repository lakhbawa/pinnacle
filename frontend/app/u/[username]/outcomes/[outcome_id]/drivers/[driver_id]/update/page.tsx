'use client'
import {use, useEffect, useState} from "react";
import {outcomeAPI} from "@/utils/fetchWrapper";
import {useRouter} from "next/navigation";
import FormErrors from "@/app/components/FormErrors";
import Link from "next/link";
import {DriverResponse} from "@/app/types/outcomeTypes";

export default function UpdateDriver({params}: {
    params: Promise<{ outcome_id: string, driver_id: string, username: string }>
}) {
    const {outcome_id, driver_id, username} = use(params);
    const userId = 'user-123';
    const [formData, setFormData] = useState({
        title: '',
        description: '', // Added description field
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await outcomeAPI.get<DriverResponse>(`/drivers/${driver_id}`);
                const driverData = data.data;
                if (driverData) {
                    setFormData({
                        title: driverData.title,
                        description: driverData.description || '',
                    });
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load driver');
            } finally {
                setLoading(false);
            }
        }

        if (driver_id) {
            fetchData();
        }
    }, [driver_id]);

    const updateDriver = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            await outcomeAPI.patch(`/drivers/${driver_id}`, formData);
            router.push(`/u/${username}/outcomes/${outcome_id}/drivers/${driver_id}`);
        } catch (err) {
            console.error('Update failed:', err);
            setError('Failed to update driver');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div
                        className="h-8 w-8 mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"/>
                    <p className="text-gray-600">Loading driver...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-md shadow-sm">
                    <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Driver</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md
                     hover:bg-red-200 transition-colors"
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                  clipRule="evenodd"/>
                        </svg>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between md:space-x-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Update Driver</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Make changes to your driver's information
                        </p>
                    </div>
                    <Link
                        href={`/u/${username}/outcomes/${outcome_id}/drivers/${driver_id}`}
                        className="mt-4 md:mt-0 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"/>
                        </svg>
                        Back to Driver
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                        <FormErrors errors={errors}/>

                        <form onSubmit={updateDriver} className="space-y-6">
                            <input type="hidden" name="userId" value={userId}/>

                            {/* Title Field */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                                    Driver Title
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        required
                                        placeholder="Enter driver title"
                                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900
                             placeholder:text-gray-400 focus:outline-none focus:ring-2
                             focus:ring-primary-500 focus:border-primary-500"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p className="text-sm text-gray-500">
                                    Give your driver a clear, descriptive title
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
                      placeholder="Describe what this driver involves..."
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900
                             placeholder:text-gray-400 focus:outline-none focus:ring-2
                             focus:ring-primary-500 focus:border-primary-500 resize-none"
                      value={formData.description}
                      onChange={handleChange}
                  />
                                </div>
                                <p className="text-sm text-gray-500">
                                    Optional: Add more context about this driver
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
                                        <path fillRule="evenodd"
                                              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                                              clipRule="evenodd"/>
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
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none"
                                                 viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor"
                                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            Update Driver
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
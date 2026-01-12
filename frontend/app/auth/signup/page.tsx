'use client'
import {useState} from "react";
import {authAPI} from "@/utils/fetchWrapper";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {AuthResponse} from "@/app/types/outcomeTypes";
import Link from "next/link";
import {showToast} from "nextjs-toast-notify";

export default function SignUpPage() {
    const router = useRouter();
    const {data: session, update} = useSession();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        company: ""
    })
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e: any) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const signUp = async (e: any) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await authAPI.post<AuthResponse>("/auth/signup", formData);

            if (!res.success) {
                setError("Signup failed");
                setLoading(false);
                return;
            }

            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result?.error) {
                setError(result.error);
                showToast.error(result.error);
                setLoading(false);
            } else if (result?.ok) {
                showToast.success("Signed up successfully");

                // Force session update by triggering a refetch
                // Wait a bit for the session cookie to be set
                setTimeout(async () => {
                    await update(); // Manually trigger session refetch
                    router.push("/u/dashboard");
                    router.refresh();
                }, 500);
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            showToast.error(err.message || "Something went wrong");
            setLoading(false);
        }
    }
    return (
        <>

            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={signUp}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="name" className="sr-only">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Name"
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="company" className="sr-only">Company</label>
                        <input
                            id="company"
                            name="company"
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Company"
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            minLength={6}
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            onChange={onChange}
                        />
                    </div>
                </div>
                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span>Signing up...</span>
                        ) : (
                            <span>Sign up</span>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">

                <Link href="/auth/signin" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Already have account ? Sign in instead
                </Link>

            </div>
        </>
    );

}
'use client'
import {useState} from "react";
import fetchWrapper from "@/utils/fetchWrapper";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {showToast} from "nextjs-toast-notify";

export default function SignInPage() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const onChange = (e: any) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSignIn = async (e: any) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            console.log(result);
            if (result?.error) {
                setError(result.error);
                showToast.error(result.error)
            } else {
                // Sign in successful
               window.location.href = "/u/dashboard";
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
            showToast.error(err.message)
        } finally {
            setLoading(false);
        }
    };
    return (
<>


                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}

                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
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
                                <span>Signing in...</span>
                            ) : (
                                <span>Sign in</span>
                            )}
                        </button>
                    </div>
                </form>


            <div className="mt-6 text-center">

                <Link href="/auth/signup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Create account
                </Link>

            </div>


    <div className="mt-6 text-left">
        <div className="border-t border-gray-200 p-6 text-sm text-gray-500 bg-gray-300">
            <h2 className="pb-3 text-3xl font-extrabold text-gray-900">
                Sample Account
            </h2>

            <div><strong>Email</strong>: user@user.com</div>
            <div><strong>Password</strong>: password</div>
        </div>
    </div>
       </>
    );

}
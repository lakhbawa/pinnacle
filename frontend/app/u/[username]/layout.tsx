"use client"
import {signIn, signOut, useSession} from "next-auth/react";
import {useState} from "react";
import Link from "next/link";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {data: session} = useSession();
    let desktopAuthLinks = (<></>)

    const username = 'lakhbawa'
    desktopAuthLinks = (
        <>
            <button
                onClick={() => signIn()}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
                Login
            </button>
            {/*<Link*/}
            {/*  href="/auth/signup"*/}
            {/*  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"*/}
            {/*>*/}
            {/*  Get Started*/}
            {/*</Link>*/}
        </>
    )

    if (session) {
        desktopAuthLinks = (
            <>
                Hello {session?.user?.name}
                <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                    Sign Out
                </button>

            </>
        )
    }

  return (<section>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                {/* Replace with your logo */}
                              <img src="/pinnacle-logo.svg" alt="logo" width={50} height={50} />
                                <span className="pl-2 text-2xl font-bold text-indigo-600">Pinnacle</span>
                            </div>
                        </div>

                        <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
                            <Link href={`/u/${username}/outcomes`}>Outcomes</Link>

                            {desktopAuthLinks}
                        </div>

                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                <span className="sr-only">Open main menu</span>
                                {/* Hamburger icon */}
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>


                {isMenuOpen && (
                    <div className="sm:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            <Link
                                href="/auth/signin"
                                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

      {children}
    </div>
    </section>)
}
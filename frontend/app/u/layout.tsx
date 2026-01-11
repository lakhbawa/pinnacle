
"use client"
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const username = 'lakhbawa'; // TODO: Get from session

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navigationItems = [
    {
      name: 'Focus',
      href: `/u/focus`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Outcomes',
      href: `/u/outcomes`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left section */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500
                         hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset
                         focus:ring-primary-500"
              >
                <span className="sr-only">{isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>

              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <Image src="/pinnacle-logo.svg" alt="Pinnacle" width={40} height={40} priority />
                  <span className="ml-2 text-xl font-semibold text-primary-600">Pinnacle</span>
                </Link>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {session && (
                <div className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {session.user?.name?.[0].toUpperCase() ?? 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
                      {session.user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="ml-4 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900
                             hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white transform transition-transform duration-200 ease-in-out
        lg:transform-none lg:translate-x-0 border-r border-gray-200
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16" /> {/* Spacer for fixed header */}
        <nav className="mt-5 px-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }
                `}
              >
                <span className={`mr-3 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
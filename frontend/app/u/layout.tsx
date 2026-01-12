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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClick = () => setIsProfileMenuOpen(false);
    if (isProfileMenuOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isProfileMenuOpen]);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: `/u/dashboard`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
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

  const bottomNavigationItems = [
    {
      name: 'Settings',
      href: `#`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: 'Help & Support',
      href: `#`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (

    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700
                         hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500
                         transition-colors"
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>

              <Link href="/" className="flex items-center ml-2 lg:ml-0">
                <div className="relative w-10 h-10">
                  <Image
                    src="/pinnacle-logo.svg"
                    alt="Pinnacle"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Pinnacle
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                  href="#"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="sr-only">View notifications</span>
              </Link>

              {session && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                    }}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100
                             transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600
                                    flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-sm">
                          {session.user?.name?.[0].toUpperCase() ?? 'U'}
                        </span>
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform ${
                        isProfileMenuOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200
                                  py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Your Profile
                        </div>
                      </Link>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </div>
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50
                                 transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <aside className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white transform transition-transform duration-200 ease-in-out
        lg:transform-none lg:translate-x-0 border-r border-gray-200 shadow-lg lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="h-16 border-b border-gray-100" /> {/* Spacer for fixed header */}

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Menu
              </h3>
            </div>
            {navigationItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 shadow-sm' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className={`mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="px-4 py-4 border-t border-gray-100 space-y-1">
            {bottomNavigationItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className={`mr-3 ${isActive ? 'text-gray-700' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gradient-to-br from-primary-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600
                            flex items-center justify-center shadow-md">
                <span className="text-white font-semibold">
                  {session?.user?.name?.[0].toUpperCase() ?? 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.company || 'Free Plan'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 pt-16">
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
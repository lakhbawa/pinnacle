'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const features = [
  {
    title: "Outcome-Driven Planning",
    description: "Define measurable outcomes with success metrics and deadlines. Every task connects to what actually matters.",
    icon: "🎯"
  },
  {
    title: "Driver Breakdown",
    description: "Identify the conditions that must be true for success. Break complex goals into clear, binary milestones.",
    icon: "🔧"
  },
  {
    title: "Progress Tracking",
    description: "Visual progress bars and completion stats. See instantly if you're moving the needle or spinning wheels.",
    icon: "📊"
  },
  {
    title: "Focus Mode",
    description: "Today's view shows only what matters now. No clutter, no overwhelm, just clarity on next actions.",
    icon: "⚡"
  },
  {
    title: "Reflection Prompts",
    description: "After completing tasks, reflect on impact. Build the habit of distinguishing busy work from real progress.",
    icon: "💭"
  },
  {
    title: "Real-time Updates",
    description: "WebSocket-powered live updates. Changes sync instantly across sessions without refresh.",
    icon: "🔄"
  }
]

const techStack = [
  {
    category: "API Gateway",
    items: ["Go", "Gin", "REST"],
    color: "bg-cyan-50 text-cyan-700 border-cyan-200"
  },
  {
    category: "Microservices",
    items: ["NestJS", "TypeScript", "gRPC"],
    color: "bg-red-50 text-red-700 border-red-200"
  },
  {
    category: "Event Streaming",
    items: ["Apache Kafka", "Redis Streams"],
    color: "bg-orange-50 text-orange-700 border-orange-200"
  },
  {
    category: "Data Layer",
    items: ["PostgreSQL", "Redis", "ClickHouse"],
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    category: "Infrastructure",
    items: ["Docker", "Traefik", "Nginx"],
    color: "bg-purple-50 text-purple-700 border-purple-200"
  },
  {
    category: "Observability",
    items: ["Prometheus", "Grafana", "Loki"],
    color: "bg-green-50 text-green-700 border-green-200"
  }
]

const architectureHighlights = [
  {
    title: "Event-Driven Architecture",
    description: "Services communicate through Kafka events, enabling loose coupling, scalability, and reliable message delivery with exactly-once semantics."
  },
  {
    title: "gRPC Internal Communication",
    description: "High-performance binary protocol for service-to-service calls. Protocol Buffers ensure type safety and efficient serialization."
  },
  {
    title: "CQRS Pattern",
    description: "Separate read and write models optimized for their specific use cases. ClickHouse handles analytics while PostgreSQL manages transactional data."
  },
  {
    title: "API Gateway Pattern",
    description: "Go-based gateway handles authentication, rate limiting, and request routing. Single entry point for all external traffic."
  }
]

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const username = 'lakhbawa'

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                S
              </div>
              <span className="text-lg font-semibold">Pinnacle</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm">
                How it works
              </Link>
              <Link href="#architecture" className="text-gray-600 hover:text-gray-900 text-sm">
                Architecture
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">
                Pricing
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="https://github.com/lakhbawa/pinnacle"
                target="_blank"
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <GitHubIcon />
              </Link>
              {session ? (
                <>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    Sign out
                  </button>
                  <Link
                    href={`/u/${username}/focus`}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Open App
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => signIn()}
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    Sign in
                  </button>
                  <Link
                    href="/auth/signup"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-6 py-4 space-y-4">
              <Link href="#features" className="block text-gray-600 text-sm">Features</Link>
              <Link href="#how-it-works" className="block text-gray-600 text-sm">How it works</Link>
              <Link href="#architecture" className="block text-gray-600 text-sm">Architecture</Link>
              <Link href="#pricing" className="block text-gray-600 text-sm">Pricing</Link>
              <Link href="https://github.com/lakhbawa/pinnacle" className="block text-gray-600 text-sm">GitHub</Link>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                {session ? (
                  <>
                    <button onClick={() => signOut()} className="block text-gray-600 text-sm">Sign out</button>
                    <Link href={`/u/${username}/focus`} className="block w-full bg-gray-900 text-white text-center px-4 py-3 rounded-lg text-sm font-medium">
                      Open App
                    </Link>
                  </>
                ) : (
                  <>
                    <button onClick={() => signIn()} className="block text-gray-600 text-sm">Sign in</button>
                    <button onClick={() => signIn()} className="block w-full bg-gray-900 text-white text-center px-4 py-3 rounded-lg text-sm font-medium">
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Open source project
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-6">
            Stop tracking tasks.<br />
            Start achieving outcomes.
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            A focused project tool for founders who need to know if today's work actually moved the needle. Built with a modern microservices architecture.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
            <button
              onClick={() => signIn()}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Try the demo
              <ArrowRightIcon />
            </button>
            <Link
              href="https://github.com/lakhbawa/pinnacle"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              <GitHubIcon />
              View on GitHub
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {["Go", "NestJS", "Kafka", "gRPC", "PostgreSQL", "Redis", "Docker"].map((tech) => (
              <span key={tech} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Product Screenshot */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-2 sm:p-4 shadow-sm">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-100 rounded-md px-3 py-1.5 text-xs text-gray-500 max-w-md mx-auto">
                    pinnacle.app/focus
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Today's Focus</h2>
                  <span className="text-sm text-gray-500">Mon, Jan 6, 2025</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Outcome</div>
                      <div className="text-lg font-semibold">Launch MVP and get 10 paying customers</div>
                      <p className="text-sm text-gray-500 mt-1">Validate the product-market fit before scaling</p>
                    </div>
                    <div className="text-right text-sm">
                      <span className="text-gray-500">Target:</span>
                      <span className="ml-1 font-semibold">10 customers</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{width: '30%'}} />
                    </div>
                    <span className="text-sm text-gray-600 tabular-nums">3/10</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-b border-gray-200 mb-4">
                  <button className="px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 -mb-px bg-blue-50">
                    Landing Page <span className="text-blue-400 text-xs">2/5</span>
                  </button>
                  <button className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700">
                    Payment <span className="text-gray-400 text-xs">0/3</span>
                  </button>
                  <button className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700">
                    Traffic <span className="text-gray-400 text-xs">1/4</span>
                  </button>
                  <button className="px-3 py-3 text-gray-400 hover:text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-400 line-through">Design landing page mockup</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-400 line-through">Build with Next.js</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0"></div>
                    <span className="text-sm">Deploy to production server</span>
                    <span className="text-xs text-gray-400 ml-auto">Jan 7</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0"></div>
                    <span className="text-sm">Set up custom domain</span>
                  </div>
                  <button className="w-full flex items-center gap-2 p-3 text-sm text-gray-500 hover:text-blue-600 border border-dashed border-gray-200 hover:border-blue-300 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add action
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Most productivity tools track activity, not progress.
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You check off 50 tasks this week. But did you actually get closer to your goal? Traditional task managers can't answer that question.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="text-sm font-medium text-red-600 mb-4">The problem</div>
              <ul className="space-y-3">
                {[
                  "Built features for 3 months that nobody wanted",
                  "Checked off 200 tasks but missed quarterly goal",
                  "Can't tell if today's work actually mattered",
                  "Drowning in Notion pages and Trello boards"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="text-red-500 mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="text-sm font-medium text-green-600 mb-4">With Pinnacle</div>
              <ul className="space-y-3">
                {[
                  "Start with measurable outcomes, work backwards",
                  "Every task connects to a specific goal",
                  "See immediately when you're spinning wheels",
                  "One focused view, no clutter"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5"><CheckIcon /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Opinionated by design. Less flexibility, more focus.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                <div className="text-2xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Three steps to clarity
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Define your outcome",
                description: "Not \"launch website\" but \"get 10 paying customers by March 1st.\" Specific. Measurable. Time-bound."
              },
              {
                step: "2",
                title: "Identify drivers",
                description: "What must be true for this outcome? \"Landing page is live.\" \"Payment works.\" Clear, binary conditions."
              },
              {
                step: "3",
                title: "Complete actions",
                description: "Break drivers into tasks. Complete them and reflect: did this actually move the needle?"
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Engineering
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Built for scale from day one
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A production-grade microservices architecture demonstrating modern backend patterns. Not a monolith with aspirations—a properly distributed system.
            </p>
          </div>

          {/* Tech Stack Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {techStack.map((stack, i) => (
              <div key={i} className={`rounded-xl p-4 border ${stack.color}`}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-75">
                  {stack.category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {stack.items.map((item, j) => (
                    <span key={j} className="text-sm font-medium">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Architecture Highlights */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {architectureHighlights.map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="https://www.tldraw.com/p/Tz-EJdJEB6hq8Z-nOMSjH?d=v-130.0.2552.1324.page"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 px-5 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              View System Design
              <ExternalLinkIcon />
            </Link>
            <Link
              href="https://github.com/lakhbawa/pinnacle"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 px-5 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              <GitHubIcon />
              Explore the Code
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Service Architecture
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Each service owns its domain, data, and deployment lifecycle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "API Gateway", tech: "Go + Gin", desc: "Authentication, routing, rate limiting", color: "border-l-cyan-500" },
              { name: "User Service", tech: "NestJS", desc: "Registration, profiles, preferences", color: "border-l-blue-500" },
              { name: "Auth Service", tech: "NestJS", desc: "JWT, OAuth, session management", color: "border-l-purple-500" },
              { name: "Outcome Service", tech: "NestJS", desc: "Outcomes, drivers, actions CRUD", color: "border-l-green-500" },
              { name: "Notification Service", tech: "NestJS + WebSocket", desc: "Real-time updates, email, push", color: "border-l-orange-500" },
              { name: "Analytics Service", tech: "NestJS + ClickHouse", desc: "Progress tracking, insights", color: "border-l-red-500" },
              { name: "Email Worker", tech: "Node.js + Kafka", desc: "Async email processing", color: "border-l-pink-500" },
              { name: "Event Bus", tech: "Apache Kafka", desc: "Event streaming backbone", color: "border-l-yellow-500" }
            ].map((service, i) => (
              <div key={i} className={`bg-white border border-gray-200 border-l-4 ${service.color} rounded-lg p-4`}>
                <div className="font-semibold text-sm mb-1">{service.name}</div>
                <div className="text-xs text-gray-500 mb-2">{service.tech}</div>
                <div className="text-xs text-gray-600">{service.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Built for solo founders
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Pinnacle isn't for teams managing sprints or agencies tracking billable hours. It's for the founder working alone who can't afford to spend a week on the wrong thing.
          </p>

          <div className="inline-flex flex-wrap justify-center gap-2">
            {["Indie hackers", "Solo founders", "Bootstrappers", "Side project builders"].map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Simple pricing
          </h2>
          <p className="text-gray-600 mb-8">
            Free while in beta. We'll introduce pricing once we've proven the value.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="text-3xl font-semibold mb-2">$0</div>
            <div className="text-sm text-gray-500 mb-6">Free during beta</div>
            <ul className="text-sm text-gray-600 space-y-3 mb-8 text-left">
              {["Unlimited outcomes", "Unlimited drivers and actions", "Progress tracking", "Real-time updates", "Reflection prompts"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-green-500"><CheckIcon /></span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => signIn()}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Start free trial
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Ready to focus on what matters?
          </h2>
          <p className="text-gray-400 mb-8">
            Start with one outcome. See the difference clarity makes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => signIn()}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Get started for free
              <ArrowRightIcon />
            </button>
            <Link
              href="https://github.com/lakhbawa/pinnacle"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              <GitHubIcon />
              Star on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                  S
                </div>
                <span className="font-semibold">Pinnacle</span>
              </div>
              <p className="text-sm text-gray-500">
                Outcome-driven project management for solo founders.
              </p>
            </div>

            <div>
              <div className="font-medium text-sm mb-3">Product</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-gray-900">How it works</Link></li>
                <li><Link href="#pricing" className="hover:text-gray-900">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-medium text-sm mb-3">Engineering</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="https://github.com/lakhbawa/pinnacle" target="_blank" className="hover:text-gray-900 inline-flex items-center gap-1">
                    GitHub <ExternalLinkIcon />
                  </Link>
                </li>
                <li>
                  <Link href="https://www.tldraw.com/p/Tz-EJdJEB6hq8Z-nOMSjH?d=v-130.0.2552.1324.page" target="_blank" className="hover:text-gray-900 inline-flex items-center gap-1">
                    System Design <ExternalLinkIcon />
                  </Link>
                </li>
                <li><Link href="#architecture" className="hover:text-gray-900">Architecture</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-medium text-sm mb-3">Legal</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2025 Pinnacle. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com/lakhbawa/pinnacle" target="_blank" className="text-gray-400 hover:text-gray-600">
                <GitHubIcon />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
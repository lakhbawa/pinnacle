'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

// Icons as components for cleaner code
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
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

// Problem list items data
const problemItems = [
  "Spent 3 months building features nobody wanted",
  "Checked off 200 tasks but didn't hit your quarterly goal",
  "Can't tell if today's work actually moved the needle",
  "Drowning in Notion pages, Trello boards, and Slack threads"
]

// Solution cards data
const solutionCards = [
  {
    number: "01",
    icon: "🎯",
    title: "Define measurable outcomes",
    description: "Not \"launch website\" but \"get 10 paying customers.\" Specific. Measurable. Time-bound. No vague goals allowed."
  },
  {
    number: "02",
    icon: "🔧",
    title: "Identify what must be true",
    description: "Break outcomes into drivers—conditions that must be true. \"Landing page is live.\" \"Payment flow works.\" Clear and binary."
  },
  {
    number: "03",
    icon: "⚡",
    title: "Track if work matters",
    description: "Every completed task asks: \"Did this move the outcome?\" We flag when you're spinning wheels. No more busy work."
  }
]

// Not for / For lists
const notForList = [
  "You need to assign tasks across a team",
  "You want a customizable Notion-like workspace",
  "You need time tracking or billing features",
  "You want a calendar view with scheduled tasks",
  "Someone else sets your priorities"
]

const forList = [
  "You're a founder building your own thing",
  "You set your own priorities",
  "You've tried Notion/Todoist and felt overwhelmed",
  "You want clarity, not flexibility",
  "You can't afford to waste time on wrong things"
]

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()

  // Handle scroll for nav background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans antialiased overflow-x-hidden">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/[0.06] ${
          isScrolled ? 'bg-[#0A0A0B]/95' : 'bg-[#0A0A0B]/80'
        } backdrop-blur-xl`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B35] to-[#FF8556] rounded-[10px] flex items-center justify-center font-serif text-xl text-white">
                S
              </div>
              <span className="text-xl font-bold tracking-tight">StrategyForge</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#how-it-works" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                How it works
              </Link>
              <Link href="#pricing" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                Blog
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <>
                  <span className="text-sm text-zinc-400">Hello, {session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="text-zinc-400 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign out
                  </button>
                  <Link
                    href="/u/lakhbawa/outcomes"
                    className="bg-[#FF6B35] hover:bg-[#FF8556] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,107,53,0.15)] hover:shadow-[0_4px_24px_rgba(255,107,53,0.15)]"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => signIn()}
                    className="text-zinc-400 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => signIn()}
                    className="bg-[#FF6B35] hover:bg-[#FF8556] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,107,53,0.15)] hover:shadow-[0_4px_24px_rgba(255,107,53,0.15)]"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#111113] border-t border-white/[0.06]">
            <div className="px-6 py-4 space-y-4">
              <Link href="#how-it-works" className="block text-zinc-400 hover:text-white text-sm font-medium">
                How it works
              </Link>
              <Link href="#pricing" className="block text-zinc-400 hover:text-white text-sm font-medium">
                Pricing
              </Link>
              <Link href="/blog" className="block text-zinc-400 hover:text-white text-sm font-medium">
                Blog
              </Link>
              <div className="pt-4 border-t border-white/[0.06] space-y-3">
                {session ? (
                  <>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left text-zinc-400 hover:text-white text-sm font-medium"
                    >
                      Sign out
                    </button>
                    <Link
                      href="/dashboard"
                      className="block w-full bg-[#FF6B35] text-white text-center px-4 py-3 rounded-lg text-sm font-semibold"
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => signIn()}
                      className="block w-full text-left text-zinc-400 hover:text-white text-sm font-medium"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => signIn()}
                      className="block w-full bg-[#FF6B35] text-white text-center px-4 py-3 rounded-lg text-sm font-semibold"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center pt-24 relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-52 -right-24 w-[600px] h-[600px] rounded-full bg-[#FF6B35] opacity-[0.15] blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-52 -left-52 w-[600px] h-[600px] rounded-full bg-indigo-500 opacity-[0.08] blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF6B35]/[0.08] border border-[#FF6B35]/20 rounded-full text-sm font-medium text-[#FF6B35] mb-8 animate-fade-in-up">
              <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full animate-pulse" />
              For founders who can't afford to work on the wrong thing
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.1] tracking-tight mb-6 animate-fade-in-up animation-delay-100">
              <span className="block">Stop managing tasks.</span>
              <span className="block">
                Start achieving <span className="text-[#FF6B35] italic">outcomes.</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
              The only project management tool that tells you when you're being busy without being effective. Define outcomes, track what actually moves the needle.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-300">
              <button
                onClick={() => signIn()}
                className="inline-flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF8556] text-white px-8 py-4 rounded-lg text-base font-semibold transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,107,53,0.15)] hover:shadow-[0_4px_24px_rgba(255,107,53,0.15)]"
              >
                Start free trial
                <ArrowRightIcon />
              </button>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-[#1F1F23] hover:bg-[#18181B] text-white px-8 py-4 rounded-lg text-base font-semibold transition-all border border-white/[0.06] hover:border-white/[0.12]"
              >
                Watch 2-min demo
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-20 pt-8 border-t border-white/[0.06] animate-fade-in-up animation-delay-400">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Trusted by founders at</p>
              <div className="flex justify-center items-center gap-8 sm:gap-12 opacity-50">
                <span className="text-xs sm:text-sm font-semibold text-zinc-500 tracking-widest">INDIE HACKERS</span>
                <span className="text-xs sm:text-sm font-semibold text-zinc-500 tracking-widest">Y COMBINATOR</span>
                <span className="text-xs sm:text-sm font-semibold text-zinc-500 tracking-widest">PRODUCT HUNT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[#FF6B35] mb-6">
                <span className="w-6 h-px bg-[#FF6B35]" />
                The Problem
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight mb-6">
                You're busy every day but not getting closer to your goals.
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Most project management tools are glorified to-do lists. They track what you did, not whether it mattered. You end the week with 50 tasks checked off, but did you actually make progress?
              </p>
            </div>

            {/* Problem Card */}
            <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-amber-500" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-lg">
                  😰
                </div>
                <h3 className="text-lg font-semibold">Sound familiar?</h3>
              </div>

              <ul className="space-y-0">
                {problemItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 py-4 border-b border-white/[0.06] last:border-b-0">
                    <span className="w-5 h-5 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 text-xs flex-shrink-0 mt-0.5">
                      ✗
                    </span>
                    <span className="text-zinc-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-32 bg-[#111113] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[#FF6B35] mb-6">
              <span className="w-6 h-px bg-[#FF6B35]" />
              The Solution
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight mb-6">
              Outcomes before tasks. <br />Clarity over features.
            </h2>
            <p className="text-lg text-zinc-400">
              StrategyForge flips project management on its head. Start with what success looks like, then work backwards.
            </p>
          </div>

          {/* Solution Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {solutionCards.map((card, index) => (
              <div
                key={index}
                className="group bg-[#0A0A0B] border border-white/[0.06] rounded-2xl p-8 transition-all duration-300 hover:border-[#FF6B35] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B35]/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <span className="font-mono text-xs text-[#FF6B35] mb-4 block">{card.number}</span>
                  <div className="w-12 h-12 bg-[#1F1F23] border border-white/[0.06] rounded-xl flex items-center justify-center text-2xl mb-6">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-20">
            <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[#FF6B35] mb-6">
              <span className="w-6 h-px bg-[#FF6B35]" />
              How It Works
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight">
              Simple by design. Opinionated for results.
            </h2>
          </div>

          {/* Steps */}
          <div className="space-y-24">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-md">
                <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center font-mono text-sm font-semibold mb-6">
                  1
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold mb-4">
                  Create an outcome with a success metric
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Start with what success looks like. "Get 10 paying customers by March 1st." The metric keeps you honest. The deadline keeps you focused.
                </p>
              </div>
              <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-8">
                <div className="bg-[#18181B] border border-white/[0.06] rounded-xl p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#FF6B35] mb-1">
                    Your Outcome
                  </div>
                  <div className="text-lg font-semibold mb-4">
                    Launch MVP and get 10 paying customers
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-bold text-emerald-500">3</span>
                    <span className="font-mono text-xl text-zinc-500">/ 10 customers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-md lg:order-2">
                <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center font-mono text-sm font-semibold mb-6">
                  2
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold mb-4">
                  Break it into drivers and tasks
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Drivers are the conditions that must be true. Under each driver, add the tasks that make it happen. Simple, focused, no clutter.
                </p>
              </div>
              <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-8 lg:order-1">
                <div className="bg-[#18181B] border border-white/[0.06] rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Landing page is live</span>
                    <span className="font-mono text-xs text-zinc-500">3/5 tasks</span>
                  </div>
                  <div className="space-y-2">
                    {['Design mockup', 'Build with Next.js', 'Deploy to Vercel'].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-4 h-4 bg-emerald-500 rounded border-0" />
                        <span className="text-zinc-500 line-through">{task}</span>
                      </div>
                    ))}
                    {['Set up SSL certificate', 'Connect custom domain'].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-4 h-4 rounded border-2 border-zinc-600" />
                        <span className="text-zinc-300">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-md">
                <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center font-mono text-sm font-semibold mb-6">
                  3
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold mb-4">
                  Reflect on every completion
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  After completing a task, you answer one question: "Did this move the outcome?" This simple habit separates real progress from busy work.
                </p>
              </div>
              <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-8 flex items-center justify-center">
                <div className="bg-[#18181B] border border-white/[0.06] rounded-xl p-8 text-center max-w-xs">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    ✓
                  </div>
                  <div className="text-lg font-semibold mb-1">Task completed!</div>
                  <div className="text-sm text-zinc-400 mb-6">
                    Did this get you closer to <strong className="text-white">10 paying customers</strong>?
                  </div>
                  <div className="space-y-3">
                    <button className="w-full bg-emerald-500 text-white py-3 rounded-lg text-sm font-semibold">
                      Yes, outcome moved
                    </button>
                    <button className="w-full bg-[#1F1F23] text-zinc-400 py-3 rounded-lg text-sm font-semibold">
                      No, just busy work
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Not For Section */}
      <section className="py-32 bg-[#111113]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal mb-4">
              We're opinionated. On purpose.
            </h2>
            <p className="text-lg text-zinc-400">
              StrategyForge isn't for everyone. And that's exactly the point.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Not For Card */}
            <div className="bg-[#0A0A0B] border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-red-500">✗</span>
                Not for you if...
              </h3>
              <ul className="space-y-3">
                {notForList.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-zinc-400">
                    <span className="text-red-500 font-semibold">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* For Card */}
            <div className="bg-[#0A0A0B] border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Perfect for you if...
              </h3>
              <ul className="space-y-3">
                {forList.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-zinc-400">
                    <span className="text-emerald-500 font-semibold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF6B35] rounded-full blur-[150px] opacity-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-serif text-4xl sm:text-5xl font-normal mb-6">
              Ready to focus on what matters?
            </h2>
            <p className="text-lg text-zinc-400 mb-10">
              Start with one outcome. See how it feels to have clarity on what actually moves the needle.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => signIn()}
                className="inline-flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF8556] text-white px-8 py-4 rounded-lg text-base font-semibold transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,107,53,0.15)] hover:shadow-[0_4px_24px_rgba(255,107,53,0.15)]"
              >
                Start free trial
                <ArrowRightIcon />
              </button>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-[#1F1F23] hover:bg-[#18181B] text-white px-8 py-4 rounded-lg text-base font-semibold transition-all border border-white/[0.06] hover:border-white/[0.12]"
              >
                Watch demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-[#FF6B35] to-[#FF8556] rounded-lg flex items-center justify-center font-serif text-sm text-white">
                S
              </div>
              <span className="font-semibold">StrategyForge</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/about" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                Blog
              </Link>
              <Link href="/pricing" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                Pricing
              </Link>
              <Link href="/privacy" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                Terms
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-sm text-zinc-500">
              © 2025 StrategyForge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease forwards;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
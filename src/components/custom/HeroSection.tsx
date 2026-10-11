'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BarChart,
  Coffee,
  Keyboard,
  Target,
  Timer,
  Trophy,
  Users,
  Zap,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedTooltipPreview } from './AnimatedTooltip'
import { motion } from 'framer-motion'
import { Spotlight } from '../ui/Spotlight'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' as const },
  },
}

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const features = [
  {
    icon: Timer,
    title: 'Time Challenges',
    description:
      'Practice against the clock with different timed typing challenges and build consistency.',
  },
  {
    icon: Trophy,
    title: 'Leaderboards',
    description:
      'Track your performance, challenge yourself, and work towards your next personal best.',
  },
  {
    icon: Users,
    title: 'Multiplayer Rooms',
    description:
      'Create or join typing rooms and compete with friends to make practice more exciting.',
  },
]

const benefits = [
  {
    icon: BarChart,
    title: 'Performance Insights',
    description:
      'Understand your typing progress and identify areas where you can improve.',
  },
  {
    icon: Target,
    title: 'Personal Goals',
    description:
      'Set meaningful targets for your typing speed, accuracy, and daily practice.',
  },
  {
    icon: Zap,
    title: 'Daily Challenges',
    description:
      'Keep your practice fresh with challenges that encourage you to improve.',
  },
  {
    icon: Coffee,
    title: 'Healthy Practice',
    description:
      'Build a sustainable routine with regular breaks and comfortable practice sessions.',
  },
]

export default function TypeBlazeLanding() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="relative min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#080914] dark:text-white"
    >
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px] dark:bg-violet-600/20" />
        <div className="absolute right-[-150px] top-[500px] h-[350px] w-[350px] rounded-full bg-fuchsia-400/10 blur-[100px] dark:bg-fuchsia-500/10" />
        <div className="absolute bottom-[100px] left-[-150px] h-[350px] w-[350px] rounded-full bg-indigo-400/10 blur-[100px] dark:bg-indigo-500/10" />

        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.055]"
          style={{
            backgroundImage:
              'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <Spotlight
        className="-top-40 left-0 hidden dark:flex md:left-60 md:-top-20"
        fill="#a78bfa"
      />

      <motion.main
        variants={stagger}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 sm:px-8"
      >
        {/* Hero section */}
        <section className="flex min-h-[85vh] flex-col items-center justify-center py-20 text-center sm:py-28">
          <motion.div
            variants={fadeInUp}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm backdrop-blur dark:border-violet-400/20 dark:bg-white/[0.04] dark:text-violet-200"
          >
            <Sparkles className="h-4 w-4" />
            A better way to build your typing skills
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="max-w-5xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Make Every
            <br />
            Keystroke{' '}
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
              Count.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-7 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg"
          >
            Meet Typelivo — your space to practise typing, challenge your
            limits, and build speed with accuracy. Every session is a step
            towards your next personal best.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row"
          >
            <Link
              href="/playground"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30"
            >
              Start Typing Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-8 py-4 text-base font-semibold text-slate-800 transition hover:border-violet-400 hover:bg-violet-50 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
            >
              Explore Typelivo
            </Link>
          </motion.div>

          {/* Quick highlights */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400"
          >
            {['Speed practice', 'Accuracy tracking', 'Daily challenges'].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" />
                  {item}
                </span>
              ),
            )}
          </motion.div>

          {/* Keyboard-inspired visual */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-2xl shadow-violet-950/[0.04] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035] dark:shadow-black/20 sm:p-8"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <Keyboard className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Your next personal best</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Every keystroke takes you forward
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                Ready to practise
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left font-mono text-sm leading-8 text-slate-500 dark:border-white/10 dark:bg-[#0c0e1b] dark:text-slate-400 sm:p-6 sm:text-base">
              <span className="text-violet-600 dark:text-violet-300">
                The best way to get better
              </span>{' '}
              is to practise a little every day.
              <br />
              <span className="text-fuchsia-600 dark:text-fuchsia-300">
                Stay focused.
              </span>{' '}
              <span className="text-indigo-600 dark:text-indigo-300">
                Keep improving.
              </span>
              <span className="ml-1 inline-block h-5 w-0.5 translate-y-1 animate-pulse bg-violet-500" />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Consistency beats perfection.</span>
              <span className="font-semibold text-violet-600 dark:text-violet-300">
                Your journey starts here →
              </span>
            </div>
          </motion.div>
        </section>

        {/* Main features */}
        <motion.section
          variants={fadeInUp}
          className="pb-24"
        >
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
              Made for your progress
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Practice with a purpose.
            </h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Useful tools to make your typing sessions focused, competitive,
              and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {features.map((item) => (
              <motion.div key={item.title} variants={fadeInUp}>
                <Card className="group h-full rounded-3xl border-slate-200/80 bg-white/80 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-950/[0.05] dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-violet-400/40 dark:hover:bg-white/[0.055]">
                  <CardHeader className="p-6 pb-3">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 text-violet-600 transition group-hover:from-violet-500 group-hover:to-fuchsia-500 group-hover:text-white dark:text-violet-300">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <p className="leading-7 text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Typelivo */}
        <motion.section
          variants={fadeInUp}
          className="mb-24 rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.025] sm:p-10 lg:p-14"
        >
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
                Small steps. Real progress.
              </p>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Build a skill that gets better with practice.
              </h2>
              <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
                Typelivo brings useful practice tools into one place so you
                can focus on building confidence, consistency, and accuracy.
              </p>
              <Link
                href="/playground"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-violet-700 transition hover:gap-3 dark:text-violet-300"
              >
                Start your practice
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {benefits.map((item) => (
                <motion.div
                  variants={fadeInUp}
                  key={item.title}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Community */}
        <motion.section
          variants={fadeInUp}
          className="mb-24 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
            Better together
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Make practice part of your routine.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
            Challenge yourself, share the fun with friends, and celebrate the
            small improvements that add up over time.
          </p>

          <div className="mt-8 flex justify-center">
            <AnimatedTooltipPreview />
          </div>
        </motion.section>

        {/* Final call to action */}
        <motion.section
          variants={fadeInUp}
          className="relative mb-10 overflow-hidden rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-700 px-6 py-14 text-center text-white shadow-2xl shadow-violet-950/15 sm:px-12 sm:py-16"
        >
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-12 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
              <Keyboard className="h-7 w-7" />
            </div>

            <h2 className="text-3xl font-bold leading-tight sm:text-5xl">
              Ready to find your rhythm?
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-white/80 sm:text-lg">
              Start practising today. Build your speed, sharpen your accuracy,
              and make every session count with Typelivo.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/playground"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                Start Typing Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 py-7 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
              <Keyboard className="h-4 w-4" />
            </span>
            Typelivo
          </Link>

          <p>Practise consistently. Improve every day.</p>

          <Link
            href="/about"
            className="transition hover:text-violet-600 dark:hover:text-violet-300"
          >
            About Typelivo
          </Link>
        </footer>
      </motion.main>
    </motion.div>
  )
}

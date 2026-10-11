
import Link from "next/link"
import { ArrowRight, Github, Keyboard } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/90 text-slate-600 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#080914] dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-105">
                <Keyboard className="h-5 w-5" />
              </span>

              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Type
                <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                  livo
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500 dark:text-slate-400">
              Practise consistently. Improve your accuracy, build your speed,
              and make every keystroke count.
            </p>

            <Link
              href="/playground"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:gap-3 dark:text-violet-300"
            >
              Start practising
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-900 dark:text-white">
              Explore
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/playground"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-300"
                >
                  Typing Practice
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-300"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-300"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Original project */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-900 dark:text-white">
              Project Credits
            </h3>

            <p className="mb-5 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
              Typelivo is a customized version of the original typing project.
              Credit to the original developers is preserved below.
            </p>

            <a
              href="https://github.com/Nityanand17/typeblaze"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-violet-400/40 dark:hover:text-violet-300"
            >
              <Github className="h-4 w-4" />
              Original GitHub project
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-5 border-t border-slate-200/80 pt-6 text-sm dark:border-white/10 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Typelivo. All rights reserved.
          </p>

          <p className="leading-7">
            Original developers:{" "}
            <a
              href="https://github.com/0xNitya"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 transition hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-300"
            >
              Nityanand
            </a>
            {", "}
            <a
              href="https://github.com/AkashB-24"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 transition hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-300"
            >
              Akash
            </a>
            {", and "}
            <a
              href="https://github.com/chandhu2004"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 transition hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-300"
            >
              Chandhu
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

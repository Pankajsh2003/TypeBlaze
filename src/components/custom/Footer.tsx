import Link from "next/link"
import { ArrowRight, Keyboard } from "lucide-react"

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/playground", label: "Typing Practice" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/faq", label: "FAQ" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact" },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/90 text-slate-600 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#080914] dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3" aria-label="Typelivo home">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-105">
                <Keyboard className="h-5 w-5" />
              </span>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Type<span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">livo</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
              Practise consistently. Improve your accuracy, build your speed, and make every keystroke count.
            </p>

            <Link
              href="/playground"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:gap-3 dark:text-violet-300"
            >
              Start practising
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-900 dark:text-white">
              Explore
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-violet-600 dark:hover:text-violet-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/80 pt-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 sm:text-left">
          <p>© {new Date().getFullYear()} Typelivo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

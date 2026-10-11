
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  ArrowRight,
  Menu,
  Crown,
  ChevronDown,
  Code,
  Keyboard,
} from "lucide-react"
import useAuthStore from "@/store/useStore"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ModeToggle } from "./ModeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinkClass =
  "text-sm font-medium text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-300"

const NavItems = () => {
  const { isPremium } = useAuthStore()

  return (
    <>
      <Link href="/playground" className={navLinkClass}>
        Play Now
      </Link>

      <Link href="/lobby" className={navLinkClass}>
        Play with friends
      </Link>

      {isPremium ? (
        <DropdownMenu>
          <DropdownMenuTrigger className={`${navLinkClass} flex items-center`}>
            <Crown className="mr-1 h-4 w-4 text-amber-500" />
            Premium
            <ChevronDown className="ml-1 h-4 w-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/premium/themes" className="w-full">
                Custom Themes
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/premium/stats" className="w-full">
                Advanced Stats
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/premium/custom-texts" className="w-full">
                Custom Texts
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/premium/challenges" className="w-full">
                Daily Challenges
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/premium/leetcode"
                className="flex w-full items-center"
              >
                <Code className="mr-2 h-4 w-4 text-blue-500" />
                LeetCode Tracker
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/subscription" className={navLinkClass}>
          Pricing
        </Link>
      )}

      <Link href="/leaderboard" className={navLinkClass}>
        Leaderboard
      </Link>

      <ModeToggle />
    </>
  )
}

export function Navbar() {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.get("/api/logout")
    } catch (error) {
      console.error("Logout request failed:", error)
    } finally {
      logout()
      setIsOpen(false)
      router.push("/login")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#080914]/85">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Typelivo brand */}
        <Link
          href="/"
          aria-label="Typelivo home"
          className="group inline-flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20 transition-transform group-hover:scale-105">
            <Keyboard className="h-5 w-5" />
          </span>

          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Type<span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">livo</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <NavItems />

          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              className="rounded-full bg-slate-900 px-5 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Logout
            </Button>
          ) : (
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30"
            >
              Join Now
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              aria-label="Open navigation menu"
              className="rounded-xl border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[280px] border-slate-200 bg-white dark:border-white/10 dark:bg-[#0c0d1b] sm:w-[320px]"
          >
            <div className="mb-8 mt-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                <Keyboard className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Type<span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">livo</span>
              </span>
            </div>

            <nav className="flex flex-col items-start gap-6">
              <NavItems />

              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  className="w-full rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                >
                  Logout
                </Button>
              ) : (
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  Join Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

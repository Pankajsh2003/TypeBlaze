"use client"

import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import {
  AlertCircle,
  ExternalLink,
  Loader2,
  Medal,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import toast, { Toaster } from "react-hot-toast"

interface LeaderboardUser {
  _id?: string
  id?: string
  fullname?: string | null
  username?: string | null
  testAttempted?: number | string | null
  topSpeed?: number | string | null
}

interface LeaderboardResponse {
  message?: string
  users?: LeaderboardUser[]
}

function toNonNegativeNumber(value: number | string | null | undefined): number {
  const parsed = typeof value === "number" ? value : Number(value ?? 0)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading leaderboard" aria-busy="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-xl border p-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40 max-w-full" />
            <Skeleton className="h-3 w-24 max-w-full" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  )
}

function RankDisplay({ rank }: { rank: number }) {
  if (rank === 1) return <span aria-label="Rank 1" className="text-xl">🥇</span>
  if (rank === 2) return <span aria-label="Rank 2" className="text-xl">🥈</span>
  if (rank === 3) return <span aria-label="Rank 3" className="text-xl">🥉</span>
  return <span className="font-semibold text-muted-foreground">#{rank}</span>
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async (showRefreshToast = false) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get<LeaderboardResponse>("/api/leaderboard", {
        headers: { Accept: "application/json" },
      })

      if (!Array.isArray(response.data?.users)) {
        throw new Error(response.data?.message || "The leaderboard API returned an unexpected response.")
      }

      const normalizedUsers = response.data.users
        .filter((user) => user && (user.username || user.fullname))
        .map((user) => ({
          ...user,
          fullname: user.fullname?.trim() || user.username?.trim() || "Unknown player",
          username: user.username?.trim() || "",
          testAttempted: toNonNegativeNumber(user.testAttempted),
          topSpeed: toNonNegativeNumber(user.topSpeed),
        }))
        .sort((a, b) => Number(b.topSpeed) - Number(a.topSpeed))

      setUsers(normalizedUsers)
      if (showRefreshToast) toast.success("Leaderboard refreshed")
    } catch (requestError: unknown) {
      console.error("Error fetching leaderboard:", requestError)

      let message = "Could not load the leaderboard. Please try again."
      if (requestError && typeof requestError === "object") {
        const errorInfo = requestError as {
          response?: { data?: { message?: unknown }; status?: number }
          code?: string
          message?: string
        }
        const serverMessage = errorInfo.response?.data?.message
        if (typeof serverMessage === "string" && serverMessage.trim()) {
          message = serverMessage
        } else if (errorInfo.code === "ERR_NETWORK") {
          message = "Could not reach the leaderboard API. Check the deployment and database connection."
        } else if (errorInfo.response?.status) {
          message = `Leaderboard request failed (HTTP ${errorInfo.response.status}).`
        } else if (typeof errorInfo.message === "string" && errorInfo.message) {
          message = errorInfo.message
        }
      } else if (requestError instanceof Error && requestError.message) {
        message = requestError.message
      }

      setError(message)
      if (showRefreshToast) toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchLeaderboard()
  }, [fetchLeaderboard])

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 sm:px-6">
      <Toaster position="bottom-right" reverseOrder={false} />

      <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-sm dark:border-white/10">
        <CardHeader className="flex flex-col gap-4 border-b bg-slate-50/80 px-5 py-6 dark:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">Typelivo Leaderboard</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Ranked by each player's top typing speed.</p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => void fetchLeaderboard(true)}
            disabled={loading}
            className="w-full rounded-full sm:w-auto"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </CardHeader>

        <CardContent className="p-4 sm:p-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Leaderboard unavailable</AlertTitle>
              <AlertDescription className="mt-1 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>{error}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => void fetchLeaderboard(true)} disabled={loading}>
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {loading && users === null ? (
            <LeaderboardSkeleton />
          ) : users && users.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 dark:bg-white/[0.025]">
                    <TableHead className="w-20 whitespace-nowrap">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Tests</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Top speed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => {
                    const rank = index + 1
                    const identity = user._id || user.id || user.username || `leader-${rank}`
                    return (
                      <TableRow key={identity} className="transition-colors hover:bg-violet-50/60 dark:hover:bg-violet-500/[0.06]">
                        <TableCell><RankDisplay rank={rank} /></TableCell>
                        <TableCell>
                          {user.username ? (
                            <Link href={`/${encodeURIComponent(user.username)}`} className="group inline-flex items-center gap-1.5 font-semibold hover:text-violet-600 dark:hover:text-violet-300">
                              <span>{user.fullname || user.username}</span>
                              <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-70" />
                            </Link>
                          ) : (
                            <span className="font-semibold">{user.fullname || "Unknown player"}</span>
                          )}
                          {rank <= 3 && (
                            <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
                              {rank === 1 ? "Top player" : rank === 2 ? "Runner-up" : "Third place"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{toNonNegativeNumber(user.testAttempted)}</TableCell>
                        <TableCell className="text-right font-bold tabular-nums text-violet-700 dark:text-violet-300">
                          {toNonNegativeNumber(user.topSpeed)} <span className="text-xs font-medium text-muted-foreground">WPM</span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : !error && !loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-white/15">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                <Users className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-semibold">No scores yet</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                The leaderboard is connected, but no player scores were returned. Complete a typing test and save a result to start building the rankings.
              </p>
              <Button asChild className="mt-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90">
                <Link href="/playground">Take a typing test</Link>
              </Button>
            </div>
          ) : null}

          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Medal className="h-4 w-4" />
            <span>Rankings use the top speed returned by the server. Scores are not fabricated.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

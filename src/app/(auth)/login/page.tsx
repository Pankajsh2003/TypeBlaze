
'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useStore'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginResponse {
  message: string
  success: boolean
  user: {
    id: string
    name: string
    email: string
    isPremium: boolean
    token: string
  }
  token: string
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Read actual form values, including browser-autofilled values.
    const formData = new FormData(e.currentTarget)
    const email = String(formData.get('email') ?? '')
      .trim()
      .toLowerCase()
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
      toast.error('Please enter your email and password.')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post<LoginResponse>('/api/login', {
        email,
        password,
      })

      const userData = response.data?.user

      if (!response.data?.success || !userData) {
        toast.error(response.data?.message || 'Login failed.')
        return
      }

      login(userData)
      toast.success('Logged in successfully')
      router.push('/playground')
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || 'Failed to log in. Please try again.'
        : 'Failed to log in. Please try again.'

      console.error('Login request failed:', message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background">
      <div className="w-full max-w-md space-y-8 p-10 bg-white dark:bg-black rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-600 mt-2">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-white hover:bg-blue-600 bg-blue-500"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  )
}

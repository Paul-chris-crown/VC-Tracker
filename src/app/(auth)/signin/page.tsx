'use client'

import { useState, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Github, Chrome, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/app'

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('email', {
        email,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Failed to send magic link')
      } else {
        setIsEmailSent(true)
        toast.success('Magic link sent! Check the console for the link.')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      const result = await signIn(provider, { 
        callbackUrl,
        redirect: false 
      })
      
      if (result?.error) {
        toast.error(`Failed to sign in with ${provider}. Please check your credentials.`)
        setIsLoading(false)
      }
    } catch (error) {
      toast.error('Failed to sign in')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">VC Tracker</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEmailSent ? (
              <>
                {/* Email Sign-in (Primary) */}
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending magic link...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Continue with Email</span>
                      </div>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* OAuth Providers */}
                <div className="grid grid-cols-2 gap-4">
                  {process.env.NODE_ENV === 'development' && (
                    <>
                      {process.env.GOOGLE_CLIENT_ID && (
                        <Button
                          variant="outline"
                          onClick={() => handleOAuthSignIn('google')}
                          disabled={isLoading}
                          className="w-full"
                        >
                          <Chrome className="h-4 w-4 mr-2" />
                          Google
                        </Button>
                      )}
                      {process.env.GITHUB_CLIENT_ID && (
                        <Button
                          variant="outline"
                          onClick={() => handleOAuthSignIn('github')}
                          disabled={isLoading}
                          className="w-full"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
                  <p className="text-gray-600 mt-1">
                    We've sent a magic link to <strong>{email}</strong>
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Click the link in your email to sign in. The link will expire in 10 minutes.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsEmailSent(false)}
                  className="w-full"
                >
                  Try a different email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}

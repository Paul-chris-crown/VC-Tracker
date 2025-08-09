'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Github, Chrome, ArrowLeft, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    organizationName: '',
    organizationSlug: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('email', {
        email: formData.email,
        callbackUrl: '/app',
        redirect: false,
      })

      if (result?.error) {
        toast.error('Failed to send magic link')
      } else {
        setIsEmailSent(true)
        toast.success('Magic link sent to your email!')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: '/app' })
    } catch (error) {
      toast.error('Failed to sign up')
      setIsLoading(false)
    }
  }

  const handleNextStep = () => {
    if (step === 1 && formData.email && formData.name) {
      setStep(2)
    }
  }

  const handleBackStep = () => {
    if (step === 2) {
      setStep(1)
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
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-600 mt-2">Get started with VC Tracker</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              {step === 1 ? 'Create your account' : 'Set up your organization'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEmailSent ? (
              <>
                {step === 1 ? (
                  <>
                    {/* OAuth Buttons */}
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOAuthSignUp('google')}
                        disabled={isLoading}
                      >
                        <Chrome className="h-4 w-4 mr-2" />
                        Continue with Google
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOAuthSignUp('github')}
                        disabled={isLoading}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Continue with GitHub
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        <Mail className="h-4 w-4 mr-2" />
                        {isLoading ? 'Sending...' : 'Send magic link'}
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    {/* Organization Setup */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="organizationName">Organization name</Label>
                        <Input
                          id="organizationName"
                          type="text"
                          placeholder="Enter organization name"
                          value={formData.organizationName}
                          onChange={(e) => handleInputChange('organizationName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organizationSlug">Organization URL</Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">vctracker.com/</span>
                          <Input
                            id="organizationSlug"
                            type="text"
                            placeholder="your-org"
                            value={formData.organizationSlug}
                            onChange={(e) => handleInputChange('organizationSlug', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={handleBackStep}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleNextStep}
                          className="flex-1"
                          disabled={!formData.organizationName || !formData.organizationSlug}
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Create Organization
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
                  <p className="text-gray-600 mt-2">
                    We've sent a magic link to <strong>{formData.email}</strong>
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEmailSent(false)}
                  className="w-full"
                >
                  Try a different email
                </Button>
              </div>
            )}

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

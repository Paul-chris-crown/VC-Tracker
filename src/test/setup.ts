import '@testing-library/jest-dom'

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
    },
    status: 'authenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Pusher
jest.mock('pusher-js', () => ({
  default: jest.fn().mockImplementation(() => ({
    subscribe: jest.fn().mockReturnValue({
      bind: jest.fn(),
      unbind: jest.fn(),
    }),
    unsubscribe: jest.fn(),
    disconnect: jest.fn(),
  })),
}))

// Mock UploadThing
jest.mock('@uploadthing/react', () => ({
  useUploadThing: () => ({
    startUpload: jest.fn(),
    isUploading: false,
  }),
  generateComponents: () => ({
    UploadButton: () => null,
    UploadDropzone: () => null,
  }),
}))

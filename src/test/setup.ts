import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock NextAuth
vi.mock('next-auth/react', () => ({
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
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Pusher
vi.mock('pusher-js', () => ({
  default: vi.fn().mockImplementation(() => ({
    subscribe: vi.fn().mockReturnValue({
      bind: vi.fn(),
      unbind: vi.fn(),
    }),
    unsubscribe: vi.fn(),
    disconnect: vi.fn(),
  })),
}))

// Mock UploadThing
vi.mock('@uploadthing/react', () => ({
  useUploadThing: () => ({
    startUpload: vi.fn(),
    isUploading: false,
  }),
  generateComponents: () => ({
    UploadButton: () => null,
    UploadDropzone: () => null,
  }),
}))

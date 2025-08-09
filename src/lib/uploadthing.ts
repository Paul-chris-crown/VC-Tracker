import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "./auth"
import { prisma } from "./prisma"

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
    }),

  fileUploader: f({ 
    pdf: { maxFileSize: "4MB" },
    text: { maxFileSize: "4MB" },
    image: { maxFileSize: "4MB" },
    video: { maxFileSize: "512MB" },
    audio: { maxFileSize: "256MB" },
  })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter

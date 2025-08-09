import Pusher from 'pusher'
import PusherClient from 'pusher-js'

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})

export const pusherClient = new PusherClient(process.env.PUSHER_KEY!, {
  cluster: process.env.PUSHER_CLUSTER!,
})

export const CHANNELS = {
  ORGANIZATION: (orgId: string) => `org:${orgId}`,
  PROJECT: (projectId: string) => `project:${projectId}`,
  TASK: (taskId: string) => `task:${taskId}`,
  USER: (userId: string) => `user:${userId}`,
} as const

export const EVENTS = {
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_MOVED: 'task:moved',
  COMMENT_CREATED: 'comment:created',
  COMMENT_UPDATED: 'comment:updated',
  COMMENT_DELETED: 'comment:deleted',
  TIME_ENTRY_STARTED: 'time:started',
  TIME_ENTRY_STOPPED: 'time:stopped',
  NOTIFICATION_CREATED: 'notification:created',
  USER_PRESENCE: 'user:presence',
  USER_JOINED: 'user:joined',
  USER_LEFT: 'user:left',
} as const

export async function broadcastToProject(projectId: string, event: string, data: any) {
  await pusher.trigger(CHANNELS.PROJECT(projectId), event, data)
}

export async function broadcastToOrganization(orgId: string, event: string, data: any) {
  await pusher.trigger(CHANNELS.ORGANIZATION(orgId), event, data)
}

export async function broadcastToUser(userId: string, event: string, data: any) {
  await pusher.trigger(CHANNELS.USER(userId), event, data)
}

export async function broadcastToTask(taskId: string, event: string, data: any) {
  await pusher.trigger(CHANNELS.TASK(taskId), event, data)
}

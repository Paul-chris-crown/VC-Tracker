import { PrismaClient, Status, Priority, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Demo Organization',
      slug: 'demo',
      logo: 'https://via.placeholder.com/150',
    },
  })

  console.log('✅ Created organization:', organization.name)

  // Create demo users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@demo.com',
        name: 'John Doe',
        image: 'https://via.placeholder.com/150',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane@demo.com',
        name: 'Jane Smith',
        image: 'https://via.placeholder.com/150',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike@demo.com',
        name: 'Mike Johnson',
        image: 'https://via.placeholder.com/150',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah@demo.com',
        name: 'Sarah Wilson',
        image: 'https://via.placeholder.com/150',
      },
    }),
  ])

  console.log('✅ Created users:', users.length)

  // Create memberships
  const memberships = await Promise.all([
    prisma.membership.create({
      data: {
        userId: users[0].id,
        organizationId: organization.id,
        role: Role.OWNER,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[1].id,
        organizationId: organization.id,
        role: Role.ADMIN,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[2].id,
        organizationId: organization.id,
        role: Role.MANAGER,
      },
    }),
    prisma.membership.create({
      data: {
        userId: users[3].id,
        organizationId: organization.id,
        role: Role.MEMBER,
      },
    }),
  ])

  console.log('✅ Created memberships:', memberships.length)

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({
      data: {
        name: 'Bug',
        color: '#ef4444',
        organizationId: organization.id,
      },
    }),
    prisma.label.create({
      data: {
        name: 'Feature',
        color: '#3b82f6',
        organizationId: organization.id,
      },
    }),
    prisma.label.create({
      data: {
        name: 'Documentation',
        color: '#10b981',
        organizationId: organization.id,
      },
    }),
    prisma.label.create({
      data: {
        name: 'Design',
        color: '#f59e0b',
        organizationId: organization.id,
      },
    }),
  ])

  console.log('✅ Created labels:', labels.length)

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Website Redesign',
        key: 'WR',
        description: 'Complete redesign of the company website with modern UI/UX',
        organizationId: organization.id,
        leadId: users[0].id,
        status: Status.IN_PROGRESS,
        priority: Priority.HIGH,
        budgetCents: 2500000, // $25,000
        startDate: new Date('2024-01-01'),
        dueDate: new Date('2024-03-15'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Mobile App Development',
        key: 'MAD',
        description: 'iOS and Android app for customer engagement',
        organizationId: organization.id,
        leadId: users[1].id,
        status: Status.TODO,
        priority: Priority.URGENT,
        budgetCents: 5000000, // $50,000
        startDate: new Date('2024-02-01'),
        dueDate: new Date('2024-06-30'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Database Migration',
        key: 'DM',
        description: 'Migrate legacy database to cloud infrastructure',
        organizationId: organization.id,
        leadId: users[2].id,
        status: Status.DONE,
        priority: Priority.MEDIUM,
        budgetCents: 1000000, // $10,000
        startDate: new Date('2024-01-01'),
        dueDate: new Date('2024-01-20'),
      },
    }),
  ])

  console.log('✅ Created projects:', projects.length)

  // Create epics
  const epics = await Promise.all([
    prisma.epic.create({
      data: {
        name: 'Frontend Development',
        projectId: projects[0].id,
      },
    }),
    prisma.epic.create({
      data: {
        name: 'Backend API',
        projectId: projects[0].id,
      },
    }),
    prisma.epic.create({
      data: {
        name: 'UI/UX Design',
        projectId: projects[1].id,
      },
    }),
    prisma.epic.create({
      data: {
        name: 'iOS Development',
        projectId: projects[1].id,
      },
    }),
  ])

  console.log('✅ Created epics:', epics.length)

  // Create tasks
  const tasks = await Promise.all([
    // Website Redesign tasks
    prisma.task.create({
      data: {
        title: 'Design homepage layout',
        description: 'Create wireframes and mockups for the new homepage',
        status: Status.DONE,
        priority: Priority.HIGH,
        points: 5,
        projectId: projects[0].id,
        epicId: epics[0].id,
        createdById: users[0].id,
        orderIndex: 0,
        assignees: {
          create: [{ userId: users[1].id }],
        },
        labels: {
          create: [{ labelId: labels[3].id }], // Design
        },
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement responsive navigation',
        description: 'Build the main navigation component with mobile responsiveness',
        status: Status.IN_PROGRESS,
        priority: Priority.HIGH,
        points: 8,
        projectId: projects[0].id,
        epicId: epics[0].id,
        createdById: users[0].id,
        orderIndex: 1,
        assignees: {
          create: [{ userId: users[1].id }],
        },
        labels: {
          create: [{ labelId: labels[1].id }], // Feature
        },
      },
    }),
    prisma.task.create({
      data: {
        title: 'Fix mobile menu bug',
        description: 'Menu doesn\'t close properly on mobile devices',
        status: Status.TODO,
        priority: Priority.MEDIUM,
        points: 3,
        projectId: projects[0].id,
        epicId: epics[0].id,
        createdById: users[0].id,
        orderIndex: 2,
        assignees: {
          create: [{ userId: users[2].id }],
        },
        labels: {
          create: [{ labelId: labels[0].id }], // Bug
        },
      },
    }),
    prisma.task.create({
      data: {
        title: 'Set up API endpoints',
        description: 'Create REST API endpoints for user authentication',
        status: Status.IN_PROGRESS,
        priority: Priority.HIGH,
        points: 13,
        projectId: projects[0].id,
        epicId: epics[1].id,
        createdById: users[0].id,
        orderIndex: 3,
        assignees: {
          create: [{ userId: users[2].id }],
        },
        labels: {
          create: [{ labelId: labels[1].id }], // Feature
        },
      },
    }),
    // Mobile App tasks
    prisma.task.create({
      data: {
        title: 'Design app wireframes',
        description: 'Create wireframes for all app screens',
        status: Status.TODO,
        priority: Priority.URGENT,
        points: 8,
        projectId: projects[1].id,
        epicId: epics[2].id,
        createdById: users[1].id,
        orderIndex: 4,
        assignees: {
          create: [{ userId: users[3].id }],
        },
        labels: {
          create: [{ labelId: labels[3].id }], // Design
        },
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement user authentication',
        description: 'Add login and registration functionality to the app',
        status: Status.TODO,
        priority: Priority.HIGH,
        points: 13,
        projectId: projects[1].id,
        epicId: epics[3].id,
        createdById: users[1].id,
        orderIndex: 5,
        assignees: {
          create: [{ userId: users[0].id }],
        },
        labels: {
          create: [{ labelId: labels[1].id }], // Feature
        },
      },
    }),
    // Database Migration tasks
    prisma.task.create({
      data: {
        title: 'Backup existing database',
        description: 'Create full backup of current database before migration',
        status: Status.DONE,
        priority: Priority.HIGH,
        points: 5,
        projectId: projects[2].id,
        createdById: users[2].id,
        orderIndex: 6,
        assignees: {
          create: [{ userId: users[2].id }],
        },
        labels: {
          create: [{ labelId: labels[2].id }], // Documentation
        },
      },
    }),
    prisma.task.create({
      data: {
        title: 'Migrate user data',
        description: 'Transfer user accounts and profiles to new database',
        status: Status.DONE,
        priority: Priority.HIGH,
        points: 8,
        projectId: projects[2].id,
        createdById: users[2].id,
        orderIndex: 7,
        assignees: {
          create: [{ userId: users[2].id }],
        },
        labels: {
          create: [{ labelId: labels[1].id }], // Feature
        },
      },
    }),
  ])

  console.log('✅ Created tasks:', tasks.length)

  // Create comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        body: 'Great work on the design! The layout looks much cleaner now.',
        taskId: tasks[0].id,
        authorId: users[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        body: 'I\'ve started working on the responsive navigation. Should be ready for review by Friday.',
        taskId: tasks[1].id,
        authorId: users[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        body: 'The mobile menu issue has been identified. It\'s related to the touch event handling.',
        taskId: tasks[2].id,
        authorId: users[2].id,
      },
    }),
  ])

  console.log('✅ Created comments:', comments.length)

  // Create time entries
  const timeEntries = await Promise.all([
    prisma.timeEntry.create({
      data: {
        taskId: tasks[0].id,
        userId: users[1].id,
        startedAt: new Date('2024-01-15T09:00:00Z'),
        endedAt: new Date('2024-01-15T17:00:00Z'),
        seconds: 28800, // 8 hours
        billable: true,
        rateCents: 7500, // $75/hour
      },
    }),
    prisma.timeEntry.create({
      data: {
        taskId: tasks[1].id,
        userId: users[1].id,
        startedAt: new Date('2024-01-16T09:00:00Z'),
        endedAt: new Date('2024-01-16T15:30:00Z'),
        seconds: 23400, // 6.5 hours
        billable: true,
        rateCents: 7500, // $75/hour
      },
    }),
    prisma.timeEntry.create({
      data: {
        taskId: tasks[3].id,
        userId: users[2].id,
        startedAt: new Date('2024-01-17T10:00:00Z'),
        endedAt: new Date('2024-01-17T18:00:00Z'),
        seconds: 28800, // 8 hours
        billable: true,
        rateCents: 8000, // $80/hour
      },
    }),
  ])

  console.log('✅ Created time entries:', timeEntries.length)

  // Create activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        type: 'TASK_CREATED',
        meta: { taskId: tasks[0].id, taskTitle: tasks[0].title },
        projectId: projects[0].id,
        taskId: tasks[0].id,
        actorId: users[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'TASK_ASSIGNED',
        meta: { taskId: tasks[1].id, assigneeId: users[1].id },
        projectId: projects[0].id,
        taskId: tasks[1].id,
        actorId: users[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'COMMENT_ADDED',
        meta: { taskId: tasks[0].id, commentId: comments[0].id },
        projectId: projects[0].id,
        taskId: tasks[0].id,
        actorId: users[1].id,
      },
    }),
  ])

  console.log('✅ Created activities:', activities.length)

  // Create notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[1].id,
        title: 'Task assigned to you',
        body: 'You have been assigned to "Implement responsive navigation"',
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[2].id,
        title: 'New comment on task',
        body: 'John Doe commented on "Fix mobile menu bug"',
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[3].id,
        title: 'Project deadline approaching',
        body: 'Mobile App Development is due in 30 days',
      },
    }),
  ])

  console.log('✅ Created notifications:', notifications.length)

  console.log('🎉 Database seeding completed successfully!')
  console.log('\nDemo data created:')
  console.log(`- Organization: ${organization.name} (${organization.slug})`)
  console.log(`- Users: ${users.length}`)
  console.log(`- Projects: ${projects.length}`)
  console.log(`- Tasks: ${tasks.length}`)
  console.log(`- Comments: ${comments.length}`)
  console.log(`- Time entries: ${timeEntries.length}`)
  console.log(`- Activities: ${activities.length}`)
  console.log(`- Notifications: ${notifications.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

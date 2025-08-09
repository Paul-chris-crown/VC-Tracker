import { redirect } from 'next/navigation'

interface OrgPageProps {
  params: Promise<{ org: string }>
}

export default async function OrgPage({ params }: OrgPageProps) {
  const { org } = await params
  redirect(`/app/${org}/portfolio`)
}

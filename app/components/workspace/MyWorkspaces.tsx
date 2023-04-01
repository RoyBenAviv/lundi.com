'use client'

import { useGetWorkspaces } from '@/app/hooks/useQuery'
import Link from 'next/link'

export default function MyWorkspaces() {
  const { data, isLoading } = useGetWorkspaces()


  if(isLoading) return <div>LOADING</div>
  return (
    <ul>
      {data.map((workspace: Workspace) => (
        <li key={workspace.id}>
          <Link href={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
        </li>
      ))}
    </ul>
  )
}

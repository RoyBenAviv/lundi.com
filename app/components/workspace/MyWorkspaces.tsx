'use client'

import { useGetWorkspaces } from '@/app/hooks/useQuery'
import Link from 'next/link'

export default function MyWorkspaces({ workspaces }: { workspaces: Workspace[] }) {
  const { data } = useGetWorkspaces(workspaces)

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

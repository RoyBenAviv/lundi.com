'use client'

import { useGetWorkspaces, useUpdateWorkspace } from '@/app/hooks/useQuery'
import Link from 'next/link'

export default function MyWorkspaces() {
  const { data, isLoading } = useGetWorkspaces()
  const { mutate: updateMutate } = useUpdateWorkspace()

  const onAddRecentVisited = (workspace: Workspace) => {
    updateMutate({ workspaceId: workspace.id!, value: new Date(), key: 'recentlyVisited' })
  }

  if (isLoading) return <div>LOADING</div>
  return (
    <ul>
      {data.map((workspace: Workspace) => (
        <li key={workspace.id}>
          <Link onClick={() => onAddRecentVisited(workspace)} href={`/workspaces/${workspace.id}`}>
            {workspace.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

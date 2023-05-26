'use client'

import { useGetWorkspaces, useUpdateWorkspace } from '@/app/hooks/useQuery'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MyWorkspaces() {

  const router = useRouter()

  const { data: workspaces, isLoading } = useGetWorkspaces()
  const { mutate: updateMutate } = useUpdateWorkspace()

  const onNavigateWorkspace = (workspace: Workspace) => {
    updateMutate({ workspaceId: workspace.id!, value: new Date(), key: 'recentlyVisited' })
    router.push(`/workspaces/${workspace.id}`)
  }

  if (isLoading) return <div>LOADING</div>
  return (
    <section className="my-workspaces">
      <h2>My Workspaces</h2>
      <ul>
        {!!workspaces?.length && workspaces.map((workspace: Workspace) => (
  
          <li onClick={() => onNavigateWorkspace(workspace)} key={workspace.id}>
            <div style={{ backgroundColor: workspace.color }} className='workspace-icon'>{workspace.name[0]}</div>
              {workspace.name}
          </li>
        ))}
      </ul>
    </section>
  )
}

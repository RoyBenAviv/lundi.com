'use client'

import { useGetWorkspaces } from '@/app/hooks/useQuery'
import Link from 'next/link'

export default function MyWorkspaces({ workspaces }: any) {
  const { data } = useGetWorkspaces(workspaces)
  console.log('file: MyWorkspaces.tsx:8 -> data:', data)

  
  return (
    <ul>
      {data.map((workspace: any) => (
        <li key={workspace.id}>
          <Link href={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
        </li>
      ))}
    </ul>
  )
}

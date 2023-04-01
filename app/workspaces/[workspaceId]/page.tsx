import WorkspaceHome from '@/app/components/workspace/WorkspaceHome'
import WorkspaceNav from '@/app/components/workspace/WorkspaceNav'
import Loading from './Loading'
import { Suspense } from 'react'
import axios from 'axios'

type URL = {
  params: {
    workspaceId: string
  }
  searchParams: string
}

const getWorkspace = async (workspaceId: string) => {
  try {
    const currentWorkspace = await axios.get(`http://localhost:3000/api/workspaces/${workspaceId}`)
    console.log('file: page.tsx:17 -> currentWorkspace:', currentWorkspace)
    return currentWorkspace.data
  } catch (err) {
    console.log('file: page.tsx:16 -> err:', err)
  }
}

export default async function WorkspaceMain(url: URL) {
  const workspaceId = url.params.workspaceId
  const currentWorkspace = await getWorkspace(workspaceId)
  console.log('file: page.tsx:25 -> currentWorkspace:', currentWorkspace)

  return (
    <Suspense fallback={<Loading />}>
      <WorkspaceNav workspace={currentWorkspace} />
      <WorkspaceHome workspace={currentWorkspace} />
    </Suspense>
  )
}

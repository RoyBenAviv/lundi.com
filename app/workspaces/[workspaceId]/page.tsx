import Workspace from '@/app/components/workspace/Workspace'
import { getWorkspace } from '@/app/services/appService'

type URL = {
  params: {
    workspaceId: string
  }
  searchParams: string
}


export default async function WorkspaceMain(url: URL) {
  const currentWorkspace = await getWorkspace(url.params.workspaceId)

  return <Workspace currentWorkspace={currentWorkspace} />
}

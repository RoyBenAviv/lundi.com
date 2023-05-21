import WorkspaceHome from '@/app/components/workspace/WorkspaceHome'
import WorkspaceNav from '@/app/components/workspace/WorkspaceNav'
import { getWorkspace } from '@/app/services/appService'
import getQueryClient from '@/app/util/getQueryClient'
import { dehydrate } from '@tanstack/query-core'
import Hydrate from '@/app/util/HydrateClient'

type URL = {
  params: {
    workspaceId: string
  }
  searchParams: string
}

export default async function WorkspaceMain(url: URL) {
  const workspaceId = url.params.workspaceId
  // const currentWorkspace = await getWorkspace(url.params.workspaceId)
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['workspace', workspaceId], async () => await getWorkspace(workspaceId))
  const dehydratedState = dehydrate(queryClient)
  console.log('file: page.tsx:21 -> dehydratedState:', dehydratedState)

const workspace = dehydratedState.queries[0].state.data as Workspace
console.log('file: page.tsx:24 -> workspace:', workspace)

  return (
    <Hydrate state={dehydratedState}>
      <WorkspaceNav workspace={workspace} />
      <WorkspaceHome workspace={workspace} />
    </Hydrate>
  )
}

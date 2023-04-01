import BoardHome from "@/app/components/board/BoardHome"
import WorkspaceNav from "@/app/components/workspace/WorkspaceNav"
import { getWorkspace } from "@/app/services/appService"
import getQueryClient from "@/app/util/getQueryClient"
import Hydrate from "@/app/util/HydrateClient"
import { dehydrate, DehydratedState } from "@tanstack/query-core"

type URL = {
  params: {
    workspaceId: string
    boardId: string
  }
  searchParams: string
}



export default async function Boards(url: URL) {
  const boardId = url.params.boardId
  const workspaceId = url.params.workspaceId
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['workspace', workspaceId], async () => await getWorkspace(workspaceId))
  const dehydratedState: DehydratedState = dehydrate(queryClient)


    const workspace = dehydratedState.queries[0].state.data as Workspace
    console.log('file: page.tsx:27 -> workspace:', workspace)

    const currentBoard = workspace.boards!.find((board: Board) => board.id === boardId)


  return (
    <>
    <Hydrate state={dehydratedState}>
      <WorkspaceNav workspace={workspace} boardId={boardId}/>
    </Hydrate>
     <BoardHome board={currentBoard!}/>
    </>
      
  )
}

import BoardHome from "@/app/components/board/BoardHome"
import WorkspaceNav from "@/app/components/workspace/WorkspaceNav"
import { getWorkspace } from "@/app/services/appService"
import getQueryClient from "@/app/util/getQueryClient"
import Hydrate from "@/app/util/HydrateClient"
import { dehydrate } from "@tanstack/query-core"

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
  const dehydratedState = dehydrate(queryClient)
  console.log('file: page.tsx:27 -> dehydratedState:', dehydratedState)


    const workspace: any = dehydratedState.queries[0].state.data
    console.log('file: page.tsx:28 -> test:', workspace)

    const currentBoard = workspace.boards.find((board: Board) => board.id === boardId)


  return (
    <>
    <Hydrate state={dehydratedState}>
      <WorkspaceNav workspaceId={workspaceId} boardId={boardId}/>
    </Hydrate>
     <BoardHome board={currentBoard}/>
    </>
      
  )
}

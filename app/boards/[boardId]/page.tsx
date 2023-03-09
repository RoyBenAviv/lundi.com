import WorkspaceNav from "@/app/components/workspace/WorkspaceNav"
import { getWorkspace } from "@/app/services/appService"
import getQueryClient from "@/app/util/getQueryClient"
import Hydrate from "@/app/util/HydrateClient"
import { dehydrate } from "@tanstack/query-core"
import axios from "axios"

type URL = {
  params: {
    boardId: string
  }
  searchParams: string
}

const getBoard = async (boardId: string) => {
  try {
    const currentBoard = await axios.get(`http://localhost:3000/api/boards/${boardId}`)
    return currentBoard.data
  } catch (err) {
    console.log('file: page.tsx:16 -> err:', err)
  }
}

export default async function Boards(url: URL) {

  const boardId = url.params.boardId
  const currentBoard = await getBoard(boardId)
  console.log('file: page.tsx:28 -> currentBoard:', currentBoard)

  // const currentWorkspace = await getWorkspace(url.params.workspaceId)
  // await queryClient.prefetchQuery(['board', boardId], async () => await getBoard(boardId))
  // const dehydratedStateBoard: any = dehydrate(queryClient)
  // const workspaceId: any = dehydratedStateBoard.queries[0].state.data.workspaceId


  return (
    <>
    {/* <Hydrate state={dehydratedStateWorkspace}> */}
      <WorkspaceNav workspaceId={currentBoard.workspaceId} initialData={currentBoard.Workspace}/>
    {/* </Hydrate> */}
      {boardId}
    </>
      
  )
}

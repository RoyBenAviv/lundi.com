import WorkspaceNav from "@/app/components/workspace/WorkspaceNav"
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
  const currentBoard = await getBoard(url.params.boardId)

  return (
    <>
      <WorkspaceNav currentWorkspace={currentBoard.Workspace} />
      {url.params.boardId}
    </>
  )
}

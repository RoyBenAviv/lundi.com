import axios from 'axios'

export const getWorkspace = async (workspaceId: string) => {
  try {
    const currentWorkspace = await axios.get(`${process.env.BASE_URL}/api/workspaces/${workspaceId}`)
    return currentWorkspace.data
  } catch (err) {
  console.log('file: appService.tsx:8 -> err:', err)
  }
}

export const getWorkspaces = async () => {
  try {
    const workspaces = await axios.get(`${process.env.BASE_URL}/api/workspaces`)
    return workspaces.data
  } catch (err) {
    console.log('file: page.tsx:6 -> err:', err)
  }
}

export const getBoard = async (boardId: string) => {
  try {
    const currentBoard = await axios.get(`${process.env.BASE_URL}/api/boards/${boardId}`)
    return currentBoard.data
  } catch (err) {
    console.log('file: page.tsx:16 -> err:', err)
  }
}

export async function getRecentlyVisitedBoards() {
  try {
  const res = await axios.get(`${process.env.BASE_URL}/api/boards`)
  console.log('file: page.tsx:240 -> res:', res)
  return res.data
} catch (err) {
  console.log('file: page.tsx:6 -> err:', err)
}
}
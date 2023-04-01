import axios from 'axios'

export const getWorkspace = async (workspaceId: string) => {
  try {
    const currentWorkspace = await axios.get(`http://localhost:3000/api/workspaces/${workspaceId}`)
    return currentWorkspace.data
  } catch (err) {
    console.log('file: page.tsx:16 -> err:', err)
  }
}

export const getWorkspaces = async () => {
  try {
    const workspaces = await axios.get(`http://localhost:3000/api/workspaces`)
    return workspaces.data
  } catch (err) {
    console.log('file: page.tsx:6 -> err:', err)
  }
}

export const getBoard = async (boardId: string) => {
  try {
    const currentBoard = await axios.get(`http://localhost:3000/api/boards/${boardId}`)
    return currentBoard.data
  } catch (err) {
    console.log('file: page.tsx:16 -> err:', err)
  }
}
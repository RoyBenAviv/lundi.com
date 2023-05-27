import axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://lundi-com-roybenaviv.vercel.app'


export const getWorkspace = async (workspaceId: string) => {
  try {
    const currentWorkspace = await axios.get(`${BASE_URL}/api/workspaces/${workspaceId}`)
    return currentWorkspace.data
  } catch (err) {
  console.log('file: appService.tsx:12 -> err:', err)
  }
}
export const getFirstWorkspaceId = async () => {
  try {
    const currentWorkspace = await axios.get(`${BASE_URL}/api/workspaces/first_workspace`)
    return currentWorkspace.data
  } catch (err) {
  console.log('file: appService.tsx:20 -> err:', err)
  }
}

export const getWorkspaces = async () => {
  try {
    const workspaces = await axios.get(`${BASE_URL}/api/workspaces`)
    return workspaces.data
  } catch (err) {
    console.log('file: page.tsx:3-> err:', err)
  }
}

export const getBoard = async (boardId: string) => {
  try {
    const currentBoard = await axios.get(`${BASE_URL}/api/boards/${boardId}`)
    return currentBoard.data
  } catch (err) {
    console.log('file: page.tsx:16 -> err:', err)
  }
}

export async function getRecentlyVisitedBoards() {
  try {
  const res = await axios.get(`${BASE_URL}/api/boards`)
  return res.data
} catch (err) {
  console.log('file: page.tsx:6 -> err:', err)
}
}
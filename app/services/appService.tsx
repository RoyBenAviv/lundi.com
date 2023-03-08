import axios from 'axios'

export const getWorkspace = async (workspaceId: string) => {
  try {
    const currentWorkspace = await axios.get(`http://localhost:3000/api/workspaces/${workspaceId}`)
    console.log('file: appService.tsx:7 -> currentWorkspace:', currentWorkspace)
    return currentWorkspace.data
  } catch (err) {
    console.log('file: page.tsx:16 -> err:', err)
  }
}

export const getWorkspaces = async () => {
  try {
    const workspaces = await axios.get(`http://localhost:3000/api/workspaces`)
    console.log('file: appService.tsx:17 -> workspaces:', workspaces)
    return workspaces.data
  } catch (err) {
    console.log('file: page.tsx:6 -> err:', err)
  }
}

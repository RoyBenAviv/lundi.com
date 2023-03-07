import WorkspaceNav from '../../components/workspace/WorkspaceNav'
import WorkspaceHome from '../../components/workspace/WorkspaceHome'
import axios from 'axios'
type URL = {
  params: {
    workspaceId: string
  }
  searchParams: string
}

const getWorkspace = async (workspaceId: string) => {
  try {
    const currentWorkspace = await axios.get(`http://localhost:3000/api/workspaces/${workspaceId}`)
    return currentWorkspace.data
  } catch (err) {
    console.log('file: page.tsx:16 -> err:', err)
  }
}

export default async function Workspaces(url: URL) {
  const currentWorkspace = await getWorkspace(url.params.workspaceId)

  return (
    <>
      <WorkspaceNav currentWorkspace={currentWorkspace} />
      <WorkspaceHome currentWorkspace={currentWorkspace}/>
    </>
  )
}

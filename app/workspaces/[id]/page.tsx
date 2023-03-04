'use client'

import { useGetWorkspace } from '@/app/hooks/useQuery'
import WorkspaceNav from '../../components/WorkspaceNav'
const Dropdown = require("monday-ui-react-core/dist/Dropdown");


type URL = {
  params: {
    id: string
  }
  searchParams: string
}

export default function Workspace(url: URL) {
  const { isLoading, data: workspace, isError } = useGetWorkspace(url.params.id)

  if (isLoading) return <></>
  return (
    <>
    {console.log('workspace6',workspace)}
    <WorkspaceNav boards={workspace!.data.boards}/>
    <section>


    </section>
    </>
  )
}

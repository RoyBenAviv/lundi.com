'use client'

import { useGetWorkspace } from '@/app/hooks/useQuery'
import {useState} from 'react'
import WorkspaceNav from '../../components/workspace/WorkspaceNav'
const Dropdown = require("monday-ui-react-core/dist/Dropdown");

type URL = {
  params: {
    id: string
  }
  searchParams: string
}

export default function Workspace(url: URL) {
  const { isLoading, data: workspace, isError } = useGetWorkspace(url.params.id)
  const [isCollapseNav, setIsCollapseNav] = useState<boolean>(false)

  const onCollapseNav = () => {
    setIsCollapseNav(isCollapseNav => !isCollapseNav)
  }

  if (isLoading) return <></>
  return (
    <>
    <WorkspaceNav workspace={workspace!.data} onCollapseNav={onCollapseNav} isCollapseNav={isCollapseNav}/>
    <section>


    </section>
    </>
  )
}

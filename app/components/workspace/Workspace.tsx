'use client'

import { useGetWorkspace } from "@/app/hooks/useQuery";
import WorkspaceHome from "./WorkspaceHome";
import WorkspaceNav from "./WorkspaceNav";



export default function Workspace({currentWorkspace}: any) {
    const {data: workspace} = useGetWorkspace(currentWorkspace)
  return (
    <>
      <WorkspaceNav currentWorkspace={workspace} />
      <WorkspaceHome currentWorkspace={workspace}/>
    </>
  )
}

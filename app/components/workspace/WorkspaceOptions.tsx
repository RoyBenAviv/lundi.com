'use client'

import { useGetWorkspaces } from '@/app/hooks/useQuery'
import { convertToDropDownOptions } from '@/app/services/utilService'
import { Button, DialogContentContainer } from 'monday-ui-react-core'
import { useRouter } from 'next/navigation'
const { Combobox } = require('monday-ui-react-core')
const { Add, Workspace } = require('monday-ui-react-core/icons')

const categories = {
  workspaces: {
    id: 'workspaces',
    label: 'My workspaces',
  },
}

export default function WorkspaceOptions({ currentWorkspaceId, onOpenAddNewWorkspace }: { currentWorkspaceId: string, onOpenAddNewWorkspace: any }) {
  const { data: workspaces, isLoading } = useGetWorkspaces()

  const router = useRouter()

  const navigateWorkspace = (option: DropDownOption) => {
    router.push(`/workspaces/${option.workspaceId}`)
  }

  return (
    <section className="workspace-combobox">
      <Combobox onClick={(option: DropDownOption) => navigateWorkspace(option)} placeholder="Search for a workspace" loading={isLoading} categories={categories} options={workspaces ? convertToDropDownOptions(workspaces) : []} />
      <hr />
      <div className="actions">
        <Button onClick={(event: React.MouseEvent) => onOpenAddNewWorkspace(event)} kind={Button.kinds?.TERTIARY} className="combobox-stories-styles_btn" leftIcon={Add}>
          Add workspace
        </Button>
      </div>
    </section>
  )
}

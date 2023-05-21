'use client'

import { useGetWorkspaces, useUpdateWorkspace } from '@/app/hooks/useQuery'
import { convertToDropDownOptions } from '@/app/services/utilService'
import { Button } from 'monday-ui-react-core'
import { useRouter } from 'next/navigation'
const { Combobox } = require('monday-ui-react-core')
const { Add } = require('monday-ui-react-core/icons')

const categories = {
  workspaces: {
    id: 'workspaces',
    label: 'My workspaces',
  },
}

export default function WorkspaceOptions({ currentWorkspaceId, onOpenAddNewWorkspace }: { currentWorkspaceId: string, onOpenAddNewWorkspace: Function }) {
  const { data: workspaces, isLoading } = useGetWorkspaces()
  const { mutate: updateMutate } = useUpdateWorkspace()
  const router = useRouter()

  const onNavigateWorkspace = (option: DropDownOption) => {
    updateMutate({ workspaceId: option.workspaceId!, value: new Date(), key: 'recentlyVisited' })
    router.push(`/workspaces/${option.workspaceId}`)
  }

  return (
    <>
      <Combobox autoFocus optionsListHeight={280} onClick={(option: DropDownOption) => onNavigateWorkspace(option)} placeholder="Search for a workspace" loading={isLoading} categories={categories} options={workspaces ? convertToDropDownOptions(workspaces) : []} />
      <hr />
      <div className="actions">
        <Button disabled={isLoading} onClick={(event: React.MouseEvent) => onOpenAddNewWorkspace(event)} kind={Button.kinds?.TERTIARY} className="combobox-stories-styles_btn" leftIcon={Add}>
          Add workspace
        </Button>
      </div>
    </>
  )
}

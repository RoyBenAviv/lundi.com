'use client'

import { useAddWorkspace, useGetWorkspace } from '@/app/hooks/useQuery'
import { Button, Flex, ModalContent } from 'monday-ui-react-core'
import Link from 'next/link'
import { ChangeEvent, useCallback, useState } from 'react'
import WorkspaceOptions from './WorkspaceOptions'
import { v4 as uuidv4 } from 'uuid'
const { Modal, Input } = require('monday-ui-react-core')
const { Board, Edit, Check, NavigationChevronLeft, NavigationChevronRight, Menu, NavigationChevronUp, NavigationChevronDown } = require('monday-ui-react-core/icons')
const colors = ['#fb275d', '#00ca72', '#a358d0', '#595ad4', '#1c1f3b', '#66ccff']

export default function WorkspaceNav({ workspaceId, initialData }: { workspaceId: string; initialData?: Workspace | null }) {
  const { data: currentWorkspace, isLoading } = useGetWorkspace(workspaceId, initialData!)

  const [isOpenEditIcon, setIsOpenEditIcon] = useState<boolean>(false)
  const [isCollapseNav, setIsCollapseNav] = useState<boolean>(false)
  const [isComboBoxOpen, setIsComboBoxOpen] = useState<boolean>(false)
  const [isOpenAddNewWorkspace, setIsOpenAddNewWorkspace] = useState<boolean>(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>('New workspace')
  const [newWorkspaceColor, setNewWorkspaceColor] = useState<string>('#00ca72')
  const { mutate: addWorkspaceMutate, isLoading: isLoadingNewWorkspace } = useAddWorkspace()
  const onOpenAddNewWorkspace = (event: React.MouseEvent) => {
    event.stopPropagation()

    setIsOpenAddNewWorkspace(true)
  }

  const openNavOnEnter = useCallback(() => {
    isCollapseNav &&
      setTimeout(() => {
        setIsCollapseNav(false)
      }, 500)
  }, [isCollapseNav])

  const onAddNewWorkspace = () => {
    const newWorkspace: Workspace = {
      name: newWorkspaceName,
      description: '',
      color: newWorkspaceColor,
    }
    addWorkspaceMutate(newWorkspace)
  }

  return (
    <nav onMouseEnter={() => openNavOnEnter()} className={`workspace-nav ${isCollapseNav ? 'close' : 'open'}`}>
      <button onClick={() => setIsCollapseNav((isCollapseNav) => !isCollapseNav)} className="collapse-btn">
        {isCollapseNav ? <NavigationChevronRight /> : <NavigationChevronLeft />}
      </button>
      {!isCollapseNav && (
        <>
          <header>
            <div className="options">
              <p className="mini-paragraph">Workspace</p> <Menu />
            </div>
            <section onClick={() => setIsComboBoxOpen((isComboBoxOpen) => !isComboBoxOpen)} className="workspace-choose" style={isComboBoxOpen ? { borderColor: '#0073ea' } : {}}>
              <div className="workspace-icon-name">
                <div className="workspace-icon" style={{ backgroundColor: currentWorkspace.color }}>
                  {currentWorkspace.name[0]}
                </div>
                {currentWorkspace.name}
              </div>
              {isComboBoxOpen ? <NavigationChevronUp className="arrow" /> : <NavigationChevronDown className="arrow" />}
              {isComboBoxOpen && <WorkspaceOptions currentWorkspaceId={currentWorkspace.id} onOpenAddNewWorkspace={onOpenAddNewWorkspace} />}
            </section>
          </header>
          <hr />
          <ul>
            {currentWorkspace.boards.map((board: Board) => (
              <li key={board.id}>
                <Link href={`/boards/${board.id}`}>
                  {<Board />} {board.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <Modal id="add-new-workspace" title="Add new workspace" show={isOpenAddNewWorkspace} onClose={() => setIsOpenAddNewWorkspace(false)}>
        <ModalContent>
          <div className="new-workspace-content">
            <div onClick={() => setIsOpenEditIcon((isOpenEditIcon) => !isOpenEditIcon)} style={{ backgroundColor: newWorkspaceColor }} className="workspace-icon">
              {newWorkspaceName[0]}
              <span>
                <Edit />
                Edit
              </span>
            </div>
            {isOpenEditIcon && (
              <div className="edit-workspace-icon">
                <p className="mini-paragraph">Background color</p>
                <div>
                  {colors.map((color) => (
                    <div onClick={() => setNewWorkspaceColor(color)} style={{ backgroundColor: color }} className="color-option" key={color}>
                      {color === newWorkspaceColor && <Check />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="mini-paragraph">Workspace name</p>
            <input value={newWorkspaceName} onChange={(event: ChangeEvent<HTMLInputElement>) => setNewWorkspaceName(event.target?.value)} placeholder="Choose a name for your workspace" className="new-workspace-name-input" type="text" />
            <Flex justify={Flex.justify?.END} gap={12}>
              <Button kind={Button.kinds?.TERTIARY}>Cancel</Button>
              <Button loading={isLoadingNewWorkspace} disabled={!newWorkspaceName} onClick={() => onAddNewWorkspace()}>
                Add workspace
              </Button>
            </Flex>
          </div>
        </ModalContent>
      </Modal>
    </nav>
  )
}

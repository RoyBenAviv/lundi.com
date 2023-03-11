'use client'

import { useAddWorkspace, useGetWorkspace, useSortBoards } from '@/app/hooks/useQuery'
import { Button, Flex, ModalContent, useClickOutside } from 'monday-ui-react-core'
import Link from 'next/link'
import { ChangeEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import WorkspaceOptions from './WorkspaceOptions'
import { ReactSortable } from 'react-sortablejs'
import useOnClickOutside from '@/app/hooks/useOnClickOutside'
import { CSSTransition } from 'react-transition-group'

const { Modal, Input } = require('monday-ui-react-core')
const { Board, Search, Add, Edit, Check, NavigationChevronLeft, NavigationChevronRight, Menu, NavigationChevronUp, NavigationChevronDown } = require('monday-ui-react-core/icons')
const colors = ['#fb275d', '#00ca72', '#a358d0', '#595ad4', '#1c1f3b', '#66ccff']
export default function WorkspaceNav({ workspaceId, initialData }: { workspaceId: string; initialData?: Workspace | null }) {
  const { data: currentWorkspace, isLoading } = useGetWorkspace(workspaceId, initialData!)

  const [isOpenEditIcon, setIsOpenEditIcon] = useState<boolean>(false)
  const [isCollapseNav, setIsCollapseNav] = useState<boolean>(false)
  const [isComboBoxOpen, setIsComboBoxOpen] = useState<boolean>(false)
  const [isOpenAddNewWorkspace, setIsOpenAddNewWorkspace] = useState<boolean>(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>('New workspace')
  const [newWorkspaceColor, setNewWorkspaceColor] = useState<string>('#00ca72')
  const [workspaceBoards, setWorkspaceBoards] = useState<Board[]>(currentWorkspace.boards.sort((board1: Board, board2: Board) => board1.order - board2.order))

  const { mutate: sortBoards } = useSortBoards()
  const { mutate: addWorkspaceMutate, isLoading: isLoadingNewWorkspace } = useAddWorkspace()

  const workspaceOptionsRef = useRef(null)
  useOnClickOutside(workspaceOptionsRef, () => setIsComboBoxOpen(false))

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

  const onSaveBoardsList = () => {
    console.log('workspaceBoards', workspaceBoards)
    const sortedBoards = workspaceBoards.map((board: Board, index: number) => ({
      ...board,
      order: index,
    }))
    console.log('file: WorkspaceNav.tsx:58 -> sortedBoards:', sortedBoards)

    // setWorkspaceBoards(sortedBoards)
    // sortBoards(sortedBoards)
  }
  const [timeoutId, setTimeoutId] = useState<any>(null)

  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId)

    const id = setTimeout(() => {
      onSortBoards(workspaceBoards)
    }, 2000)
    setTimeoutId(id)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceBoards])

  const onSortBoards = (workspaceBoards: any) => {
    console.log('workspaceBoards', workspaceBoards)
    const sortedBoards = workspaceBoards.map((board: Board, index: number) => ({
      id: board.id,
      order: index,
    }))
    console.log('file: WorkspaceNav.tsx:58 -> sortedBoards:', sortedBoards)

    sortBoards(sortedBoards)
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
            <section ref={workspaceOptionsRef} onClick={() => setIsComboBoxOpen((isComboBoxOpen) => !isComboBoxOpen)} className="workspace-choose" style={isComboBoxOpen ? { borderColor: '#0073ea' } : {}}>
              <div className="workspace-icon-name">
                <div className="workspace-icon" style={{ backgroundColor: currentWorkspace.color }}>
                  {currentWorkspace.name[0]}
                </div>
                {currentWorkspace.name}
              </div>
              {isComboBoxOpen ? <NavigationChevronUp className="arrow" /> : <NavigationChevronDown className="arrow" />}
              <CSSTransition timeout={150} in={isComboBoxOpen} classNames="container-transition">
                <>
              {isComboBoxOpen && (
                <section onClick={(e) => e.stopPropagation()} className="workspace-combobox">
                    <WorkspaceOptions currentWorkspaceId={currentWorkspace.id} onOpenAddNewWorkspace={onOpenAddNewWorkspace} />
                  </section>
              )}
              </>
              </CSSTransition>
            </section>
            <section className="board-actions">
              <ul>
                <li>
                  <Add /> <button>Add</button>
                </li>
                <li>
                  <Search />
                  <button>Search</button>
                </li>
              </ul>
            </section>
          </header>
          <hr />
          <div className="boards-list-container">
            {currentWorkspace.boards.length ? (
              <ReactSortable onEnd={() => onSaveBoardsList()} list={workspaceBoards} setList={setWorkspaceBoards} dragClass="drag-ghost" ghostClass="custom-placeholder" swapClass="custom-dragged-element" animation={300} className="boards-list">
                {workspaceBoards.map((board: Board) => (
                  <div key={board.id}>
                    <Link href={`/boards/${board.id}`}>
                      {<Board />} {board.name}
                    </Link>
                  </div>
                ))}
              </ReactSortable>
            ) : (
              <p className="no-boards">
                This workspace is empty.
                <br />
                Get started by adding boards.
              </p>
            )}
          </div>
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

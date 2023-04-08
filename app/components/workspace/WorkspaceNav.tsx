'use client'

import { useAddBoard, useAddWorkspace, useGetWorkspace, useSortBoards } from '@/app/hooks/useQuery'
import { Button, Flex, ModalContent, RadioButton } from 'monday-ui-react-core'
import Link from 'next/link'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import WorkspaceOptions from './WorkspaceOptions'
import { ReactSortable } from 'react-sortablejs'
import useOnClickOutside from '@/app/hooks/useOnClickOutside'
import { CSSTransition } from 'react-transition-group'
import { colors } from '@/app/services/utilService'
import { v4 as uuidv4 } from 'uuid'
const { Modal, Input } = require('monday-ui-react-core')
const { Board, Search, Add, Edit, Check, NavigationChevronLeft, NavigationChevronRight, Menu, NavigationChevronUp, NavigationChevronDown } = require('monday-ui-react-core/icons')

export default function WorkspaceNav({ workspace, boardId }: { workspace: Workspace; boardId?: string }) {
  const { data: currentWorkspace, isLoading } = useGetWorkspace(workspace)

  const [isOpenEditIcon, setIsOpenEditIcon] = useState<boolean>(false)
  const [isCollapseNav, setIsCollapseNav] = useState<boolean>(false)
  const [isComboBoxOpen, setIsComboBoxOpen] = useState<boolean>(false)

  const [workspaceBoards, setWorkspaceBoards] = useState<Board[]>(currentWorkspace.boards!.sort((board1: Board, board2: Board) => board1.order - board2.order))
  const [isOpenAddNewWorkspace, setIsOpenAddNewWorkspace] = useState<boolean>(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>('New workspace')
  const [newWorkspaceColor, setNewWorkspaceColor] = useState<string>('#00ca72')

  const [isOpenAddNewBoard, setIsOpenAddNewBoard] = useState<boolean>(false)
  const [newBoardName, setNewBoardName] = useState<string>('New Board')
  const [newBoardType, setNewBoardType] = useState<string>('Item')

  const { mutate: sortBoards } = useSortBoards()
  const { mutate: addWorkspaceMutate, isLoading: isLoadingNewWorkspace } = useAddWorkspace()
  const { mutate: addBoardMutate, isLoading: isLoadingNewBoard } = useAddBoard()

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
      id: uuidv4(),
      name: newWorkspaceName,
      description: '',
      color: newWorkspaceColor,
    }
    addWorkspaceMutate(newWorkspace)
  }

  const onAddNewBoard = () => {
    const newBoard: NewBoard = {
      id: uuidv4(),
      name: newBoardName,
      boardItemsType: newBoardType,
      workspaceId: currentWorkspace.id!,
      columns: [
        { id: uuidv4(), name: 'Text Column 1', columnType: 'text' },
        { id: uuidv4(), name: 'Text Column 2', columnType: 'text' },
      ],
      groups: [
        {
          name: 'Group 1',
          color: '#facc33',
          items: [
            { id: uuidv4(), name: `${newBoardType} 1`, order: 1 },
            { id: uuidv4(), name: `${newBoardType} 2`, order: 2 },
          ],
        },
        {
          name: 'Group 2',
          color: '#0073ea',
          items: [
            { id: uuidv4(), name: `${newBoardType} 3`, order: 3 },
            { id: uuidv4(), name: `${newBoardType} 4`, order: 4 },
          ],
        },
      ],
    }
    console.log('file: WorkspaceNav.tsx:91 -> newBoard:', newBoard)

    addBoardMutate(newBoard)
  }

  const [timeoutId, setTimeoutId] = useState<any>(null)

  useEffect(() => {
    if (workspaceBoards) {
      if (timeoutId) clearTimeout(timeoutId)

      const id = setTimeout(() => {
        onSortBoards(workspaceBoards)
      }, 1500)
      setTimeoutId(id)
      return () => clearTimeout(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceBoards])

  const onSortBoards = (workspaceBoards: Board[]) => {
    const sortedBoards = workspaceBoards.map((board: Board, index: number) => ({
      id: board.id,
      order: index,
    }))

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
                      <WorkspaceOptions currentWorkspaceId={currentWorkspace.id!} onOpenAddNewWorkspace={onOpenAddNewWorkspace} />
                    </section>
                  )}
                </>
              </CSSTransition>
            </section>
            <section className="board-actions">
              <ul>
                <li onClick={() => setIsOpenAddNewBoard(true)}>
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
            {currentWorkspace.boards!.length ? (
              <ReactSortable list={workspaceBoards} setList={setWorkspaceBoards} dragClass="drag-ghost" ghostClass="custom-placeholder" swapClass="custom-dragged-element" animation={300} className="boards-list">
                {workspaceBoards.map((board: Board) => (
                  <div className={boardId === board.id ? 'active' : ''} key={board.id}>
                    <Link href={`/workspaces/${currentWorkspace.id}/boards/${board.id}`}>
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
                  {colors.map((color: string) => (
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
      <Modal id="add-new-board" title="Create board" show={isOpenAddNewBoard} onClose={() => setIsOpenAddNewBoard(false)}>
        <ModalContent>
          <div className="new-board-content">
            <p className="mini-paragraph">Board name</p>
            <input value={newBoardName} onChange={(event: ChangeEvent<HTMLInputElement>) => setNewBoardName(event.target?.value)} placeholder="New Board Name" className="new-board-name-input" type="text" />
            <hr />
            <div>
              <p>{"Select what you're managing in this board"}</p>

              <div className="board-management">
                <div className="radio-container">
                  <RadioButton defaultChecked value="Item" onSelect={(e: ChangeEvent<HTMLInputElement | null>) => setNewBoardType(e.target.value)} name="radio-buttons-group" text="Item" />
                </div>
                <div className="radio-container">
                  <RadioButton value="Budgets" onSelect={(e: ChangeEvent<HTMLInputElement | null>) => setNewBoardType(e.target.value)} name="radio-buttons-group" text="Budgets" />
                </div>
                <div className="radio-container">
                  <RadioButton value="Employees" onSelect={(e: ChangeEvent<HTMLInputElement | null>) => setNewBoardType(e.target.value)} name="radio-buttons-group" text="Employees" />
                </div>
                <div className="radio-container">
                  <RadioButton value="Campaigns" onSelect={(e: ChangeEvent<HTMLInputElement | null>) => setNewBoardType(e.target.value)} name="radio-buttons-group" text="Campaigns" />
                </div>
                <div className="radio-container">
                  <RadioButton value="Leads" onSelect={(e: ChangeEvent<HTMLInputElement | null>) => setNewBoardType(e.target.value)} name="radio-buttons-group" text="Leads" />
                </div>
                <div className="radio-container">
                  <RadioButton value="Projects" onSelect={(e: ChangeEvent<HTMLInputElement | null>) => setNewBoardType(e.target.value)} name="radio-buttons-group" text="Projects" />
                </div>
                <div className="radio-container">
                  <RadioButton value="Creatives" onSelect={(e: ChangeEvent<HTMLInputElement | null>) => setNewBoardType(e.target.value)} name="radio-buttons-group" text="Creatives" />
                </div>
                <div className="radio-container">
                  <RadioButton value="Clients" onSelect={(e: ChangeEvent<HTMLInputElement | null>) => setNewBoardType(e.target.value)} name="radio-buttons-group" text="Clients" />
                </div>
                <div className="radio-container">
                  <RadioButton value="Tasks" onSelect={(e: ChangeEvent<HTMLInputElement | null>) => setNewBoardType(e.target.value)} name="radio-buttons-group" text="Tasks" />
                </div>
              </div>
            </div>

            <Flex justify={Flex.justify?.END} gap={12}>
              <Button kind={Button.kinds?.TERTIARY}>Cancel</Button>
              <Button loading={isLoadingNewBoard} disabled={!newBoardName} onClick={() => onAddNewBoard()}>
                Create Board
              </Button>
            </Flex>
          </div>
        </ModalContent>
      </Modal>
    </nav>
  )
}

'use client'

import { useAddBoard, useAddWorkspace, useGetWorkspace, useSortBoards, useUpdateBoard, useUpdateWorkspace } from '@/app/hooks/useQuery'
import { Button, Flex, ModalContent, RadioButton, TextField } from 'monday-ui-react-core'
import Link from 'next/link'
import { ChangeEvent, MutableRefObject, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import WorkspaceOptions from './WorkspaceOptions'
import { ReactSortable } from 'react-sortablejs'
import useOnClickOutside from '@/app/hooks/useOnClickOutside'
import { CSSTransition } from 'react-transition-group'
import { colors } from '@/app/services/utilService'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
const { Modal } = require('monday-ui-react-core')
const { Board, Search, Add, Edit, Check, NavigationChevronLeft, NavigationChevronRight, Menu, NavigationChevronUp, NavigationChevronDown } = require('monday-ui-react-core/icons')

export default function WorkspaceNav({ workspace, boardId }: { workspace: Workspace; boardId?: string }) {
  const { data: currentWorkspace, isLoading } = useGetWorkspace(workspace)
  const { mutate: updateMutateBoard } = useUpdateBoard()
  const { mutate: updateMutateWorkspace } = useUpdateWorkspace()

  const [isOpenEditIcon, setIsOpenEditIcon] = useState<boolean>(false)
  const [isCollapseNav, setIsCollapseNav] = useState<boolean>(false)
  const [isComboBoxOpen, setIsComboBoxOpen] = useState<boolean>(false)

  const [isOpenAddNewWorkspace, setIsOpenAddNewWorkspace] = useState<boolean>(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>('New workspace')
  const [newWorkspaceColor, setNewWorkspaceColor] = useState<string>('#00ca72')

  const [isOnSearch, setIsOnSearch] = useState<boolean>(false)
  const [isOpenAddNewBoard, setIsOpenAddNewBoard] = useState<boolean>(false)
  const [newBoardName, setNewBoardName] = useState<string>('New Board')
  const [newBoardType, setNewBoardType] = useState<string>('Item')

  const [searchBoard, setSearchBoard] = useState<string>('')

  const sortedBoards = useMemo(() => currentWorkspace?.boards?.sort((board1: Board, board2: Board) => board1.order - board2.order), [currentWorkspace.boards])
  const [workspaceBoards, setWorkspaceBoards] = useState<Board[]>(sortedBoards || [])

  useEffect(() => {
    const filteredBoards = sortedBoards!.filter((board: Board) => board.name.toLowerCase().includes(searchBoard.toLowerCase()))

    setWorkspaceBoards(filteredBoards)
  }, [searchBoard, currentWorkspace.boards, sortedBoards])

  const { mutate: sortBoards } = useSortBoards()
  const { mutate: addWorkspaceMutate, isLoading: isLoadingNewWorkspace } = useAddWorkspace()
  const { mutate: addBoardMutate, isLoading: isLoadingNewBoard } = useAddBoard()

  const workspaceOptionsRef = useRef<HTMLElement | null>(null)
  const searchBoardRef = useRef(null)
  const searchTextInput = useRef<HTMLInputElement>(null)
  useOnClickOutside(workspaceOptionsRef, () => setIsComboBoxOpen(false))
  useOnClickOutside(searchBoardRef, () => setIsOnSearch(false))

  const router = useRouter()

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
    // updateMutateWorkspace({ workspaceId: newWorkspace.id!, value: new Date(), key: 'recentlyVisited' })
  }

  const onNavigateBoard = (board: Board) => {
    router.push(`/workspaces/${board.workspaceId}/boards/${board.id}`)
    updateMutateBoard({ boardId: board.id!, value: new Date(), key: 'recentlyVisited' })
  }

  const onAddNewBoard = () => {
    const id = uuidv4()

    const newBoard: NewBoard = {
      id,
      name: newBoardName,
      boardItemsType: newBoardType,
      workspaceId: currentWorkspace.id!,
      columns: [
        { id: uuidv4(), name: 'Text', columnType: 'text', order: 1 },
        {
          id: uuidv4(),
          name: 'Status',
          columnType: 'status',
          options: [
            {
              name: '',
              type: 'default',
              color: '#c4c4c4',
            },
            {
              name: 'Stuck',
              color: '#e2445c',
            },
            {
              name: 'Working on it',
              color: '#fdab3d',
            },
            {
              name: 'Done',
              color: '#00c875',
            },
          ],
          order: 2
        },
        {
            id: uuidv4(),
            name: 'Date',
            columnType: 'date',
            order: 3
        },
      ],
      groups: [
        {
          name: 'Group 1',
          order: 0,
          color: '#facc33',
          items: [
            {
              id: uuidv4(),
              name: `${newBoardType} 1`,
              order: 1,
              columnValuesVal: [
                '',
                {
                  name: 'Working on it',
                  color: '#fdab3d',
                },
              ],
            },
            {
              id: uuidv4(),
              name: `${newBoardType} 2`,
              order: 2,
              columnValuesVal: [
                '',
                {
                  name: 'Done',
                  color: '#00c875',
                },
              ],
            },
          ],
        },
        {
          name: 'Group 2',
          order: 1,
          color: '#0073ea',
          items: [
            { id: uuidv4(), name: `${newBoardType} 3`, order: 3, columnValuesVal: ["", "", new Date()] },
            { id: uuidv4(), name: `${newBoardType} 4`, order: 4, columnValuesVal: ["", "", ""] },
          ],
        },
      ],
    }
    addBoardMutate(newBoard)
  }

  const [timeoutId, setTimeoutId] = useState<null | NodeJS.Timeout>(null)

  useEffect(() => {
    if (workspaceBoards) {
      if (timeoutId) clearTimeout(timeoutId)

      const id = setTimeout(() => {
        onSortBoards(workspaceBoards)
      }, 1000)
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
              <p className="mini-paragraph">Workspace</p>
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
                {isOnSearch ? (
                  <div ref={searchBoardRef} className="search">
                    <TextField value={searchBoard} onChange={(value) => setSearchBoard(value)} autoFocus={isOnSearch} ref={searchTextInput} placeholder="Search" />
                    <Search />
                  </div>
                ) : (
                  <li onClick={() => setIsOnSearch(true)}>
                    <Search />
                    <button>Search</button>
                  </li>
                )}
              </ul>
            </section>
          </header>
          <hr />
          <div className="boards-list-container">
            {!!workspaceBoards.length ? (
              <ReactSortable list={workspaceBoards} setList={setWorkspaceBoards} dragClass="drag-ghost" ghostClass="custom-placeholder" fallbackClass='board-ghost' forceFallback animation={300} className="boards-list">
                {workspaceBoards.map((board: Board) => (
                  <div className={boardId === board.id ? 'active' : ''} key={board.id}>
                    <div className="board-navigator" onClick={() => onNavigateBoard(board)}>
                      {<Board />} {board.name}
                    </div>
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
                  <RadioButton defaultChecked value="Items" onSelect={(e: ChangeEvent<HTMLInputElement | null>) => setNewBoardType(e.target.value)} name="radio-buttons-group" text="Items" />
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

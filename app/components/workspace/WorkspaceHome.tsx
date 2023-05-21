'use client'

import useOnClickOutside from '@/app/hooks/useOnClickOutside'
import { useGetWorkspace, useUpdateBoard, useUpdateWorkspace } from '@/app/hooks/useQuery'
import { colors } from '@/app/services/utilService'
const { Button, TabList, TabPanel, TabPanels, TabsContext, Tab } = require('monday-ui-react-core')
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
const { Edit, Favorite, Board, Check } = require('monday-ui-react-core/icons')

export default function WorkspaceHome({ workspace }: { workspace: Workspace }) {
  const { data: currentWorkspace } = useGetWorkspace(workspace)
  const { mutate: updateMutate } = useUpdateWorkspace()
  const {mutate: updateMutateBoard} = useUpdateBoard()
  const editWorkspaceIconRef = useRef(null)
  const router = useRouter()

  const [isOpenEditIcon, setIsOpenEditIcon] = useState<boolean>(false)
  const handleChange = (value: string, key: string) => {
    if (value === currentWorkspace[key as keyof Workspace]) return
    updateMutate({ workspaceId: currentWorkspace.id!, value, key })
  }



  useOnClickOutside(editWorkspaceIconRef, () => setIsOpenEditIcon(false))
  
  const onNavigateBoard = (board: Board) => {
    router.push(`/workspaces/${board.workspaceId}/boards/${board.id}`)
    updateMutateBoard({ boardId: board.id!, value: new Date(), key: 'recentlyVisited' })
}

  const sortedBoardsByRecentlyVisited = useMemo(() => currentWorkspace.boards?.sort((board1: Board, board2: Board) => {
    
    const time1 = board1?.recentlyVisited ? new Date(board1?.recentlyVisited).getTime() : 0
    console.log('file: WorkspaceHome.tsx:38 -> time1:', time1)
    const time2 = board2?.recentlyVisited ? new Date(board2?.recentlyVisited).getTime() : 0
    console.log('file: WorkspaceHome.tsx:40 -> time2:', time2)

    return time2 - time1
  }), [currentWorkspace.boards]);


  return (
    <main className="workspace-home">
      <header className="cover-image">
        <Button>
          <Edit /> Change Cover
        </Button>
      </header>
      <section ref={editWorkspaceIconRef} className="workspace-details">
        <div onClick={() => setIsOpenEditIcon(isOpenEditIcon => !isOpenEditIcon)} className="workspace-icon" style={{ backgroundColor: currentWorkspace.color }}>
          {currentWorkspace.name[0]}
          <span>
            <Edit />
            Edit
          </span>
        </div>
        <CSSTransition timeout={150} in={isOpenEditIcon} classNames="container-transition">
          <>
            {isOpenEditIcon && (
              <div className="edit-workspace-icon">
                <p className="mini-paragraph">Background color</p>
                <div>
                  {colors.map((color: string) => (
                    <div onClick={() => handleChange(color, 'color')} style={{ backgroundColor: color }} className="color-option" key={color}>
                      {color === currentWorkspace.color && <Check />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        </CSSTransition>
        <div className="workspace-info">
          <h3 onBlur={(event) => handleChange(event.target.innerText, 'name')}>{currentWorkspace.name}</h3>
          <p className="mini-paragraph" onBlur={(event) => handleChange(event.target.innerText, 'description')}>
            {currentWorkspace.description}
          </p>
        </div>
      </section>
      <section className="workspace-tabs">
        <TabsContext>
          <TabList>
            <Tab>Boards</Tab>
            <Tab>Members</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="recent-boards">
              <ul>
              {sortedBoardsByRecentlyVisited?.map((board: Board) => (
                <>
                    <li key={board.id} onClick={() => onNavigateBoard(board)}>
                      <span>
                        {<Board />} {board.name}
                      </span>{' '}
                      {<Favorite />}
                    </li>
                    <hr/>
                    </>
              ))}
              </ul>
            </TabPanel>
            <TabPanel>Second slide</TabPanel>
          </TabPanels>
        </TabsContext>
      </section>
    </main>
  )
}

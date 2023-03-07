'use client'

import Link from 'next/link'
import { useState } from 'react'
import WorkspaceOptions from './WorkspaceOptions'
const { Board, NavigationChevronLeft, NavigationChevronRight } = require('monday-ui-react-core/icons')

export default function WorkspaceNav({ currentWorkspace }: any) {
  const [isCollapseNav, setIsCollapseNav] = useState<boolean>(false)

  const onCollapseNav = () => {
    setIsCollapseNav((isCollapseNav) => !isCollapseNav)
  }

  return (
    <nav className={`workspace-nav ${isCollapseNav ? 'close' : 'open'}`}>
      <button onClick={() => onCollapseNav()} className="collapse-btn">
        {isCollapseNav ? <NavigationChevronRight /> : <NavigationChevronLeft />}
      </button>
      {!isCollapseNav && (
        <>
          <WorkspaceOptions workspace={currentWorkspace} />
          <hr />
          <ul>
            {currentWorkspace.boards.map((board: any) => (
              <li key={board.id}>
                <Link href={`/boards/${board.id}`}>
                  {<Board/>} {board.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import WorkspaceOptions from './WorkspaceOptions'
const {Combobox} =  require('monday-ui-react-core')
const { Board, NavigationChevronLeft, NavigationChevronRight, Menu, NavigationChevronUp, NavigationChevronDown } = require('monday-ui-react-core/icons')

export default function WorkspaceNav({ currentWorkspace }: any) {
  const [isCollapseNav, setIsCollapseNav] = useState<boolean>(false)

  const onCollapseNav = () => {
    setIsCollapseNav((isCollapseNav) => !isCollapseNav)
  }

  const options = [{
    id: "1",
    label: "Option 1"
  }, {
    id: "2",
    label: "Option 2"
  }, {
    id: "3",
    label: "Option 3"
  }];

  return (
    <nav className={`workspace-nav ${isCollapseNav ? 'close' : 'open'}`}>
      <button onClick={() => onCollapseNav()} className="collapse-btn">
        {isCollapseNav ? <NavigationChevronRight /> : <NavigationChevronLeft />}
      </button>
      {!isCollapseNav && (
        <>
          <header>
            <div className="options">
              <p className="mini-paragraph">Workspace</p> <Menu />
            </div>
            <div className="workspace-chose">
              <div className="workspace-icon" style={{ backgroundColor: currentWorkspace.color }}>
                {currentWorkspace.name[0]}
              </div>
              {currentWorkspace.name}
                < NavigationChevronDown />
              <Combobox placeholder="Search for a workspace" options={options} className="workspace-combobox"/>
            </div>
          </header>
          <hr />
          <ul>
            {currentWorkspace.boards.map((board: any) => (
              <li key={board.id}>
                <Link href={`/boards/${board.id}`}>
                  {<Board />} {board.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  )
}

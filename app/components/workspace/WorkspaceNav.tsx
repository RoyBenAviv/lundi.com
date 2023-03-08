'use client'

import Link from 'next/link'
import { useCallback, useState } from 'react'
const { Combobox } = require('monday-ui-react-core')
const { Board, NavigationChevronLeft, NavigationChevronRight, Menu, NavigationChevronUp, NavigationChevronDown } = require('monday-ui-react-core/icons')

export default function WorkspaceNav({ currentWorkspace }: any) {
  const [isCollapseNav, setIsCollapseNav] = useState<boolean>(false)
  const [isComboBoxOpen, setIsComboBoxOpen] = useState<boolean>(false)

  const options = [
    {
      id: '1',
      label: 'Option 1',
    },
    {
      id: '2',
      label: 'Option 2',
    },
    {
      id: '3',
      label: 'Option 3',
    },
  ]

  const openNavOnEnter = useCallback(() => {
      isCollapseNav && setTimeout(() => {
        setIsCollapseNav(false)
      }, 500)
  }, [isCollapseNav])

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
            <section  onClick={() => setIsComboBoxOpen((isComboBoxOpen) => !isComboBoxOpen)} className="workspace-choose" style={isComboBoxOpen ? { borderColor: '#0073ea' } : {}}>
              <div className="workspace-icon-name">
                <div className="workspace-icon" style={{ backgroundColor: currentWorkspace.color }}>
                  {currentWorkspace.name[0]}
                </div>
                {currentWorkspace.name}
              </div>
              {isComboBoxOpen ? <NavigationChevronUp className="arrow" /> : <NavigationChevronDown className="arrow" />}
              {isComboBoxOpen && <Combobox placeholder="Search for a workspace" options={options} className="workspace-combobox" />}
            </section>
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

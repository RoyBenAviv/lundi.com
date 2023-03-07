'use client'

import { useUpdateWorkspaceName } from '@/app/hooks/useQuery'
import { Button, Tab, TabList, TabPanel, TabPanels, TabsContext } from 'monday-ui-react-core'
import Link from 'next/link'
import { FocusEvent, useState } from 'react'
const { Edit, Favorite, Board } = require('monday-ui-react-core/icons')
export default function WorkspaceHome({ currentWorkspace }: any) {
  const { mutate: updateMutate } = useUpdateWorkspaceName()

  const handleChange = (event: FocusEvent<HTMLHeadingElement, Element>, key: string) => {
    const value = event.target.innerText
    if(value === currentWorkspace[key]) return
    updateMutate({ workspaceId: currentWorkspace.id, value, key })
  }

  return (
    <main className="workspace-home">
      <header className="cover-image">
        <Button>
          <Edit /> Change Cover
        </Button>
      </header>
      <section className="workspace-details">
        <div className="workspace-icon" style={{backgroundColor: currentWorkspace.color}}>{currentWorkspace.name[0]}
        <span>
        <Edit />
        Edit
        </span>
        </div>
        <div className="workspace-info">
          <h3 contentEditable={true} onBlur={(event) => handleChange(event, 'name')}>
            {currentWorkspace.name}
          </h3>
          <p className="mini-paragraph" contentEditable={true} onBlur={(event) => handleChange(event, 'description')}>
            {currentWorkspace.description}
          </p>
        </div>
      </section>
      <section className='workspace-tabs'>
        <TabsContext>
          <TabList>
            <Tab>Boards</Tab>
            <Tab>Members</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className='recent-boards'>
            {currentWorkspace.boards.map((board: any) => (
              <>
              <p key={board.id}>
              <Link href={`/boards/${board.id}`}>
                  <span>{<Board/>} {board.name}</span> {<Favorite/>}
                </Link>
              </p>
                <hr/>
              </>
            ))}
          </TabPanel>
            <TabPanel>Second slide</TabPanel>
          </TabPanels>
        </TabsContext>
      </section>
    </main>
  )
}

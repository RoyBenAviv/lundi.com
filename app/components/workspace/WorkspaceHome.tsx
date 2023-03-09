'use client'

import { useGetWorkspace, useUpdateWorkspace } from '@/app/hooks/useQuery'
import { Button, Tab, TabList, TabPanel, TabPanels, TabsContext } from 'monday-ui-react-core'
import Link from 'next/link'
import { FocusEvent, useState } from 'react'
const { Edit, Favorite, Board, Check } = require('monday-ui-react-core/icons')

const colors = ['#fb275d', '#00ca72', '#a358d0', '#595ad4', '#1c1f3b', '#66ccff']
export default function WorkspaceHome({workspaceId}: {workspaceId: string}) {

  const {data: currentWorkspace} = useGetWorkspace(workspaceId, null)
  const { mutate: updateMutate } = useUpdateWorkspace()


  const [isOpenEditIcon, setIsOpenEditIcon] = useState<boolean>(false)
  const handleChange = (value: string, key: string) => {
    if (value === currentWorkspace[key]) return
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
        <div onClick={() => setIsOpenEditIcon((isOpenEditIcon) => !isOpenEditIcon)} className="workspace-icon" style={{ backgroundColor: currentWorkspace.color }}>
          {currentWorkspace.name[0]}
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
                <div onClick={() => handleChange(color, 'color')} style={{ backgroundColor: color }} className="color-option" key={color}>
                  {color === currentWorkspace.color && <Check />}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="workspace-info">
          <h3  onBlur={(event) => handleChange(event.target.innerText, 'name')}>
            {currentWorkspace.name}
          </h3>
          <p  className="mini-paragraph" onBlur={(event) => handleChange(event.target.innerText, 'description')}>
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
              {currentWorkspace.boards.map((board: Board) => (
                <div key={board.id}>
                  <p >
                    <Link href={`/boards/${board.id}`}>
                      <span>
                        {<Board />} {board.name}
                      </span>{' '}
                      {<Favorite />}
                    </Link>
                  </p>
                  <hr />
                </div>
              ))}
            </TabPanel>
            <TabPanel>Second slide</TabPanel>
          </TabPanels>
        </TabsContext>
      </section>
    </main>
  )
}

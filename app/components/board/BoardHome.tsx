'use client'

import { Button, Tab, TabList, TabPanel, TabPanels, TabsContext } from 'monday-ui-react-core'
import Group from '../Group/Group'
const { Home } = require('monday-ui-react-core/icons')
export default function BoardHome({ board }: { board: Board }) {
  console.log('file: BoardHome.tsx:7 -> board:', board)
  return (
    <main className="board-home">
      <header>
        <h2>{board.name}</h2>
      </header>
      <section>
        <TabsContext>
          <TabList>
            <Tab>
              <div>
                <Home /> Main table
              </div>
            </Tab>
            <></>
          </TabList>
          <TabPanels>
            <TabPanel className="recent-boards">
              {board.groups.map((group: Group) => (
                <Group key={group.id} group={group} />
              ))}
            </TabPanel>
          </TabPanels>
        </TabsContext>
        <pre>{JSON.stringify(board, null, 2)}</pre>
      </section>
    </main>
  )
}

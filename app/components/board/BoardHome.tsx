'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Group from './Group'
// const { Home } = require('monday-ui-react-core/icons')
const { Home, Add, Search, Filter } = require('monday-ui-react-core/icons')
import { v4 as uuidv4 } from 'uuid'
import EditableHeading from 'monday-ui-react-core/dist/EditableHeading'
import { useAddItem } from '@/app/hooks/useQuery'
const { Button, SplitButton, TabList, TabPanel, TabPanels, TabsContext, Tab } = require('monday-ui-react-core')
export default function BoardHome({ board }: { board: Board }) {
  console.log('file: BoardHome.tsx:8 -> board:', board)
  const queryClient = useQueryClient()
  const { mutate: addItem } = useAddItem('top')
  const { data: currentBoard, isLoading } = useQuery(['board', board.id], () => board, { initialData: board, enabled: !!queryClient })
  const [width, setWidth] = useState<number>(180)


  const onAddNewItem = () => {
    const columnValues = []
    for(let i = 0; i < currentBoard.columns.length; i++) {
      const id = uuidv4()
        columnValues.push({columnId: currentBoard.columns[i].id, id})
    }


    const newItem = {
      id: uuidv4(),
      name: 'New item',
      groupId: currentBoard.groups[0].id,
      boardId: currentBoard.id,
      order: currentBoard.groups[0].items[0].order - 1,
      columnValues
    }
    addItem(newItem)
  }

  if (isLoading) return <h1>IS LOADING</h1>
  return (
    <main className="board-home">
      <header>
        <EditableHeading value={currentBoard.name} type={EditableHeading.types.h2} />
        <TabList className="board-tablist">
          <Tab icon={Home}>Main Table</Tab>
          <Tab>
            <Add />
          </Tab>
        </TabList>
      </header>
      <nav>
        <SplitButton size={SplitButton.sizes?.SMALL} onClick={() => onAddNewItem()} onSecondaryDialogDidHide={function noRefCheck() {}} onSecondaryDialogDidShow={function noRefCheck() {}}>
          New Item
        </SplitButton>
        <Button className="secondary-btn" size={Button.sizes?.SMALL} kind={Button.kinds?.TERTIARY} leftIcon={Search}>
          Search
        </Button>
        <Button className="secondary-btn" size={Button.sizes?.SMALL} kind={Button.kinds?.TERTIARY} leftIcon={Filter}>
          Filter
        </Button>
      </nav>
      <section>
        {currentBoard?.groups.map((group: Group) => (
          <Group key={group.id} group={group} columns={currentBoard.columns} boardItemsType={currentBoard.boardItemsType} workspaceId={currentBoard.workspaceId} boardId={currentBoard.id} width={width} setWidth={setWidth} />
        ))}
      </section>
    </main>
  )
}

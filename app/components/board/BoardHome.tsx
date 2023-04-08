'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Group from './Group'
// const { Home } = require('monday-ui-react-core/icons')
const { Home, Add, Search, Filter } = require('monday-ui-react-core/icons')
import { v4 as uuidv4 } from 'uuid'
import EditableHeading from 'monday-ui-react-core/dist/EditableHeading'
import { useAddItem, useAddManyItems } from '@/app/hooks/useQuery'
import ItemsToAction from './ItemsToAction'
import { CSVDownload } from 'react-csv'
import { ReactSortable } from 'react-sortablejs'

const { Button, SplitButton, TabList, TabPanel, TabPanels, TabsContext, Tab } = require('monday-ui-react-core')
export default function BoardHome({ board }: { board: Board }) {
  console.log('file: BoardHome.tsx:8 -> board:', board)
  const queryClient = useQueryClient()
  const { mutate: addItem } = useAddItem('top')
  const { mutate: addManyItems} = useAddManyItems()
  const { data: currentBoard, isLoading } = useQuery(['board', board.id], () => board, { initialData: board, enabled: !!queryClient })
  const [width, setWidth] = useState<number>(180)
  const [itemsToAction, setItemsToAction] = useState<(string | undefined)[]>([])
  const [csvData, setCsvData] = useState<Item[] | null>(null)

  const [isAllGroupsOpen, setIsAllGroupsOpen] = useState<boolean>(true)



  const onAddNewItem = () => {
    const columnValues = []
    for (let i = 0; i < currentBoard.columns.length; i++) {
      const id = uuidv4()
      columnValues.push({ columnId: currentBoard.columns[i].id, id })
    }

    const newItem = {
      id: uuidv4(),
      name: `New ${currentBoard.boardItemsType}`,
      groupId: currentBoard.groups[0].id,
      boardId: currentBoard.id,
      order: currentBoard.groups[0].items[0]?.order - 1 || 0,
      columnValues,
    }
    addItem(newItem)
  }

  const onOpenItemsAction = (itemsId: (string | undefined)[]) => {
    console.log('file: BoardHome.tsx:40 -> itemsId:', itemsId)
    setItemsToAction(itemsId)
  }

  const toggleItemsToEdit = (groupId: string, itemId: string | null) => {
    console.log('file: BoardHome.tsx:48 -> groupId:', groupId)

    if (!itemId) {
      const groupIdx = currentBoard.groups.findIndex((group) => group.id === groupId)
      const itemIdsToToggle = currentBoard.groups[groupIdx].items.map((item) => item.id)

      const newItemsToAction = itemsToAction.filter((item) => !itemIdsToToggle.includes(item))
      if (newItemsToAction.length === itemsToAction.length) {
        newItemsToAction.push(...itemIdsToToggle.filter((item) => !itemsToAction.includes(item)))
      }

      setItemsToAction(newItemsToAction)
    } else {
      if (itemsToAction.includes(itemId)) {
        setItemsToAction((items) => [...items.filter((actionItem) => actionItem !== itemId)])
      } else {
        setItemsToAction((items) => [...items, itemId])
      }
    }
  }

  const onExportItems = () => {
    const itemsToExport: Item[] = []

    currentBoard.groups.forEach((group) => {
      group.items.forEach((item) => {
        if (itemsToAction.includes(item.id)) {
          itemsToExport.push(item) // todo : chnage the excel style
        }
      })
    })

    setCsvData(itemsToExport)
    setItemsToAction([])
  }

  const onDuplicateItems = () => {
    const itemsToDuplicate: NewItem[] = []
    const columnValues: any[] = []
    for (let i = 0; i < currentBoard.columns.length; i++) {
      const id = uuidv4()
      columnValues.push({ columnId: currentBoard.columns[i].id, id })
    }
    currentBoard.groups.forEach((group, idx) => {
      group.items.forEach((item) => {
          if (itemsToAction.includes(item.id)) {
            const newItem = {
              id: uuidv4(),
              name: `Duplicate of ${item.name}`,
              groupId: currentBoard.groups[idx].id,
              boardId: currentBoard.id,
              order: currentBoard.groups[idx]?.items[0]?.order - 1 || 0,
              columnValues,
            }

            itemsToDuplicate.push(newItem) // todo : add col values
          }
      })
    })

    console.log('itemsToDuplicate',itemsToDuplicate);
    addManyItems(itemsToDuplicate)
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
        <ReactSortable list={currentBoard.groups} onChoose={() => setIsAllGroupsOpen(false)} onEnd={() => setIsAllGroupsOpen(true)} setList={() => {}} >
        {currentBoard?.groups.map((group: Group) => (

          <Group
          key={group.id}
            group={group}
            columns={currentBoard.columns}
            boardItemsType={currentBoard.boardItemsType}
            workspaceId={currentBoard.workspaceId}
            boardId={currentBoard.id}
            width={width}
            setWidth={setWidth}
            onOpenItemsAction={onOpenItemsAction}
            toggleItemsToEdit={toggleItemsToEdit}
            itemsToAction={itemsToAction}
            isAllGroupsOpen={isAllGroupsOpen}
            />
            ))}
            </ReactSortable>
      </section>
      {!!itemsToAction.length && <ItemsToAction currentBoardId={currentBoard.id} itemsToAction={itemsToAction} setItemsToAction={setItemsToAction} boardItemsType={currentBoard.boardItemsType} onExportItems={onExportItems} onDuplicateItems={onDuplicateItems} />}

      {csvData && <CSVDownload data={csvData} target="_blank" />}
    </main>
  )
}

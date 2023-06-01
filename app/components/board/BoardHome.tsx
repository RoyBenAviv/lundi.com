'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Group from './Group'
const { Home, Add, Search, Filter } = require('monday-ui-react-core/icons')
import { v4 as uuidv4 } from 'uuid'
import EditableHeading from 'monday-ui-react-core/dist/EditableHeading'
import { useAddGroup, useAddItem, useAddManyItems, useUpdateGroups } from '@/app/hooks/useQuery'
import ItemsToAction from './ItemsToAction'
import { CSVDownload } from 'react-csv'
import { ReactSortable } from 'react-sortablejs'
const { Button, SplitButton, TabList, TabPanel, TabPanels, TabsContext, Tab } = require('monday-ui-react-core')
export default function BoardHome({ board }: { board: Board }) {
  const queryClient = useQueryClient()
  const { mutate: addItem } = useAddItem('top')
  const { mutate: addNewGroup } = useAddGroup()
  const { mutate: addManyItems } = useAddManyItems()
  const { data: currentBoard, isLoading } = useQuery(['board', board.id], () => board, { initialData: board, enabled: !!queryClient })
  const { mutateAsync: updateGroups } = useUpdateGroups(currentBoard.id)
  const [groupWidth, setGroupWidth] = useState<number>(currentBoard.groups[0].width)

  const [itemsToAction, setItemsToAction] = useState<(string | undefined)[]>([])
  const [csvData, setCsvData] = useState<Item[] | null>(null)
  const [isAllGroupsOpen, setIsAllGroupsOpen] = useState<boolean>(true)
  const [boardGroups, setBoardGroups] = useState<Group[]>(currentBoard.groups.sort((group1: Group, group2: Group) => group1.order - group2.order))
  const [disableSorting, setDisableSorting] = useState<boolean>(false)
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

  const onOpenItemsAction = (itemsId: (string | undefined)[]): void => {
    setItemsToAction(itemsId)
  }

  const onAddNewGroup = () => {
    const newGroup = {
      id: uuidv4(),
      name: "New Group",
      boardsId: currentBoard.id,
      order: boardGroups[boardGroups.length - 1]?.order + 1 || 0,
      color: '#e2445c'
    }

    addNewGroup(newGroup)
  }

  const toggleItemsToEdit = (groupId: string, itemId: string | null) => {
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

    addManyItems(itemsToDuplicate)
  }

  const onSetGroupWidth = async (dWidth: number) => {
    await updateGroups({ value: groupWidth + dWidth, key: 'width' })
    setGroupWidth((width) => width + dWidth)
  }

  const onSetGroupsOrder = async (boardGroups: Group[]) => {
    setIsAllGroupsOpen(true)
    const sortedGroups = boardGroups.map((group: Group, idx: number) => {
      return {
        id: group.id,
        order: idx,
      }
    })

    setDisableSorting(true)
    await updateGroups({ value: sortedGroups, key: 'sorting' })
    setDisableSorting(false)
  }

  useEffect(() => {
    boardGroups && onSetGroupsOrder(boardGroups)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardGroups])



  if (isLoading) return <></>
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
        <ReactSortable handle='.handle' animation={300} list={boardGroups} onStart={() => setIsAllGroupsOpen(false)} setList={setBoardGroups}>
          {currentBoard.groups
            .sort((group1: Group, group2: Group) => group1.order - group2.order)
            .map((group: Group) => (
              <Group
                key={group.id}
                group={group}
                columns={currentBoard.columns}
                boardItemsType={currentBoard.boardItemsType}
                workspaceId={currentBoard.workspaceId}
                boardId={currentBoard.id}
                groupWidth={groupWidth}
                onSetGroupWidth={onSetGroupWidth}
                onOpenItemsAction={onOpenItemsAction}
                toggleItemsToEdit={toggleItemsToEdit}
                itemsToAction={itemsToAction}
                isAllGroupsOpen={isAllGroupsOpen}
                // setBoardGroups={setBoardGroups}
              />
            ))}
        </ReactSortable>
      <Button onClick={() => onAddNewGroup()} size={Button.sizes?.SMALL} leftIcon={Add} kind={Button.kinds?.SECONDARY}>Add new group</Button>
      {!!itemsToAction.length && <ItemsToAction currentBoardId={currentBoard.id} itemsToAction={itemsToAction} setItemsToAction={setItemsToAction} boardItemsType={currentBoard.boardItemsType} onExportItems={onExportItems} onDuplicateItems={onDuplicateItems} />}

      {csvData && <CSVDownload data={csvData} target="_blank" />}
      {<pre>{JSON.stringify(currentBoard, null, 2)}</pre>}
    </main>
  )
}

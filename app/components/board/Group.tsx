'use client'

import { useAddItem } from '@/app/hooks/useQuery'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Item from './Item'
const { NavigationChevronDown, Add, NavigationChevronRight } = require('monday-ui-react-core/icons')
import { Resizable } from 're-resizable'
import Checkbox from 'monday-ui-react-core/dist/Checkbox'
import Column from './Column'
import { ReactSortable } from 'react-sortablejs'
export default function Group({
  group,
  columns,
  boardItemsType,
  workspaceId,
  boardId,
  groupWidth,
  onSetGroupWidth,
  onOpenItemsAction,
  toggleItemsToEdit,
  itemsToAction,
  isAllGroupsOpen,
  columnsWidth,
  setColumnsWidth,
}: // setBoardGroups
{
  group: Group
  columns: Column[]
  boardItemsType: string
  workspaceId: string
  boardId: string
  groupWidth: number
  onSetGroupWidth: Function
  onOpenItemsAction: (itemsId: (string | undefined)[]) => void
  toggleItemsToEdit: Function
  itemsToAction: (string | undefined)[]
  isAllGroupsOpen: boolean
  columnsWidth: any
  setColumnsWidth: React.Dispatch<SetStateAction<any>>
}) {
  const [newItemName, setNewItemName] = useState<string>('')
  const [isGroupOpen, setIsGroupOpen] = useState<boolean>(true)



  const items: Item[] = group!.items.sort((item1: Item, item2: Item) => item1.order - item2.order)
  const { mutate: addItem, isLoading: isLoadingNewItem } = useAddItem('bottom')

  const onAddNewItem = () => {
    const columnValues = []
    for (let i = 0; i < columns.length; i++) {
      const id = uuidv4()
      columnValues.push({ columnId: columns[i].id, id })
    }
    if (!newItemName) return
    const newItem = {
      id: uuidv4(),
      name: newItemName,
      groupId: group.id,
      boardId,
      order: group.items.length ? group.items[group.items.length - 1].order + 1 : 0,
      columnValues,
    }
    addItem(newItem)
    setNewItemName('')
  }

  const [boardColumns, setBoardColumns] = useState<Column[]>(columns.sort((column1: Column, column2: Column) => column2.order - column1.order))


  const onSetColumnsOrder = async (boardColumns: Column[]) => {
    const sortedGroups = boardColumns.map((column: Column, idx: number) => {
      // return {
      //   id: group.id,
      //   order: idx,
      // }
    })

  }

  useEffect(() => {
    boardColumns && onSetColumnsOrder(boardColumns)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardColumns])

  return isGroupOpen && isAllGroupsOpen ? (
    <section className="group-container open">
      <header>
        <div className="header-title group-handle">
          <h4 style={{ color: group.color }}>
            <NavigationChevronDown onClick={() => setIsGroupOpen(false)} /> {group.name}
          </h4>
          <p className="mini-paragraph">
          {`${group.items.length} ${boardItemsType}${group.items.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </header>
      <section className="board-data-table">
        <div className="table-header">
          <div className="check-item">
            <div className="check-left-color" style={{ backgroundColor: group.color }}></div>
            <Checkbox disabled={!group.items.length} checked={group.items.every((item) => itemsToAction.includes(item.id)) && group.items.length} onChange={() => toggleItemsToEdit(group.id, null)} />
          </div>
          <div className="table-header">
            <Resizable  enable={{ right: true }} minWidth={180} onResizeStop={(e, direction, ref, d) => onSetGroupWidth(d.width)} handleClasses={{ right: 'custom-handle' }}>
              <div style={{ width: groupWidth + 'px' }} className="column column-title">
                <span>{boardItemsType}</span>
              </div>
            </Resizable>
            {/* <ReactSortable animation={300} list={boardColumns} setList={setBoardColumns} dragoverBubble forceFallback removeCloneOnHide={false} emptyInsertThreshold={100} fallbackOnBody={true} fallbackClass='test2' style={{display: 'flex'}}> */}
            {columns
            .sort((column1: Column, column2: Column) => column1.order - column2.order)
            .map((column: Column) => (
              <Column key={column.id} column={column} columnsWidth={columnsWidth} setColumnsWidth={setColumnsWidth}/>
            ))}
            {/* </ReactSortable> */}
          </div>
          <div className="column add-column">
            <span>
              <Add />
            </span>
          </div>
        </div>
        <div className="table-body">
          {!!items.length && items.map((item: Item) => (
            <div style={itemsToAction.includes(item.id) ? {backgroundColor: '#cce5ff'} : {}} key={item.id} className="table-row">
              <div className="check-item">
                <div className="check-left-color" style={{ backgroundColor: group.color }}></div>
                <Checkbox checked={itemsToAction.includes(item.id)} onChange={() => toggleItemsToEdit(group.id, item.id!)} />
              </div>
              <Item isLoadingNewItem={isLoadingNewItem} item={item} columns={columns} columnsWidth={columnsWidth}  groupWidth={groupWidth} boardId={boardId} groupId={group.id}/>
            </div>
          ))}
          <div className="table-row add-item-row">
            <div className="check-item disabled">
              <div className="check-left-color disabled" style={{ backgroundColor: group.color }}></div>
              <Checkbox disabled={true} />
            </div>
            <input
              onBlur={() => onAddNewItem()}
              value={newItemName}
              onKeyDown={(e) => {
                e.key === 'Enter' && onAddNewItem()
              }}
              onChange={(e) => setNewItemName(e.target.value)}
              className="edit-input new-item"
              type="text"
              placeholder={`+ Add ${boardItemsType}`}
            />
          </div>
        </div>
      </section>
    </section>
  ) : (
    <section className="group-container close">
      <div className="left-color" style={{ backgroundColor: group.color }}></div>
      <header className="header-title">
        <h4 style={{ color: group.color }}>
          <NavigationChevronRight onClick={() => setIsGroupOpen(true)} /> {group.name}
        </h4>
        <p className="mini-paragraph">
        {`${group.items.length} ${boardItemsType}${group.items.length !== 1 ? 's' : ''}`}
        </p>
      </header>
    </section>
  )
}

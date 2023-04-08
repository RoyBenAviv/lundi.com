'use client'

import { useAddItem } from '@/app/hooks/useQuery'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Item from './Item'
const { NavigationChevronDown, Add, NavigationChevronRight } = require('monday-ui-react-core/icons')
import { Resizable } from 're-resizable'
import Checkbox from 'monday-ui-react-core/dist/Checkbox'
export default function Group({
  group,
  columns,
  boardItemsType,
  workspaceId,
  boardId,
  width,
  setWidth,
  onOpenItemsAction,
  toggleItemsToEdit,
  itemsToAction,
  isAllGroupsOpen,
}: {
  group: Group
  columns: Column[]
  boardItemsType: string
  workspaceId: string
  boardId: string
  width: number
  setWidth: Dispatch<SetStateAction<number>>
  onOpenItemsAction: (itemsId: (string | undefined)[]) => void
  toggleItemsToEdit: Function
  itemsToAction: (string | undefined)[]
  isAllGroupsOpen: boolean
}) {
  const [newItemName, setNewItemName] = useState<string>('')
  const [isGroupOpen, setIsGroupOpen] = useState<boolean>(true)
  const items: Item[] = group.items.sort((item1: Item, item2: Item) => item1.order - item2.order)
  const { mutate: addItem } = useAddItem('bottom')

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
      order: group.items[group.items.length - 1].order + 1,
      columnValues,
    }
    addItem(newItem)
    setNewItemName('')
  }

  return (isGroupOpen && isAllGroupsOpen) ? (
    <section className="group-container open">
      <header>
        <div className="header-title">
          <h4 style={{ color: group.color }}>
            <NavigationChevronDown onClick={() => setIsGroupOpen(false)} /> {group.name}
          </h4>
          <p className="mini-paragraph">
            {group.items.length} {boardItemsType}
            {group.items.length !== 1 && 's'}{' '}
          </p>
        </div>
      </header>
      <section className="board-data-table">
        <div className="table-header">
          <div className="check-item">
            <div className="check-left-color" style={{ backgroundColor: group.color }}></div>
            <Checkbox checked={group.items.every((item) => itemsToAction.includes(item.id)) && group.items.length} onChange={() => toggleItemsToEdit(group.id, null)} />
          </div>
          <div className="table-header">
            <Resizable enable={{ right: true }} minWidth={180} onResizeStop={(e, direction, ref, d) => setWidth((width) => width + d.width)} handleClasses={{ right: 'custom-handle' }}>
              <div style={{ width: width + 'px' }} className="column column-title">
                <span>{boardItemsType}</span>
              </div>
            </Resizable>
            {columns.map((column: Column) => (
              <div className="column" key={column.id}>
                <span>{column.name}</span>
              </div>
            ))}
          </div>
          <div className="column add-column">
            <span>
              <Add />
            </span>
          </div>
        </div>
        <div className="table-body">
          {items.map((item: Item) => (
            <div key={item.id} className="table-row">
              <div className="check-item">
                <div className="check-left-color" style={{ backgroundColor: group.color }}></div>
                <Checkbox checked={itemsToAction.includes(item.id)} onChange={() => toggleItemsToEdit(group.id, item.id!)} />
              </div>
              <Item item={item} columns={columns} width={width} />
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
      <header className='header-title'>
      <h4 style={{ color: group.color }}>
        <NavigationChevronRight onClick={() => setIsGroupOpen(true)} /> {group.name}
      </h4>
      <p className="mini-paragraph">
            {group.items.length} {boardItemsType}
            {group.items.length !== 1 && 's'}{' '}
          </p>
      </header>
    </section>
  )
}

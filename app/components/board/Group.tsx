'use client'

import { useAddItem } from '@/app/hooks/useQuery'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Item from './Item'
const { NavigationChevronDown, Add } = require('monday-ui-react-core/icons')
import { useResizeDetector } from 'react-resize-detector'
import { Resizable } from 're-resizable'

export default function Group({ group, columns, boardItemsType, workspaceId, boardId, width, setWidth }: { group: Group; columns: Column[]; boardItemsType: string; workspaceId: string; boardId: string; width: number; setWidth: React.Dispatch<React.SetStateAction<number>> }) {
  const [newItemName, setNewItemName] = useState<string>('')
  const [items, setItems] = useState<Item[]>(group.items.sort((item1: Item, item2: Item) => item1.order - item2.order))

  const newItemRef = useRef<any>()
  const { mutate: addItem } = useAddItem('bottom')


  
  
  const onAddNewItem = () => {
    const columnValues = []
    for(let i = 0; i < columns.length; i++) {
      const id = uuidv4()
        columnValues.push({columnId: columns[i].id, id})
    }
    if (!newItemName) return
    const newItem = {
      id: uuidv4(),
      name: newItemName,
      groupId: group.id,
      boardId,
      order: group.items[group.items.length - 1].order + 1,
      columnValues
    }
    addItem(newItem)
    setNewItemName('')
  }

  return (
    <section className="group-container">
      <header>
        <h4 style={{ color: group.color }}>
          <NavigationChevronDown /> {group.name}
        </h4>
      </header>
      <section className="board-data-table">
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
          <div className="column add-column">
            <span>
              <Add />
            </span>
          </div>
        </div>
        <div className="table-body">
          {items.map((item: Item) => (
            <Item key={item.id} item={item} columns={columns} width={width} />
          ))}
          <div className="table-row add-item-row">
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
  )
}

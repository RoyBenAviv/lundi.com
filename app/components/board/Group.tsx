'use client'

import { useAddItem } from '@/app/hooks/useQuery';
import {  useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import Item from './Item';
const { NavigationChevronDown, Add } = require('monday-ui-react-core/icons')

export default function Group({ group, columns, boardItemsType, workspaceId, boardId }: { group: Group; columns: Column[]; boardItemsType: string, workspaceId: string, boardId: string }) {


  const [newItemName, setNewItemName] = useState<string>('')
  const [items, setItems] = useState<Item[]>(group.items.sort((item1: Item, item2: Item) => item1.order - item2.order))


  const newItemRef = useRef<any>()
  const { mutate: addItem } = useAddItem()


 

  const onAddNewItem = () => {
    if (!newItemName) return
    console.log('newItemName', newItemName)
    const newItem = {
      id: uuidv4(),
      name: newItemName,
      groupId: group.id,
      boardId,
      order: items[items.length -1].order + 1
    }
    addItem(newItem)
    setNewItemName('')
    setItems(items => [...items, newItem])
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
          <div className="column column-title">
            <span>{boardItemsType}</span>
          </div>
          {columns.map((column: any) => (
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
            <Item key={item.id} item={item} columns={columns}/>
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

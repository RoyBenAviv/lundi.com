'use client'

import useOnClickOutside from '@/app/hooks/useOnClickOutside'
import { useAddItem } from '@/app/hooks/useQuery';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MouseEvent, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
const { NavigationChevronDown, Add } = require('monday-ui-react-core/icons')

export default function Group({ group, columns, boardItemsType, workspaceId, boardId }: { group: Group; columns: Column[]; boardItemsType: string, workspaceId: string, boardId: string }) {


  const [newItemName, setNewItemName] = useState<string>('')
  const newItemRef = useRef<any>()
  const { mutate: addItem } = useAddItem()


  useOnClickOutside(newItemRef, () => onAddNewItem())

  const onAddNewItem = () => {
    if (!newItemName) return
    console.log('newItemName', newItemName)
    const newItem = {
      id: uuidv4(),
      name: newItemName,
      groupId: group.id,
      boardId
    }
    addItem({newItem, workspaceId})
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
          {group.items?.map((item: Item) => (
            <div className="table-row" key={item.id}>
              <div className="cell item-name">
                <span>{item.name}</span>
              </div>
              {columns.map((column: Column) => {
                const columnValue = item.columnValues?.find((cv: any) => cv.columnId === column.id)
                return (
                  <div className="cell" key={column.id}>
                    {columnValue && columnValue.value}
                  </div>
                )
              })}
              <div className="cell add-column"></div>
            </div>
          ))}
          <div className="table-row add-item-row">
            <input
              ref={newItemRef}
              value={newItemName}
              onKeyDown={(e) => {
                e.key === 'Enter' && onAddNewItem()
              }}
              onChange={(e) => setNewItemName(e.target.value)}
              className="add-item-input"
              type="text"
              placeholder={`+ Add ${boardItemsType}`}
            />
          </div>
        </div>
      </section>
    </section>
  )
}

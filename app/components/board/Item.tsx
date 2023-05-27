'use client'

import useOnClickOutside from '@/app/hooks/useOnClickOutside'
import { useUpdateItem } from '@/app/hooks/useQuery'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import ColumnValue from './ColumnValue'

const { Open } = require('monday-ui-react-core/icons')

export default function Item({ item, columns, width, boardId, groupId }: { item: Item; columns: Column[]; width: number; boardId: string; groupId: string}) {
  const { mutate: updateItem } = useUpdateItem()
  const [itemName, setItemName] = useState<string>(item.name)
  const editNameRef = useRef<any>()


  const onEditItemName = () => {
    if (!itemName) setItemName(item.name)
    updateItem({ itemId: item.id!, value: itemName, key: 'name' })
  }
  return (
    <section className="item-row">
      <div style={{ width: width + 'px' }} className="cell item-name">
        <input
          type="text"
          onKeyDown={(e) => {
            e.key === 'Enter' && onEditItemName()
          }}
          className="edit-input name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          onBlur={() => onEditItemName()}
        />
        <span className="open">
          <Open />
        </span>
      </div>
      {columns.map((column: Column) => {
        const columnValue = item.columnValues?.find((columnValue) => (columnValue.columnId === column.id))
        return (
          <ColumnValue key={column.id} column={column} columnValue={columnValue} item={item} boardId={boardId} groupId={groupId}/>
        )
      })}
      <div className="cell add-column"></div>
    </section>
  )
}

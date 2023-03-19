'use client'

import useOnClickOutside from '@/app/hooks/useOnClickOutside'
import { useUpdateItem } from '@/app/hooks/useQuery'
import { useRef, useState } from 'react'

const { Open } = require('monday-ui-react-core/icons')

export default function Item({ item, columns }: { item: Item; columns: Column[] }) {
  const { mutate: updateMutate } = useUpdateItem()
  const [itemName, setItemName] = useState<string>(item.name)
  const editNameRef = useRef<any>()

  const onEditItemName = () => {
    if (!itemName) return
    updateMutate({ itemId: item.id!, value: itemName, key: 'name' })
  }


  return (
    <section className="table-row">
      <div className="cell item-name">
        <input
        //   ref={editNameRef}
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
        const columnValue = item.columnValues?.find((columnValue) => columnValue.columnId === column.id)
        return (
          <div className={`cell ${column.columnType}`} key={column.id}>
            <span>{columnValue && columnValue.value}</span>
          </div>
        )
      })}
      <div className="cell add-column"></div>
    </section>
  )
}

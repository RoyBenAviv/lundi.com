'use state'

import { useUpdateColumnValue } from "@/app/hooks/useQuery"
import { useState } from "react"

export default function ColumnValue({column, columnValue, itemId}: {column: Column, columnValue: any, itemId: string}) {
const { mutate: updateColumnValue } = useUpdateColumnValue()
    const [value, setValue] = useState<string>(columnValue?.value || '')

    const onEditColumnValue = () => {
        if(columnValue.value === value) return
        updateColumnValue({columnValueId: columnValue.id, value, key: 'value' })
    }


    return (
        <div className={`cell ${column.columnType}`} >
        <div className="cell-value">
          <input
            type="text"
            onKeyDown={(e) => {
              e.key === 'Enter' && onEditColumnValue()
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => onEditColumnValue()}
            className="edit-input new-value"
          />
        </div>
      </div>
    )
}
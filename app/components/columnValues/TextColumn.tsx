import { useRef, useState } from "react"

export default function TextColumn({column, columnValue, updateColumnValue}: {column: Column, columnValue: any, updateColumnValue: Function}) {

    const [value, setValue] = useState<string>(columnValue?.value || '')

    const textColumnRef = useRef<HTMLInputElement>(null)

    const onEditColumnValue = () => {
        if(columnValue.value === value) return
        textColumnRef?.current?.blur()

        updateColumnValue({columnValueId: columnValue.id, value, key: 'value' })
    }


    return (
        <div className="cell-value">
          <input
            ref={textColumnRef}
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

    )
}
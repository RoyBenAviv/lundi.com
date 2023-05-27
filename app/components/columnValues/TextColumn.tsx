import { useRef, useState } from "react"

export default function TextColumn({ column, columnValue, updateColumnValue, item, boardId, groupId }: { column: Column; columnValue: any; updateColumnValue: Function, item: Item, boardId: string, groupId: string }) {

    const [value, setValue] = useState<string>(columnValue?.value || '')

    const textColumnRef = useRef<HTMLInputElement>(null)

    const onEditColumnValue = () => {
        if(columnValue.value === value) return
        textColumnRef?.current?.blur()

        updateColumnValue({columnValueId: columnValue.id, item, boardId, groupId, value, key: 'value' })
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
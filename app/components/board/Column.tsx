import { useUpdateColumn } from '@/app/hooks/useQuery'
import { Resizable } from 're-resizable'
import { useEffect, SetStateAction } from 'react'

export default function Column({ column, columnsWidth, setColumnsWidth }: { column: Column; columnsWidth: any; setColumnsWidth: React.Dispatch<SetStateAction<any>>; }) {

    const { mutate: updateColumn } = useUpdateColumn(column)

    const onSetColumnWidth = (dWidth: number) => {
        updateColumn({ value: column.width + dWidth, key: 'width' })
        setColumnsWidth((prevColumnsWidth: any) => {
             const currColumnIdx = prevColumnsWidth.findIndex((currColumn: any) => column.id === currColumn.id)
              prevColumnsWidth[currColumnIdx].width += dWidth
              return [...prevColumnsWidth]
        })
    }

  return ( 
    <Resizable enable={{ right: true }} minWidth={120} onResizeStop={(e, direction, ref, d) => onSetColumnWidth(d.width)} handleClasses={{ right: 'custom-handle' }} >
      <div style={{ width: columnsWidth.find((currColumn: any) => column.id === currColumn.id).width + 1}} className="column column-handle">
        <span>{column.name}</span>
      </div>
    </Resizable>
  )
}

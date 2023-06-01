import { useUpdateColumn } from '@/app/hooks/useQuery'
import { Resizable } from 're-resizable'
import { useState } from 'react'

export default function Column({ column }: { column: Column }) {

    const { mutate: updateColumn } = useUpdateColumn(column)

    const onSetColumnWidth = (dWidth: number) => {
        updateColumn({ value: column.width + dWidth, key: 'width' })

    }
    


  return ( 
    <Resizable enable={{ right: true }} minWidth={120} onResizeStop={(e, direction, ref, d) => onSetColumnWidth(d.width)} handleClasses={{ right: 'custom-handle' }} >
      <div style={{ width: column.width + 1 }} className="column">
        <span>{column.name}</span>
      </div>
    </Resizable>
  )
}

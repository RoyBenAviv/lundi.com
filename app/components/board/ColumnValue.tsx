import { useUpdateColumnValue } from '@/app/hooks/useQuery'
import { useRef, useState } from 'react'
import StatusColumn from '../columnValues/StatusColumn';
import TextColumn from '../columnValues/TextColumn'

export default function ColumnValue({ column, columnValue, itemId }: { column: Column; columnValue: any; itemId: string }) {
  const { mutate: updateColumnValue } = useUpdateColumnValue()

  const DynamicColumnValue = ({column, columnValue}: {column: Column; columnValue: any}): JSX.Element => {
    switch (column.columnType) {
      case 'text':
        console.log('column2', column)
        return <TextColumn column={column} columnValue={columnValue} updateColumnValue={updateColumnValue} />
      case 'status':
        return <StatusColumn column={column} columnValue={columnValue} updateColumnValue={updateColumnValue} />
      default:
        return <></>
    }
  }

  return (
    <div className={`cell ${column.columnType}`}>
      <DynamicColumnValue columnValue={columnValue} column={column} />
    </div>
  )
}

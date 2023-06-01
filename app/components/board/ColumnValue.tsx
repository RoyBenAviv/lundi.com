import { useUpdateColumnValue } from '@/app/hooks/useQuery'
import { useRef, useState } from 'react'
import StatusColumn from '../columnValues/StatusColumn';
import TextColumn from '../columnValues/TextColumn'

export default function ColumnValue({ column, columnValue, item, boardId, groupId }: { column: Column; columnValue: any; item: Item, boardId: string, groupId: string }) {
  const { mutate: updateColumnValue } = useUpdateColumnValue()

  const DynamicColumnValue = ({column, columnValue}: {column: Column; columnValue: any}): JSX.Element => {
    switch (column.columnType) {
      case 'text':
        return <TextColumn column={column} columnValue={columnValue} updateColumnValue={updateColumnValue} item={item} boardId={boardId} groupId={groupId}/>
      case 'status':
        return <StatusColumn column={column} columnValue={columnValue} updateColumnValue={updateColumnValue} item={item} boardId={boardId} groupId={groupId}/>
      default:
        return <></>
    }
  }

  return (
    <div style={{width: column.width}} className={`cell ${column.columnType}`}>
      <DynamicColumnValue columnValue={columnValue} column={column} />
    </div>
  )
}

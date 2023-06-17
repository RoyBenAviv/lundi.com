import useOnClickOutside from '@/app/hooks/useOnClickOutside'
import {  DatePicker } from 'monday-ui-react-core'
import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import moment from 'moment'
import { RangeDate } from 'monday-ui-react-core/dist/types/components/DatePicker/types'
const { Add, Calendar, Close } = require('monday-ui-react-core/icons')
export default function DateColumn({ column, columnValue, updateColumnValue, item, boardId, groupId }: { column: Column; columnValue: any; updateColumnValue: Function; item: Item; boardId: string; groupId: string }) {
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false)
  const dateColumnRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(dateColumnRef, () => setIsOpenDatePicker(false))

  const onEditColumnValue = (dateEvent:  moment.Moment | RangeDate | any) => {
    console.log('file: DateColumn.tsx:14 -> dateEvent:', dateEvent)
    let day = dateEvent._d.getDate();
    let month = dateEvent._d.getMonth() + 1;
    const year = dateEvent._d.getFullYear();
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    let dateToChange = `${year}-${month}-${day}`;
    console.log('file: DateColumn.tsx:23 -> dateToChange:', dateToChange)
    updateColumnValue({ columnValueId: columnValue.id, item, boardId, groupId, value: dateToChange, key: 'value' })
    setIsOpenDatePicker(false)
  }

  const onRemoveColumnValue = () => {
    updateColumnValue({ columnValueId: columnValue.id, item, boardId, groupId, value: null, key: 'value' })
    setIsOpenDatePicker(false)
  }


  return (
    <div ref={dateColumnRef} onClick={() => setIsOpenDatePicker((isOpenDatePicker) => !isOpenDatePicker)} className={isOpenDatePicker ? 'cell-value open' : 'cell-value close'}>
        <div className={columnValue.value ? 'date-value-container value' : 'date-value-container empty'}>
          {(!isOpenDatePicker && !columnValue.value) && <div className="empty-date"><button className='add-date-btn'><Add/></button><Calendar/></div>}
          {(!isOpenDatePicker && columnValue.value) && <button className='remove-date-btn' onClick={() => onRemoveColumnValue()}><Close/></button>}
          {columnValue?.value ? new Date(columnValue.value).toDateString() : ''}
        </div>
      <CSSTransition timeout={150} in={isOpenDatePicker} classNames="container-transition">
        <>{isOpenDatePicker && 

        <div className='date-picker-container'>
          <DatePicker date={columnValue.value  ? moment(columnValue.value) : moment(new Date())} onPickDate={(dateEvent) => onEditColumnValue(dateEvent)} />
        </div>
}
        </>
      </CSSTransition>
    </div>
  )
}

import useOnClickOutside from '@/app/hooks/useOnClickOutside';
import { useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group';

interface StatusOption {
  type?: string
  name: string
  color: string
}

export default function StatusColumn({ column, columnValue, updateColumnValue, item, boardId, groupId }: { column: Column; columnValue: any; updateColumnValue: Function, item: Item, boardId: string, groupId: string }) {
  console.log('file: StatusColumn.tsx:12 -> columnValue:', columnValue)
  const [isOpenStatusOptions, setIsOpenStatusOptions] = useState<boolean>(false)

  
  const statusOptionsRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(statusOptionsRef, () => setIsOpenStatusOptions(false))

  const onEditColumnValue = (option: StatusOption) => {
    updateColumnValue({ columnValueId: columnValue.id, item, boardId, groupId, value: option, key: 'value' })
    setIsOpenStatusOptions(false)
  }

  return (
    <div onClick={() => setIsOpenStatusOptions((isOpenStatusOptions) => !isOpenStatusOptions)} style={!columnValue.value || columnValue.value.type === 'default' ? { backgroundColor: column.options[0].color } : { backgroundColor: columnValue.value.color }} className="cell-value">
        {columnValue.value?.name}
        <CSSTransition timeout={150} in={isOpenStatusOptions} classNames="container-inside-transition">
            <>
      {isOpenStatusOptions && (
          <div ref={statusOptionsRef} onClick={(e) => e.stopPropagation()} className="status-options">
          {column.options.map((option: StatusOption) => (
              <span onClick={() => onEditColumnValue(option)} style={{ backgroundColor: option.color }} key={option.name}>
              {option.name}
            </span>
          ))}
        </div>
      )}
      </>
      </CSSTransition>
    </div>
  )
}

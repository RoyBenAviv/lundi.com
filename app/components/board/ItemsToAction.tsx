const { Close, Delete, Doc, Duplicate } = require('monday-ui-react-core/icons')
import { useDeleteItem } from '@/app/hooks/useQuery'
import { Dispatch, SetStateAction } from 'react'

export default function ItemsToAction({ currentBoardId, itemsToAction, setItemsToAction, boardItemsType, onExportItems, onDuplicateItems }: { currentBoardId: string; itemsToAction: (string | undefined)[]; setItemsToAction: Dispatch<SetStateAction<(string | undefined)[]>>; boardItemsType: string; onExportItems: Function; onDuplicateItems: Function }) {
  const { mutate: deleteItems } = useDeleteItem(currentBoardId)

  const onDeleteItems = () => {
    deleteItems(itemsToAction)
    setItemsToAction([])
  }


  return (
    <section className="items-action">
      <div className="number-of-items">{itemsToAction.length}</div>

      <h3>
        {boardItemsType}
        {itemsToAction.length > 1 && 's'} Selected
      </h3>
      <div className="actions">
        <div className="action" onClick={() => onDuplicateItems()}>
          <Duplicate />
          <p>Duplicate</p>
        </div>
        <div className="action" onClick={() => onExportItems()}>
          <Doc />
          <p>Export</p>
        </div>
        <div className="action" onClick={() => onDeleteItems()}>
          <Delete />
          <p>Delete</p>
        </div>
      </div>

      <div className="close" onClick={() => setItemsToAction([])}>
        <Close />
      </div>
    </section>
  )
}

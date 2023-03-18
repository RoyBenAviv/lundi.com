'use client'

const { NavigationChevronDown, Add } = require('monday-ui-react-core/icons')

export default function Group({ group, columns, boardItemsType }: { group: Group; columns: Column[], boardItemsType:string }) {
  return (
    <section className="group-container">
      <header>
        <h4 style={{ color: group.color }}>
          <NavigationChevronDown /> {group.name}
        </h4>
      </header>
      <section className="board-data-table">
        <div className="table-header">
          <div className="column column-title">
            <span>Name</span>
          </div>
          {columns.map((column: any) => (
            <div className="column" key={column.id}>
              <span>{column.name}</span>
            </div>
          ))}
        </div>
        <div className="table-body">
          {group.items.map((item: Item) => (
            <div className="table-row" key={item.id}>
              <div className="cell item-name">
                <span>{item.name}</span>
              </div>
              {columns.map((column: Column) => {
                const columnValue = item.columnValues.find((cv: any) => cv.columnId === column.id)
                return (
                  <div className="cell" key={column.id}>
                    {columnValue && columnValue.value}
                  </div>
                )
              })}
            </div>
          ))}
              <div className="table-row add-item"><span><Add/> {`Add ${boardItemsType}`}</span></div>
        </div>
      </section>
    </section>
  )
}

'use client'

const { NavigationChevronDown } = require('monday-ui-react-core/icons')

export default function Group({ group, columns }: { group: Group; columns: any }) {
  return (
    <section className="group-container">
      <header>
        <h3>
          <NavigationChevronDown /> {group.name}
        </h3>
      </header>
      <section className="board-data-table">
        <div className="table-header">
          <div className="cell">Name</div>
          {columns.map((column: any) => (
            <div className="cell" key={column.id}>
              {column.name}
            </div>
          ))}
        </div>
        <div className="table-body">
          {group.items.map((item: any) => (
            <div className="table-row" key={item.id}>
              <div className="cell">{item.name}</div>
              {columns.map((column: any) => {
                const columnValue = item.columnValues.find((cv: any) => cv.columnId === column.id)
                return (
                  <div className="cell" key={column.id}>
                    {columnValue && columnValue.value}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

'use client'

const { NavigationChevronDown } = require('monday-ui-react-core/icons')

export default function Group({ group, columns }: { group: Group, columns: any }) {
  return <section className="group-container">
    <header>
        <h3><NavigationChevronDown/> {group.name}</h3>
    </header>
    <section className="board-data-table">
  <div className="columns">
    <div>Name</div>
    {
      columns.map((column: Column) => (
        <div key={column.id}>
          {column.name}
        </div>
      ))
    }
  </div>
  <div className="test">
    {
      group.items.map((item: any) => (
        <div className="test2" key={item.id}>
          <div >{item.name}</div>
          {
            item.columnValues.map((columnValue: any) => (
              <div key={columnValue.id}>{columnValue.value}</div>
            ))
          }
          </div>
      ))
    }
  </div>
  
</section>
  </section>
}

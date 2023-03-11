import Group from '../Group/Group'
const { Home } = require('monday-ui-react-core/icons')
export default function BoardHome({ board }: { board: Board }) {
  console.log('file: BoardHome.tsx:7 -> board:', board)
  return (
    <main className="board-home">
      <header>
        <h2>{board.name}</h2>
      </header>
      <section>
        {/* <table border={1}>
          <tr>
            <th>Name</th>
            {board.columns.map((column: any) => (
              <th key={column.id}>{column.name}</th>
            ))}
          </tr>
              {
                board.groups[0].items.map((item: any) => (
                          <>
                  <tr key={item.id}>
                          <td>{item.name}</td>
                  {
                    item.columnValues.map((columnValue: any) => (
                      <tr key={columnValue.id}>
                         <td> {columnValue.value}</td>
                      </tr>
                    ))
                  }

                  </tr>
                  <>
                  </>
                  </>
                ))
              }
        </table> */}




              {board.groups.map((group: Group) => (
                <Group key={group.id} group={group} columns={board.columns} />
              ))}
        <pre>{JSON.stringify(board, null, 2)}</pre>
      </section>
    </main>
  )
}

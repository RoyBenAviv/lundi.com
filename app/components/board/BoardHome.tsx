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
              {board.groups.map((group: Group) => (
                <Group key={group.id} group={group} columns={board.columns} boardItemsType={board.boardItemsType}/>
              ))}
        <pre>{JSON.stringify(board, null, 2)}</pre>
      </section>
    </main>
  )
}

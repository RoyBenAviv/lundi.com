"use client"

import { useQuery } from '@tanstack/react-query'
import Group from './Group'
const { Home } = require('monday-ui-react-core/icons')
export default function BoardHome({ board }: { board: Board }) {
  console.log('file: BoardHome.tsx:7 -> board:', board)

    // const { data: boardData } = useQuery<Board[]>(['board', board.id], () => board.groups)
    const { data: currentBoard } = useQuery(['board', board.id], () => board)

  return (  
    <main className="board-home">
      <header>
        <h2>{currentBoard?.name}</h2>
      </header>
      <section>
              {currentBoard?.groups.map((group: Group) => (
                <Group key={group.id} group={group} columns={currentBoard.columns} boardItemsType={currentBoard.boardItemsType} workspaceId={currentBoard.workspaceId} boardId={currentBoard.id}/>
              ))}
        <pre>{JSON.stringify(currentBoard, null, 2)}</pre>
      </section>
    </main>
  )
}

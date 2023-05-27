"use client"

import { useUpdateBoard } from "@/app/hooks/useQuery"
import Image from "next/image"
const { Board, Favorite } = require('monday-ui-react-core/icons')
import { useRouter } from 'next/navigation'
const recentBoardImg = require('../../assets/images/recent-board.svg')

export default function RecentlyVisitedBoards({boards}: {boards: Board[]}) {
    const {mutate: updateMutate} = useUpdateBoard()
    const router = useRouter()

    const onNavigateBoard = (board: Board) => {
        router.push(`/workspaces/${board.workspaceId}/boards/${board.id}`)
        updateMutate({ boardId: board.id!, value: new Date(), key: 'recentlyVisited' })
    }

    return <section className="recent-boards">
        <h2>Recently Visited</h2>
        <ul>
            {boards.map((board: Board) => (
                <li onClick={() => onNavigateBoard(board)} key={board.id}>
                <Image src={recentBoardImg} alt="recent-board" />
                <div className="board-name"><div><Board/> <h2>{board.name}</h2> </div><Favorite/></div>
                <div></div>
                </li>
            ))}
        </ul>
    </section>

}
import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function PUT(request: Request) {
  const sortedBoards = await request.json()
  console.log('file: route.ts:6 -> sortedBoards:', sortedBoards)
  await prisma.$transaction(
    sortedBoards.map((board: Board) =>
      prisma.boards.update({
        where: { id: board.id },
        data: { order: board.order },
      })
    )
  )

  return new Response('success', { status: 200 })
}

export async function POST(request: Request) {
  try {
    const newBoard  = await request.json()
    console.log('file: route.ts:22 -> newBoard:', newBoard)
    const board = await prisma.boards.create({
      data: {
        name: newBoard.name,
        workspaceId: newBoard.workspaceId,
        groups: {
          create: [
            {
              name: newBoard.groups[0].name,
              color: newBoard.groups[0].color,
              items: {
                create: newBoard.groups[0].items,
              },
            },
            {
              name: newBoard.groups[1].name,
              color: newBoard.groups[1].color,
              items: {
                create: newBoard.groups[1].items,
              },
            },
          ],
        },
        columns: {
          create: newBoard.columns,
        },
      },
    })

    return NextResponse.json(board)
  } catch (err) {
    console.log('file: route.ts:23 -> err:', err)
  }
}

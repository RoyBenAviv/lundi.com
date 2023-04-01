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
    const newBoard = await request.json()
    console.log('file: route.ts:22 -> newBoard:', newBoard)

    const board = await prisma.boards.create({
      data: {
        columns: {
          create: newBoard.columns,
        },
        name: newBoard.name,
        workspaceId: newBoard.workspaceId,
        groups: {
          create: [
            {
              name: newBoard.groups[0].name,
              color: newBoard.groups[0].color,
              items: {
                create: newBoard.groups[0].items.map((item: any) => ({
                  ...item,
                  columnValues: {
                    create: [
                      { 
                        value: '',
                        column: { connect: { id: newBoard.columns[0].id } },
                      },
                      {
                        value: '',
                        column: { connect: { id: newBoard.columns[1].id } },
                      },
                    ],
                  },
                })),
              },
            },
            {
              name: newBoard.groups[1].name,
              color: newBoard.groups[1].color,
              items: {
                create: newBoard.groups[1].items.map((item: any) => ({
                  ...item,
                  columnValues: {
                    create: [
                      {
                        value: '',
                        column: { connect: { id: newBoard.columns[0].id } },
                      },
                      {
                        value: '',
                        column: { connect: { id: newBoard.columns[1].id } },
                      },
                    ],
                  },
                })),
              },
            },
          ],
        },
      },
    })

    return NextResponse.json(board)
  } catch (err) {
    console.log('file: route.ts:23 -> err:', err)
  }
}

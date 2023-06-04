import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function GET(request: Request) {
  try {
    const boards = await prisma.boards.findMany({
      where: {
        recentlyVisited: {
          not: null,
        },
      },
      orderBy: {
        recentlyVisited: 'desc',
      },
      include: {
        workspace: true,
      },
    })
    return NextResponse.json(boards)
  } catch (err) {
    console.log('file: route.ts:8 -> err:', err)
  }
}

interface NewItem extends Item {
  columnValuesVal: any[]
}

export async function PUT(request: Request) {
  const sortedBoards = await request.json()
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
    const board = await prisma.boards.create({
      data: {
        columns: {
          create: newBoard.columns,
        },
        boardItemsType: newBoard.boardItemsType,
        name: newBoard.name,
        workspaceId: newBoard.workspaceId,
        groups: {
          create: [
            {
              name: newBoard.groups[0].name,
              color: newBoard.groups[0].color,
              order: newBoard.groups[0].order,
              items: {
                create: newBoard.groups[0].items.map((item: NewItem) => ({
                  id: item.id,
                  name: item.name,
                  order: item.order,
                  columnValues: {
                    create: [
                      {
                        value: item.columnValuesVal[0],
                        column: { connect: { id: newBoard.columns[0].id } },
                      },
                      {
                        value: item.columnValuesVal[1],
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
              order: newBoard.groups[1].order,
              items: {
                create: newBoard.groups[1].items.map((item: NewItem) => ({
                  id: item.id,
                  name: item.name,
                  order: item.order,
                  columnValues: {


                    create: [
                      {
                        value: item.columnValuesVal[0],
                        column: { connect: { id: newBoard.columns[0].id } },
                      },
                      {
                        value: item.columnValuesVal[1], 
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

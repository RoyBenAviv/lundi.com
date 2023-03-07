import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/client'

interface Params {
  id: string
}
export async function GET(request: Request, { params }: { params: Params }) {
  const board = await prisma.boards.findUnique({
    where: { id: params.id },
    include: {
      Workspace: {
        include: {
          boards: {
            include: { items: true },
          },
        },
      },
    },
  })
  console.log('file: route.ts:13 -> board:', board)

  return NextResponse.json(board)
}

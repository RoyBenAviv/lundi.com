import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/client'

interface Params {
  id: string
}
export async function GET(request: Request, { params }: { params: Params }) {
  const board = await prisma.boards.findUnique({
    where: { id: params.id },
    include: {
      groups: {
        include: {
          items: true
        }
      }
    },
  })
  return NextResponse.json(board)
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const {value, key} = await request.json()
  const updatedBoard = await prisma.boards.update({
    where: { id: params.id },
    data: {
      [key]: value
    }
  });
  return NextResponse.json(updatedBoard)
}

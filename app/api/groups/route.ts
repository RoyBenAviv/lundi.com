import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function PUT(request: Request) {
  const { boardId, value, key } = await request.json()

  if(key === 'sorting') {
    await prisma.$transaction(
      value.map((group: Group) =>
        prisma.groups.update({
          where: { id: group.id },
          data: { order: group.order },
        })
      )
    )
  } else {
    await prisma.groups.updateMany({
      where: {boardsId: boardId},
      data: {
        [key]: value,
      },
    })
  }

  return NextResponse.json({ status: 200 })
}

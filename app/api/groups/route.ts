import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function PUT(request: Request) {
  const { boardId, value, key } = await request.json()

  if (key === 'sorting') {
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
      where: { boardsId: boardId },
      data: {
        [key]: value,
      },
    })
  }

  return NextResponse.json({ status: 200 })
}

export async function POST(request: Request) {
  const { newGroup } = await request.json()
  newGroup.items = {
    create: []
  }

  try {
    const createdGroup = await prisma.groups.create({
      data: newGroup,
    })

    return NextResponse.json(createdGroup)
  } catch (err) {
    console.log('file: route.ts:34 -> err:', err)
  }
}

import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function POST(request: Request) {
  try {
    const { newItem, isMany } = await request.json()
    if (isMany) {
      console.log('newItem',newItem);

      const columnValues = newItem.flatMap((item: any) => {
            return item.columnValues.map((columnValue: any) => {
              return {
                columnId: columnValue.columnId,
                itemId: item.id,
                value: ''
              }
            })
      })

      console.log('columnValues',columnValues);

      newItem.forEach((item: any) => delete item.columnValues)

      const items = await prisma.item.createMany({
        data: newItem
      })

      await prisma.columnValue.createMany({
        data: columnValues
      }) 

      return NextResponse.json(items)
    } else {
      const item = await prisma.item.create({
        data: {
          name: newItem.name,
          groupId: newItem.groupId,
          boardId: newItem.boardId,
          order: newItem.order,
          columnValues: {
            create: newItem.columnValues.map((columnValue: any) => ({
              value: '',
              id: columnValue.id,
              column: {
                connect: { id: columnValue.columnId },
              },
            })),
          },
        },
      })
      return NextResponse.json(item)
    }
  } catch (err) {
    console.log('file: route.ts:23 -> err:', err)
  }
}

export async function DELETE(request: Request, response: Response) {
  const itemsId = await request.json()
  try {
    await prisma.columnValue.deleteMany({
      where: {
        itemId: {
          in: itemsId, // Filter items where ID is in the array of IDs
        },
      },
    })

    await prisma.item.deleteMany({
      where: {
        id: {
          in: itemsId, // Filter items where ID is in the array of IDs
        },
      },
    })

    return NextResponse.json({ status: 200 })
  } catch (err: any) {
    console.log('file: route.ts:55 -> err:', err)
  }
}

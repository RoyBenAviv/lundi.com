import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function POST(request: Request) {
    try {

      
      const newItem  = await request.json()
      console.log('newItems.columnValues',newItem.columnValues);
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
                connect: { id: columnValue.columnId }
              }
            }))
          }
        }
      });
  
      return NextResponse.json(item)
    } catch (err) {
      console.log('file: route.ts:23 -> err:', err)
    }
  }
  
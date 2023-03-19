import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/client'

interface Params {
  id: string
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const { value, key } = await request.json()
  console.log('file: route.ts:10 -> value, key:', value, key)
  const updatedItem = await prisma.item.update({
    where: { id: params.id }, // specify the object to update by its ID
    data: {
      [key]: value, // update the value of the key property
    },
  })

  return NextResponse.json(updatedItem)
}

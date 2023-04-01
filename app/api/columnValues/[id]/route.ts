import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/client'

interface Params {
  id: string
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const { value, key } = await request.json()
  console.log('params.id',params.id);
  console.log('file: route.ts:10 -> value, key:', value, key)
  const updatedColumnValue = await prisma.columnValue.update({
    where: { id: params.id },
    data: {
      [key]: value
    },
  })
  console.log('file: route.ts:18 -> updatedColumnValue:', updatedColumnValue)

  return NextResponse.json(updatedColumnValue)
}

import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/client'

interface Params {
  id: string
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const { value, key } = await request.json()
  const updatedColumnValue = await prisma.columnValue.update({
    where: { id: params.id },
    data: {
      [key]: value
    },
  })

  return NextResponse.json(updatedColumnValue)
}

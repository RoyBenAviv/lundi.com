import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/client'

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: { boards: {
      include: {groups: {
        include: {items: true}
      }}
    } },
  })
  return NextResponse.json(workspace)
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const {value, key} = await request.json()
  const updatedWorkspace = await prisma.workspace.update({
    where: { id: params.id }, // specify the object to update by its ID
    data: {
      [key]: value // update the value of the key property
    }
  });

  return NextResponse.json(updatedWorkspace)
}


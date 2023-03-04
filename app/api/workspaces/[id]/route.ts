import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/client'

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: { boards: true },
  })
  return NextResponse.json(workspace)
}

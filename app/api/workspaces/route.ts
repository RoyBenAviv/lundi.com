

import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function GET(request: Request) {
  const workspaces = await prisma.workspace.findMany({})
  return NextResponse.json(workspaces)
}

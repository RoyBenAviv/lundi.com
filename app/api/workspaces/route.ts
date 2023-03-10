import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function GET(request: Request) {
  const workspaces = await prisma.workspace.findMany({})
  return NextResponse.json(workspaces)
}

export async function POST(request: Request) {
  const newWorkspace = await request.json()
  console.log('file: route.ts:11 -> newWorkspace:', newWorkspace)
  const workspaces = await prisma.workspace.create({ data: newWorkspace })
  return NextResponse.json(workspaces)
}

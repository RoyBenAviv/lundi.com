

import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function GET(request: Request) {
  const workspaces = await prisma.workspace.findMany({})
  console.log('file: route.ts:8 -> workspaces:', workspaces)
  return NextResponse.json(workspaces)
}

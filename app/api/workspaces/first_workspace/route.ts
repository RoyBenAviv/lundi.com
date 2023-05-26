import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/client'

export async function GET(request: Request) {
    const workspaceByRecentlyVisited = await prisma.workspace.findFirst({
      orderBy: {
        recentlyVisited: 'asc',
      }
    })
    if (workspaceByRecentlyVisited) {
        return NextResponse.json(workspaceByRecentlyVisited.id)
      } else {
        const firstWorkspace = await prisma.workspace.findFirst()
        return NextResponse.json(firstWorkspace?.id)
      }
  }
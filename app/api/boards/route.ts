import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function PUT(request: Request) {
    const sortedBoards = await request.json();
    console.log('file: route.ts:6 -> sortedBoards:', sortedBoards)
    await prisma.$transaction(
      sortedBoards.map((board: any) =>
        prisma.boards.update({
          where: { id: board.id },
          data: { order: board.order },
        })
      )
    );

    return new Response('success', {status: 200})
  }
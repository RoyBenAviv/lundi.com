import { NextResponse } from 'next/server'
import prisma from '../../../prisma/client'

export async function POST(request: Request) {
    try {
      const newItem  = await request.json()
      const item = await prisma.item.create({ data: newItem })
      console.log('file: route.ts:8 -> item:', item)
  
      return NextResponse.json(item)
    } catch (err) {
      console.log('file: route.ts:23 -> err:', err)
    }
  }
  
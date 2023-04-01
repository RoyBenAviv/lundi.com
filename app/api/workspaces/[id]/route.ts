import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/client'

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: {
      boards: {
        include: {
          columns: true,
          groups: {
            include: {
              items: {
                include: {
                  columnValues: true,
                }
              }
            }
          }
        }
      }
    }
  })
  console.log('file: route.ts:28 -> workspace:', workspace)
  return NextResponse.json(workspace)
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const {value, key} = await request.json()
  const updatedWorkspace = await prisma.workspace.update({
    where: { id: params.id },
    data: {
      [key]: value
    }
  });

  return NextResponse.json(updatedWorkspace)
}


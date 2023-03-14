import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { getBoard, getWorkspace, getWorkspaces } from '../services/appService'

export const useGetWorkspace = (workspaceId: string, initialData: Workspace | null) => {
  return useQuery(
    ['workspace', workspaceId],
    async () => {
      const workspace = await getWorkspace(workspaceId)
      console.log('file: useQuery.ts:8 -> workspace:', workspace)
      return workspace
    },
    {
      initialData: initialData || null,
    }
  )
}

export const useGetWorkspaces = (workspaces?: Workspace[]) => {
  return useQuery(
    ['workspaces'],
    async () => {
      const workspaces = await getWorkspaces()
      return workspaces
    },
    {
      initialData: workspaces,
    }
  )
}

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ workspaceId, value, key }: { workspaceId: string; value: string; key: string }) => {
      return axios.put(`http://localhost:3000/api/workspaces/${workspaceId}`, { value, key })
    },
    {
      onMutate: async ({ workspaceId, value, key }: { workspaceId: string; value: string; key: string }) => {
        await queryClient.cancelQueries({ queryKey: ['workspace', workspaceId] })
        const previousWorkspace: Workspace | undefined = queryClient.getQueryData(['workspace', workspaceId])
        const updatedWorkspace = { ...previousWorkspace, [key]: value }
        queryClient.setQueryData(['workspace', workspaceId], updatedWorkspace)
        return { updatedWorkspace }
      },
      onSuccess: ({ data: currentWorkspace }) => {
        queryClient.invalidateQueries(['workspace', currentWorkspace.id])
      },
    }
  )
}

export const useAddWorkspace = () => {
  const queryClient = useQueryClient()

  const router = useRouter()

  return useMutation(
    (newWorkspace: Workspace) => {
      return axios.post('http://localhost:3000/api/workspaces', newWorkspace)
    },
    {
      onMutate: async (newWorkspace: Workspace) => {
        await queryClient.cancelQueries({ queryKey: ['workspaces'] })
        const previousWorkspaces: Workspace[] | undefined = queryClient.getQueryData<Workspace[]>(['workspaces'])
        const updatedWorkspaces = [...previousWorkspaces!, newWorkspace]
        queryClient.setQueryData(['workspaces'], updatedWorkspaces)
        return { updatedWorkspaces }
      },
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['workspaces'])
        router.push(`/workspaces/${data.id}`)
      },
    }
  )
}

export const useAddBoard = () => {
  const queryClient = useQueryClient()

  const router = useRouter()

  return useMutation(
    (newBoard: any) => {
      return axios.post('http://localhost:3000/api/boards', newBoard)
    },
    {
      onMutate: async (newBoard: any) => {
        await queryClient.cancelQueries({ queryKey: ['boards'] })
        const previousBoards = queryClient.getQueryData<Board[]>(['boards'])
        console.log('file: useQuery.ts:92 -> previousBoards:', previousBoards)
        const updatedBoards = [...previousBoards!, newBoard]
        queryClient.setQueryData(['boards'], updatedBoards)

        return { updatedBoards }
      },
      onSuccess: ({ data }) => {
        console.log('file: useQuery.ts:99 -> data:', data)
        queryClient.invalidateQueries(['boards'])
        router.push(`/workspaces/${data.workspaceId}/boards/${data.id}`)
      },
      onError: () => {
        console.log('err?')
      }
    }
  )
}

export const useSortBoards = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (workspaceBoards: any[]) => {
      return axios.put('http://localhost:3000/api/boards', workspaceBoards)
    },
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['boards'])
      },
    }
  )
}

export const useGetBoard = (currentBoard: Board) => {
  return useQuery(
    ['board', currentBoard.id],
    async () => {
      const board = await getBoard(currentBoard.id)
      console.log('file: useQuery.ts:24 -> board:', board)
      return board
    },
    {
      initialData: currentBoard,
    }
  )
}

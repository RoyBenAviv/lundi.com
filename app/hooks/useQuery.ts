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
export const useUpdateItem = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ itemId, value, key }: { itemId: string ; value: string; key: string }) => {
      return axios.put(`http://localhost:3000/api/items/${itemId}`, { value, key })
    },
    {
      // onMutate: async ({ itemId, value, key }: { itemId: string; value: string; key: string }) => {
      //   await queryClient.cancelQueries({ queryKey: ['workspace', itemId] })
      //   const previousWorkspace: Workspace | undefined = queryClient.getQueryData(['workspace', itemId])
      //   const updatedWorkspace = { ...previousWorkspace, [key]: value }
      //   queryClient.setQueryData(['workspace', workspaceId], updatedWorkspace)
      //   return { updatedWorkspace }
      // },
      // onSuccess: ({ data: currentWorkspace }) => {
      //   queryClient.invalidateQueries(['workspace', currentWorkspace.id])
      // },
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
        router.push(`/workspaces/${newWorkspace.id}`)
        return { updatedWorkspaces }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['workspaces'])
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
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['board', data.id])
        router.push(`/workspaces/${data.workspaceId}/boards/${data.id}`)
      },
      onError: () => {
        console.log('err?')
      },
    }
  )
}

interface NewItem {
  name: string
  groupId: string
  boardId: string
  order: number
}

export const useAddItem = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ( newItem: NewItem ) => {
      return axios.post(`http://localhost:3000/api/items`, newItem)
    },

    {
      onMutate: async (newItem) => {
        console.log('file: useQuery.ts:109 -> newItem:', newItem)
        // await queryClient.cancelQueries({ queryKey: ['workspace', workspaceId] })
        await queryClient.cancelQueries({ queryKey: ['board', newItem.boardId] })
        const previousBoard = queryClient.getQueryData<Board>(['board', newItem.boardId])!
        console.log('file: useQuery.ts:119 -> previousBoard:', previousBoard)
        const groupIdx = previousBoard.groups.findIndex(group => group.id === newItem.groupId)

        previousBoard.groups[groupIdx].items.push(newItem)


        queryClient.setQueryData(['board', newItem.boardId], previousBoard)
        return { previousBoard }
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
      onSuccess: () => {
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
      return board
    },
    {
      initialData: currentBoard,
    }
  )
}

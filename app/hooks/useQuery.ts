import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { getBoard, getWorkspace, getWorkspaces } from '../services/appService'

export const useGetWorkspace = (workspace: Workspace) => {
  return useQuery(
    ['workspace', workspace.id],
    async () => {
      const currentWorkspace: Workspace = await getWorkspace(workspace.id!)
      return currentWorkspace
    },
    {
      initialData: workspace,
    }
  )
}

export const useGetWorkspaces = () => {
  return useQuery(
    ['workspaces'],
    async () => {
      const workspaces = await getWorkspaces()
      return workspaces
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
      onError:(err) =>  {
          console.log('err222', err)
      },
      onSuccess: ({ data: item }) => {
        // const previousWorkspace: Workspace | undefined = queryClient.getQueryData(['item', item.id])
        // console.log('file: useQuery.ts:66 -> previousWorkspace:', previousWorkspace)
        // console.log('file: useQuery.ts:66 -> previousWorkspace:', previousWorkspace)
        console.log('item.boardId',item.boardId);
        queryClient.invalidateQueries(['board', item.boardId])
        // queryClient.refetchQueries(['item', item.id])
      },
    }
  )
}

export const useUpdateColumnValue = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ columnValueId, value, key }: { columnValueId: string; value: string; key: string }) => {
      return axios.put(`http://localhost:3000/api/columnValues/${columnValueId}`, { value, key })
    },
    {
      onSuccess: ({ data: item }) => {
        // queryClient.invalidateQueries(['board', item.boardId])
        // queryClient.refetchQueries(['board', item.boardId])
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

export const useAddItem = (itemPosition: string) => {
  console.log('file: useQuery.ts:150 -> itemPosition:', itemPosition)
  const queryClient = useQueryClient()
  return useMutation(
    ( newItem: NewItem ) => {
      return axios.post(`http://localhost:3000/api/items`, newItem)
    },

    {
      onMutate: async (newItem) => {
        console.log('here? 222')


        await queryClient.cancelQueries({ queryKey: ['board', newItem.boardId] })
        const previousBoard = queryClient.getQueryData<Board>(['board', newItem.boardId])!
        const groupIdx = previousBoard.groups.findIndex(group => group.id === newItem.groupId)

        itemPosition === 'bottom' ? previousBoard.groups[groupIdx].items.push(newItem) : previousBoard.groups[groupIdx].items.unshift(newItem)


        queryClient.setQueryData(['board', newItem.boardId], previousBoard)
        return { previousBoard }
      }, 
      onSuccess: ({data: newItem}) => {
        console.log('file: useQuery.ts:173 -> newItem:', newItem)
        console.log('success')
        queryClient.invalidateQueries(['board', newItem.boardId])
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

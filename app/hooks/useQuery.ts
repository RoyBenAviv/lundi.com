import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { getBoard, getWorkspace, getWorkspaces } from '../services/appService'

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://lundi-com-roybenaviv.vercel.app'

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
  return useQuery(['workspaces'], async () => {
    const workspaces = await getWorkspaces()
    return workspaces
  })
}

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ workspaceId, value, key }: { workspaceId: string; value: string | Date; key: string }) => {
      return axios.put(`${BASE_URL}/api/workspaces/${workspaceId}`, { value, key })
    },
    {
      onMutate: async ({ workspaceId, value, key }: { workspaceId: string; value: string | Date; key: string }) => {
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


export const useUpdateColumn = (column: Column) => {
        const columnId = column.id
        const boardId = column.boardsId
        const queryClient = useQueryClient()
  return useMutation(
    ({ value, key }: { value: number; key: string }) => {
      return axios.put(`${BASE_URL}/api/columns/${columnId}`, { value, key })
    },
    {
      onMutate: ({ value, key }: { value: number; key: string }) => {
        console.log('file: useQuery.ts:74 ->  value, key:',  value, key)


        queryClient.cancelQueries({ queryKey: ['board', boardId] })
        const previousBoard = queryClient.getQueryData<Board>(['board', boardId])!
        const currentColumnIdx = previousBoard.columns.findIndex((column: Column) => column.id === columnId)
        console.log('previousBoard.columns[currentColumnIdx]',previousBoard.columns[currentColumnIdx]);
        if(currentColumnIdx === -1) return
        const currentColumn: Column | any = previousBoard.columns[currentColumnIdx]
        currentColumn[key as keyof Column] = value
        console.log('file: useQuery.ts:68 -> previousBoard:', previousBoard)
        queryClient.setQueryData(['board', boardId], previousBoard)
      },
      onError: (err) => {
        console.log('file: useQuery.ts:56 -> err:', err)
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['board', boardId])
        console.log('success!!')
      },
    }
  )
}

export const useUpdateGroups = (boardId: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ value, key }: { value: string | number | { id: string; order: number }[]; key: string }) => {
      return axios.put(`${BASE_URL}/api/groups`, { boardId, value, key })
    },
    {
      onMutate: ({ value, key }) => {
        if (key === 'sorting') {
          queryClient.cancelQueries({ queryKey: ['board', boardId] })
          const previousBoard = queryClient.getQueryData<Board>(['board', boardId])!
          const sortedGroupsBoard = previousBoard.groups.map((group: Group) => {
            return {
              ...group,
              order: Array.isArray(value) && value.find((sortedGroup) => sortedGroup.id === group.id)?.order,
            }
          })

          previousBoard.groups = sortedGroupsBoard as Group[]
          queryClient.setQueryData(['board', boardId], previousBoard)
          return { previousBoard }
        }
      },
      onError: (err) => {
        console.log('file: useQuery.ts:56 -> err:', err)
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['board', boardId])
      },
    }
  )
}

export const useUpdateItem = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ itemId, value, key }: { itemId: string; value: string; key: string }) => {
      return axios.put(`${BASE_URL}/api/items/${itemId}`, { value, key })
    },
    {
      onError: (err) => {
        console.log('file: useQuery.ts:97 -> err:', err)
      },
      onSuccess: ({ data: item }) => {
        queryClient.invalidateQueries(['board', item.boardId])
      },
    }
  )
}

export const useUpdateColumnValue = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ columnValueId, item, groupId, boardId, value, key }: { columnValueId: string; item: Item; groupId: string; boardId: string; value: string; key: string }) => {
      return axios.put(`${BASE_URL}/api/columnValues/${columnValueId}`, { value, key })
    },
    {
      onMutate: async ({ columnValueId, item, groupId, boardId, value, key }: { columnValueId: string; item: Item; groupId: string; boardId: string; value: string; key: string }) => {
        await queryClient.cancelQueries({ queryKey: ['board', boardId] })
        const previousBoard: Board | undefined = queryClient.getQueryData(['board', boardId])
        const groupIdx = previousBoard?.groups.findIndex((group: Group) => group.id === groupId)!
        const itemIdx = previousBoard?.groups[groupIdx].items.findIndex((currItem: Item) => currItem.id === item.id)!
        const columnValue = previousBoard?.groups[groupIdx].items[itemIdx].columnValues?.find((columnValue) => columnValue.id === columnValueId)
        columnValue[key] = value
        const updatedBoard = JSON.parse(JSON.stringify(previousBoard))

        queryClient.setQueryData(['board', item.boardId], updatedBoard)
        return updatedBoard
      },
      onSuccess: (data, variables, context: Board | any) => {
        queryClient.invalidateQueries(['board', context.id!])
      },
    }
  )
}

export const useAddWorkspace = () => {
  const queryClient = useQueryClient()

  const router = useRouter()

  return useMutation(
    (newWorkspace: Workspace) => {
      return axios.post(`${BASE_URL}/api/workspaces`, newWorkspace)
    },
    {
      onMutate: async (newWorkspace: Workspace) => {
        await queryClient.cancelQueries({ queryKey: ['workspaces'] })
        const previousWorkspaces: Workspace[] = queryClient.getQueryData<Workspace[]>(['workspaces'])!
        const updatedWorkspaces = [...previousWorkspaces!, newWorkspace]
        queryClient.setQueryData(['workspaces'], updatedWorkspaces)
        return updatedWorkspaces
      },
      onSuccess: ({ data: workspace }: { data: Workspace }) => {
        queryClient.invalidateQueries(['workspaces'])
        router.push(`/workspaces/${workspace.id}`)
      },
    }
  )
}

export const useAddBoard = () => {
  const queryClient = useQueryClient()

  const router = useRouter()

  return useMutation(
    (newBoard: any) => {
      return axios.post(`${BASE_URL}/api/boards`, newBoard)
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

export const useAddGroup = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (newGroup: any) => {
      return axios.post(`${BASE_URL}/api/groups`, { newGroup })
    },

    {
      onMutate: async (newGroup: any) => {
        await queryClient.cancelQueries({ queryKey: ['board', newGroup.boardId] })
        const previousBoard = queryClient.getQueryData<Board>(['board', newGroup.boardsId])!
        console.log('file: useQuery.ts:191 -> previousBoard:', previousBoard)
        newGroup.items = []

        previousBoard.groups.push(newGroup)
        queryClient.setQueryData(['board', newGroup.boardsId], previousBoard)
        return previousBoard
      },
      onSuccess: ({ data: newGroup }) => {
        console.log('file: useQuery.ts:197 -> newGroup:', newGroup)
        console.log('success')
        queryClient.invalidateQueries(['board', newGroup.boardsId])
      },
    }
  )
}

export const useAddItem = (itemPosition: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    (newItem: NewItem) => {
      return axios.post(`${BASE_URL}/api/items`, { newItem, isMany: false })
    },

    {
      onMutate: async (newItem) => {
        await queryClient.cancelQueries({ queryKey: ['board', newItem.boardId] })
        const previousBoard = queryClient.getQueryData<Board>(['board', newItem.boardId])!
        const groupIdx = previousBoard.groups.findIndex((group) => group.id === newItem.groupId)

        itemPosition === 'bottom' ? previousBoard.groups[groupIdx].items.push(newItem) : previousBoard.groups[groupIdx].items.unshift(newItem)

        queryClient.setQueryData(['board', newItem.boardId], previousBoard)
        return { previousBoard }
      },
      onSuccess: ({ data: newItem }) => {
        console.log('success')
        queryClient.invalidateQueries(['board', newItem.boardId])
        queryClient.invalidateQueries(['workspace', newItem.workspaceId])
      },
    }
  )
}

export const useAddManyItems = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (itemsToDuplicate: NewItem[]) => {
      return axios.post(`${BASE_URL}/api/items`, { newItem: itemsToDuplicate, isMany: true })
    },

    {
      onSuccess: (data, variables, context) => {},
    }
  )
}

export const useDeleteItem = (currentBoardId: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    (itemsId: (string | undefined)[]) => {
      return axios.delete(`${BASE_URL}/api/items`, { data: itemsId })
    },

    {
      onMutate: async (itemsId: (string | undefined)[]) => {
        const prevBoard = queryClient.getQueryData<Board>(['board', currentBoardId])
        const filteredBoard = {
          ...prevBoard,
          groups: prevBoard!.groups.map((group) => ({
            ...group,
            items: group.items.filter((item) => !itemsId.includes(item.id)),
          })),
        }
        queryClient.setQueryData(['board', currentBoardId], filteredBoard)

        return { filteredBoard }
      },
      onSuccess: (data, variables, context) => {
        const { filteredBoard } = context as { filteredBoard: Board }
        queryClient.setQueryData(['board', currentBoardId], filteredBoard)
      },
    }
  )
}

export const useSortBoards = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (workspaceBoards: any[]) => {
      return axios.put(`${BASE_URL}/api/boards`, workspaceBoards)
    },
    {
      onSuccess: () => {
        console.log('boards sorted!')
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

export const useUpdateBoard = () => {
  return useMutation(
    ({ boardId, value, key }: { boardId: string; value: string | Date; key: string }) => {
      return axios.put(`${BASE_URL}/api/boards/${boardId}`, { value, key })
    },
    {
      onSuccess: ({ data: board }) => {
        console.log('file: useQuery.ts:286 -> board:', board)
      },
    }
  )
}

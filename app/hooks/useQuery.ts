import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  return useQuery(['workspaces'], async () => {
    const workspaces = await getWorkspaces()
    return workspaces
  })
}

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ workspaceId, value, key }: { workspaceId: string; value: string | Date; key: string }) => {
      return axios.put(`http://localhost:3000/api/workspaces/${workspaceId}`, { value, key })
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

export const useUpdateGroups = (boardId: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ value, key }: { value: string | number | {id: string, order: number}[]; key: string }) => {
      return axios.put(`http://localhost:3000/api/groups`, { boardId, value, key })
    },
    {
      onMutate: ({ value, key }) => {
        if(key === 'sorting') {
        queryClient.cancelQueries({ queryKey: ['board', boardId] })
        const previousBoard = queryClient.getQueryData<Board>(['board', boardId])!
        console.log('file: useQuery.ts:58 -> previousBoard:', previousBoard)
         const sortedGroupsBoard = previousBoard.groups.map((group: Group) => {
          return {
            ...group,
            order: Array.isArray(value) && value.find(sortedGroup => sortedGroup.id === group.id)?.order
          }
         })

         previousBoard.groups = sortedGroupsBoard as Group[]
         console.log('sortedGroupsBoard',sortedGroupsBoard);
        queryClient.setQueryData(['board', boardId], previousBoard)
        return { previousBoard }
        }

      },
      onError: (err) => {
        console.log('file: useQuery.ts:56 -> err:', err)
      },
      onSuccess: () => {
        // console.log('group.boardId', group.boardId)
        queryClient.invalidateQueries(['board', boardId])
      },
    }
  )
}

export const useUpdateItem = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ itemId, value, key }: { itemId: string; value: string ; key: string }) => {
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
      onError: (err) => {
        console.log('err222', err)
      },
      onSuccess: ({ data: item }) => {
        // const previousWorkspace: Workspace | undefined = queryClient.getQueryData(['item', item.id])
        // console.log('file: useQuery.ts:66 -> previousWorkspace:', previousWorkspace)
        // console.log('file: useQuery.ts:66 -> previousWorkspace:', previousWorkspace)
        console.log('item.boardId', item.boardId)
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

export const useAddItem = (itemPosition: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    (newItem: NewItem) => {
      return axios.post(`http://localhost:3000/api/items`, { newItem, isMany: false })
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
      return axios.post(`http://localhost:3000/api/items`, { newItem: itemsToDuplicate, isMany: true })
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
      console.log('file: useQuery.ts:186 -> itemsId:', itemsId)

      return axios.delete(`http://localhost:3000/api/items`, { data: itemsId })
    },

    {
      onMutate: async (itemsId: (string | undefined)[]) => {
        const prevBoard = queryClient.getQueryData<Board>(['board', currentBoardId])
        console.log('file: useQuery.ts:188 -> prevBoard:', prevBoard)

        const filteredBoard = {
          ...prevBoard,
          groups: prevBoard!.groups.map((group) => ({
            ...group,
            items: group.items.filter((item) => !itemsId.includes(item.id)),
          })),
        }
        queryClient.setQueryData(['board', currentBoardId], filteredBoard)
        console.log('file: useQuery.ts:210 -> filteredBoard:', filteredBoard)

        return { filteredBoard }
      },
      onSuccess: (data, variables, context) => {
        console.log('context',context);
        const { filteredBoard } = context as { filteredBoard: Board };
        queryClient.setQueryData(['board', currentBoardId], filteredBoard);
      },
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

export const useUpdateBoard = () => {
  return useMutation(
    ({ boardId, value, key }: { boardId: string; value: string | Date; key: string }) => {
      return axios.put(`http://localhost:3000/api/boards/${boardId}`, { value, key })
    },
    {
      onSuccess: ({ data: board }) => {
        console.log('file: useQuery.ts:286 -> board:', board)
      },
    }
  )
}

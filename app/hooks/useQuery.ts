import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'
import { getWorkspace, getWorkspaces } from '../services/appService'

export const useGetWorkspace = (workspaceId: string, initialData: Workspace | null) => {
  return useQuery(['workspace', workspaceId], async () => {
    
    const workspace = await getWorkspace(workspaceId)
    console.log('file: useQuery.ts:8 -> workspace:', workspace)
    return workspace
  },
  {
    initialData: initialData || null
  })
}

export const useGetWorkspaces = (workspaces: Workspace[]) => {
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

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'
import { getWorkspace, getWorkspaces } from '../services/appService'

export const useGetWorkspace = (currentWorkspace: any) => {
  return useQuery(['workspace', currentWorkspace.id], async() => {
    const workspace = await getWorkspace(currentWorkspace.id)
    return workspace
  }, {
    initialData: currentWorkspace,
  })
}

export const useGetWorkspaces = (workspaces: any) => {
  console.log('file: useQuery.ts:15 -> workspaces:', workspaces)
  return useQuery(['workspaces'], async() => {
    const workspaces = await getWorkspaces()
    console.log('file: useQuery.ts:17 -> workspaces:', workspaces)
    return workspaces
  }, {
    initialData: workspaces,
  })
}

export const useUpdateWorkspaceName = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ workspaceId, value, key }: { workspaceId: string; value: string; key: string }) => {
      return axios.put(`http://localhost:3000/api/workspaces/${workspaceId}`, { value, key })
    },
    {
      onSuccess: ({ data: currentWorkspace }) => {
        queryClient.setQueryData(['workspace'], currentWorkspace)
        queryClient.invalidateQueries(['workspace', currentWorkspace.id])
      },
    }
  )
}

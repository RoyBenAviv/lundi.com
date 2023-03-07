import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'

export const useGetWorkspace = (workspaceId: string) => {
  return useQuery(['workspace', workspaceId], () => axios.get(`http://localhost:3000/api/workspaces/${workspaceId}`))
}

export const useUpdateWorkspaceName = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({workspaceId, value, key}: {workspaceId: string, value: string, key: string}) => {
      return axios.put(`http://localhost:3000/api/workspaces/${workspaceId}`, {value, key})
    },
    {
      onSuccess: ({ data }) => {
        console.log('file: useQuery.ts:16 -> data:', data)
        queryClient.invalidateQueries(['workspace'])
        queryClient.setQueryData(['workspace'], data)
      },
    }
  )
}

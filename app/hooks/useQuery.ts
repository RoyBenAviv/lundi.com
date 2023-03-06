import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'

export const useGetWorkspace = (workspaceId: string) => {
  return useQuery(['workspace', workspaceId], () => axios.get(`http://localhost:3000/api/workspaces/${workspaceId}`))
}

export const useUpdateWorkspaceName = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({workspaceId, name}: {workspaceId: string, name: string}) => {
      return axios.put(`http://localhost:3000/api/workspaces/${workspaceId}`, {name})
    },
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['workspace'])
        queryClient.setQueryData(['workspace'], data)
      },
    }
  )
}

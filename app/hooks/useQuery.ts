import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'


export const useGetWorkspace = (workspaceId: string) => {
    return useQuery(['workspace', workspaceId], async () => await axios.get(`http://localhost:3000/api/workspaces/${workspaceId}`))
}
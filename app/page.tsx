import MyWorkspaces from './components/workspace/MyWorkspaces'
import getQueryClient from '@/app/util/getQueryClient'
import { dehydrate } from '@tanstack/query-core'
import Hydrate from '@/app/util/HydrateClient'
import RecentlyVisitedBoards from './components/board/RecentlyVisitedBoards'
import { getRecentlyVisitedBoards } from './services/appService'

async function getWorkspaces() {
  try {
  const res = await fetch(`${process.env.BASE_URL}/api/workspaces`)
  return res.json()
} catch (err) {
  console.log('file: page.tsx:6 -> err:', err)
}
}



export default async function Home() {
  const boards = await getRecentlyVisitedBoards()
  console.log('file: page.tsx:27 -> boards:', boards)

  const getCurrentTime = () => {
    const currentTime = new Date().getHours();
    switch (true) {
      case (currentTime >= 6 && currentTime <= 11):
        return  "Good morning";
      case (currentTime >= 18 && currentTime <= 21):
        return  "Good evening";
      default:
        return  "Good night";
    }
  }


  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['workspaces'], async () => await getWorkspaces())
  const dehydratedState = dehydrate(queryClient)


  return (
    <main className='main-workspaces'>
      <header><p className="welcome-name">{getCurrentTime()}, Roy!</p> <p className='welcome-message'>Quickly access your recent boards, Inbox and workspaces</p></header>
      <main className='main-workspaces-container'>
        {!!boards.length &&<RecentlyVisitedBoards boards={boards}/>}
        <Hydrate state={dehydratedState}>
        <MyWorkspaces/>
        </Hydrate>
      </main>
    </main>
  )
}

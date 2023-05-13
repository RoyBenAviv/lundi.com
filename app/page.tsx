import MyWorkspaces from './components/workspace/MyWorkspaces'
import getQueryClient from '@/app/util/getQueryClient'
import { dehydrate } from '@tanstack/query-core'
import Hydrate from '@/app/util/HydrateClient'

async function getWorkspaces() {
  try {
  const res = await fetch(`http://localhost:3000/api/workspaces`)
  return res.json()
} catch (err) {
  console.log('file: page.tsx:6 -> err:', err)
}
}

export default async function Home() {



  const getCurrentTime = () => {
    const currentTime = new Date().getHours();
    switch (true) {
      case (currentTime >= 6 && currentTime <= 11):
        return  "Good morning!";
      case (currentTime >= 18 && currentTime <= 21):
        return  "Good evening!";
      default:
        return  "Good night!";
    }

  }


  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['workspaces'], async () => await getWorkspaces())
  const dehydratedState = dehydrate(queryClient)
  return (
    <section className='main-workspaces'>
      <header><p>{getCurrentTime()}, Roy!</p> Quickly access your recent boards, Inbox and workspaces</header>
      <section>Recently visited</section>
      <section>Inbox</section>
      <section>
        My workspaces
        <Hydrate state={dehydratedState}>
        <MyWorkspaces />
        </Hydrate>
      </section>
      <nav>
        <ul>
          <li>work management</li>
          <li>Notifications</li>
          <li>Inbox</li>
          <li>Favorites</li>
        </ul>
      </nav>
    </section>
  )
}

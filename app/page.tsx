import axios from 'axios'
import Link from 'next/link'
import MyWorkspaces from './components/workspace/MyWorkspaces'
import { getWorkspaces } from './services/appService'



export default async function Home() {
  const workspaces = await getWorkspaces()

  return (
    <section>
      <header>Good evening, Roy! Quickly access your recent boards, Inbox and workspaces</header>
      <section>Recently visited</section>
      <section>Inbox</section>
      <section>
        My workspaces
        <MyWorkspaces workspaces={workspaces} />
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

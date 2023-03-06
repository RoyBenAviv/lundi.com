import axios from 'axios'
import Link from 'next/link'

const getWorkspaces = async() => {
    try {
      const workspaces = await axios.get(`${process.env.BASE_URL}/api/workspaces`)
      return workspaces.data
    } catch(err) {
      console.log('file: page.tsx:6 -> err:', err)
      
    }
}

export default async function Home() {
  const workspaces = await getWorkspaces()

  return (
    <section>
      <header>Good evening, Roy! Quickly access your recent boards, Inbox and workspaces</header>
      <section>Recently visited</section>
      <section>Inbox</section>
      <section>
        My workspaces
        <ul>
        {workspaces.map((workspace: any) => (
          <li key={workspace.id}><Link href={`/workspaces/${workspace.id}`}>{workspace.name}</Link></li>
        ))}
        </ul>
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

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
const mondayLogo = require('../assets/images/monday-logo.png')
const { Workspace, Inbox, Notifications } = require('monday-ui-react-core/icons')
import { useState, useEffect } from 'react'

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://lundi-com-roybenaviv.vercel.app'


export default function TopNavBar({firstWorkspaceId}: {firstWorkspaceId: string}) {

  const [workspaceNavPath, setWorkspaceNavPath] = useState<string>('')

  const pathname = usePathname();

  useEffect(() => {
    if(pathname.includes('board') || pathname.includes('workspaces')) {
      setWorkspaceNavPath(pathname)
    } else {
      setWorkspaceNavPath(`/workspaces/${firstWorkspaceId}`)
    }

  }, [pathname])

  const currentLocation = window.location.href
  console.log('file: TopNavBar.tsx:10 -> currentLocation:', currentLocation)
  

  return (
    <ul>
      <li className={`logo ${!pathname.includes('workspaces') ? 'active' : ''}`}>
        <Link href="/">
          <Image src={mondayLogo} alt="homepage" />
        </Link>
      </li>
      <li className={`${pathname.includes('workspaces') ? 'active' : ''}`}>
        <Link href={workspaceNavPath}>{<Workspace />}</Link>
      </li>
    </ul>
  )
}

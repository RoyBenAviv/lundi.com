'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
const mondayLogo = require('../assets/images/monday-logo.png')
const { Workspace, Inbox, Notifications } = require('monday-ui-react-core/icons')
import { useState, useEffect } from 'react'


export default function TopNavBar() {

  
  const pathname = usePathname();
  const workspaceNavPath = pathname.includes('board') || pathname.includes('workspaces') ? pathname : `/workspaces/1`
  

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

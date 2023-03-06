'use client'

import { Button } from 'monday-ui-react-core'
import Image from 'next/image'
import Link from 'next/link'
import { FocusEvent, useState } from 'react'
const { Edit } = require('monday-ui-react-core/icons')
export default function WorkspaceHome({ currentWorkspace }: any) {
  const [workspaceName, setWorkspaceName] = useState(currentWorkspace.name)


const handleChange = (event: FocusEvent<HTMLHeadingElement, Element>, type: string) => {
    switch (type) {
        case 'title':
            
            break;
    
        default:
            break;
    }
}

  return (
    <main className="workspace-home">
      <header className="cover-image">
        <Button>
          {' '}
          <Edit /> Change Cover
        </Button>
      </header>
      <section className="workspace-details">
        <div className="workspace-icon"></div>
        <div className="workspace-info">
          <h3 contentEditable={true} onBlur={(event) => handleChange(event, 'title')}>
            {workspaceName}
          </h3>
          <span contentEditable={true}>{currentWorkspace.description}</span>
        </div>
      </section>
    </main>
  )
}

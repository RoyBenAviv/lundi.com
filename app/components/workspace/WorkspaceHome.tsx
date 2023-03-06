'use client'

import { useUpdateWorkspaceName } from '@/app/hooks/useQuery'
import { Button } from 'monday-ui-react-core'
import { FocusEvent, useState } from 'react'
const { Edit } = require('monday-ui-react-core/icons')

export default function WorkspaceHome({ currentWorkspace }: any) {

  const { mutate: updateMutate } = useUpdateWorkspaceName()

const handleChange = (event: FocusEvent<HTMLHeadingElement, Element>, type: string) => {
    event.preventDefault()
    switch (type) {
        case 'title':
            if(event.target.innerText === currentWorkspace.name) return
            updateMutate({workspaceId: currentWorkspace.id, name: event.target.innerText})
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
            {currentWorkspace.name}
          </h3>
          <span >{currentWorkspace.description}</span>
        </div>
      </section>
    </main>
  )
}

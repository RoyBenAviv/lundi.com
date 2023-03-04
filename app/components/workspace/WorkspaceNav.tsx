import Link from 'next/link'
import WorkspaceOptions from './WorkspaceOptions'
const { Board, NavigationChevronLeft, NavigationChevronRight } = require('monday-ui-react-core/icons')

interface WorkspaceNav {
workspace: any
  onCollapseNav: any
  isCollapseNav: boolean
}

export default function WorkspaceNav({ workspace, onCollapseNav, isCollapseNav }: WorkspaceNav) {
  return (
    <nav className={`workspace-nav ${isCollapseNav ? 'close' : 'open'}`}>
      <button onClick={() => onCollapseNav()} className="collapse-btn">
        {isCollapseNav ? <NavigationChevronRight /> : <NavigationChevronLeft />}
      </button>
      {!isCollapseNav && (
        <>
        <WorkspaceOptions workspace={workspace}/>
        <hr/>
        <ul>
          {workspace.boards.map((board: any) => (
              <li key={board.id}>
              <Link href="">
                {<Board />} {board.name}
              </Link>
            </li>
          ))}
        </ul>
          </>
      )}
    </nav>
  )
}

import Link from "next/link"
const { Board, NavigationChevronLeft } = require("monday-ui-react-core/icons");

interface WorkspaceNav {
 boards: any
}

export default function WorkspaceNav({boards}: WorkspaceNav) {

    return (
        <nav className="workspace-nav">
            <button className="collapse-btn">
                <NavigationChevronLeft />
            </button>
            <ul>
        
            {boards.map((board: any) => (
                <li key={board.id}><Link href="">{<Board/>} {board.name}</Link></li>
                ))}
            </ul>
        </nav>
    )
  }
  
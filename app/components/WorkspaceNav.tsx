import Link from "next/link"
const { Board } = require("monday-ui-react-core/icons");

interface WorkspaceNav {
 boards: any
}

export default function WorkspaceNav({boards}: WorkspaceNav) {

    return (
        <nav className="workspace-nav">
            <ul>
        
            {boards.map((board: any) => (
                <li key={board.id}><Link href="">{<Board/>} {board.name}</Link></li>
                ))}
            </ul>
        </nav>
    )
  }
  
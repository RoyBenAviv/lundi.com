interface Workspace {
  id?: string
  name: string
  description: string
  color: string
  boards?: Board[]
  folders?: Folder[]
}

interface Folder {
  id: string
  name: string
  boards: Board[]
  workspace: Workspace
  workspaceId: string
}

interface Board {
  id: string
  name: string
  users: User[]
  group: Group[]
  items: Item[]
  folders: Folder[]
  workspace: Workspace
  workspaceId: string
}

interface Group {
  id: string
  name: string
  items: Item[]
  boards: Board[]
  boardsId: string
}

interface Users {
  id: string
  name: string
  boards: Board[]
  boardsId: string
}

interface Item {
  id: string
  name: string
  groups: Group[]
  groupId: string
  board: Board
  boardId: string
}

interface DropDownOption {
  label: string
  value: string | number
  workspaceId?: string
}
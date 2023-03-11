interface Workspace {
  id?: string
  name: string
  description: string
  color: string
  boards?: Board[]
}

interface Board {
  id: string
  name: string
  users: User[]
  group: Group[]
  items: Item[]
  workspace: Workspace
  workspaceId: string
  order: number
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
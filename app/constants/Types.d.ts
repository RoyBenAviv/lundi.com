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
  groups: Group[]
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
  columns: Column[]
}

interface Column {
  id: string
  name: string
  columnType: string
  itemId: string
  value: JSON
  item: Item[]
}

interface DropDownOption {
  label: string
  value: string | number
  workspaceId?: string
}
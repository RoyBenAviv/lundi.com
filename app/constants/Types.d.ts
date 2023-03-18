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
  columns: Column[]
  boardItemsType: string
}

interface Group {
  id: string
  name: string
  items: Item[]
  boards: Board[]
  boardsId: string
  color: string
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
  columnValues: any[]
}

interface Column {
  id: string
  name: string
  type: string
  value: JSON
  boards: Board[]
  boardsId: string
  item: Item[]
  itemId: string
}

interface DropDownOption {
  label: string
  value: string | number
  workspaceId?: string
}

declare module 'monday-ui-react-core/dist/EditableHeading';
declare module 'monday-ui-react-core/dist/Checkbox'

interface NewItem {
  name: string
  groupId: string
  boardId: string
  order: number
}


interface Workspace {
  id?: string
  name: string
  description: string
  color: string
  boards?: Board[]
  recentlyVisited?: Date
  background?: string
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
  recentlyVisited: Date
}

interface Group {
  id: string
  name: string
  items: Item[]
  boards: Board[]
  boardsId: string
  color: string
  width: number
  order: number
}

interface Users {
  id: string
  name: string
  boards: Board[]
  boardsId: string
}

interface Item {
  id?: string
  name: string
  groupId: string
  boardId: string
  columnValues?: any[]
  order: number
}

interface Column {
  id: string
  name: string
  columnType: string
  value: JSON
  boards: Board[]
  boardsId: string
  item: Item[]
  itemId: string
  width: number
  options: Json?
}

interface DropDownOption {
  label: string
  value: string | number
  workspaceId?: string
}



interface NewBoard {
  id: string
  name: string
  boardItemsType: string
  workspaceId: string
  columns: { name: string; columnType: string; id: string, options?: any}[]
  groups: any[]
}
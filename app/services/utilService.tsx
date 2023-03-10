export function convertToDropDownOptions(arr: any[]) {
  return arr.map((item) => {
    return {
      value: item.id! || item.display_id!,
      label: item.title! || item.name! || item.value,
      leftIcon: () => <div className="workspace-icon" style={{backgroundColor: item.color, marginRight: '10px'}}>{item.name[0]}</div>,
      categoryId: "workspaces",
      workspaceId: item.id
    }
  })
}

export function convertToDropDownOptions(arr: {value: string, name: string, color: string, id: string, display_id: string, title: string}[]) {
  return arr.map((item) => {
    return {
      value: item.id! || item.display_id!,
      label: item.title! || item.name! || item.value,
      leftIcon: () => (
        <div className="workspace-icon" style={{ backgroundColor: item.color, marginRight: '10px' }}>
          {item.name[0]}
        </div>
      ),
      categoryId: 'workspaces',
      workspaceId: item.id,
    }
  })
}

export const colors = ['#fb275d', '#00ca72', '#a358d0', '#595ad4', '#1c1f3b', '#66ccff', '#fdab3d', '#ffcb00', '#009aff', '#f65f7c', '#ff158a', '#579bfc', '#bb3354', '#037f4c']

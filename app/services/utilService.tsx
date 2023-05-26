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

export const backgrounds = ["paper_plane.png", "pink_purple.png", "photo-1551522355-dbf80597eba8.jpeg", "agenda.png", "photo-1553532434-5ab5b6b84993.jpeg", "photo-1551522355-dbf80597eba8.jpeg", "photo-1551419762-4a3d998f6292.jpeg", "photo-1546962339-5ff89552b8ed.jpeg", "photo-1557597774-9d273605dfa9.jpeg", "photo-1560036043-1a6b17791807.jpeg", "photo-1432847712612-926caafaa802.jpeg", "photo-1489769002049-ccd828976a6c.jpeg", "indigo_yellow.png", "photo-1569531115477-5e9a74a6a8ca.jpeg", "red_blue.png", "photo-1490598000245-075175152d25.jpeg"]
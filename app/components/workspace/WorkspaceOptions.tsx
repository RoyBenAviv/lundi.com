"use client"
const {Dropdown} = require("monday-ui-react-core");

// const optionsAvatar = [
//     {
//       value: 'Rotem',
//       label: 'Rotem Dekel',
//       leftIcon: Workspace,
//     },
//     {
//       value: 'Hadas',
//       label: 'Hadas Farhi',
//       leftIcon: Workspace,
//     },
//     {
//       value: 'Netta',
//       label: 'Netta Muller',
//       leftIcon: Workspace,
//     },
//   ]

export default function WorkspaceNav({workspace}: any) {
    return (
      <div >
        <br/>
        <p>workspace</p>
        
        <Dropdown value={{label: workspace.name, value: workspace.id}}/>
      </div>
    )
  }
  
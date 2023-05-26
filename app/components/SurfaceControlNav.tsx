import TopNavBar from './TopNavBar'
// const { Workspace, Inbox, Notifications } = require("monday-ui-react-core/icons");
export default function SurfaceControlNav() {
  return (
    <nav className="surface-control">
      <div className="top-nav">
        <TopNavBar />
      </div>
      <div className="lower-nav">
        <div className="profile"></div>
      </div>
    </nav>
  )
}

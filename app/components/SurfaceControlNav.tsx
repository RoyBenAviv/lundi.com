import { getFirstWorkspaceId } from "../services/appService";
import TopNavBar from "./TopNavBar";
// const { Workspace, Inbox, Notifications } = require("monday-ui-react-core/icons");
export default async function SurfaceControlNav() {
    const firstWorkspaceId = await getFirstWorkspaceId()
    
    return (
        <nav className="surface-control">
            <div className="top-nav">
                <TopNavBar firstWorkspaceId={firstWorkspaceId} />
                </div>
            <div className="lower-nav">
                <div className="profile">
                </div>

            </div>
        </nav>
    )
  }
  
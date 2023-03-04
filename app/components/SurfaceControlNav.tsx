import Image from "next/image";
import Link from "next/link";
const mondayLogo = require('../assets/images/monday-logo.png')
const { Workspace, Inbox, Notifications } = require("monday-ui-react-core/icons");
export default function SurfaceControlNav() {
  
    return (
        <nav className="surface-control">
            <div className="top-nav">
                <ul>
                    <li className="logo">
                        
                    <Link href=""><Image src={mondayLogo} alt="homepage" /></Link>
                    </li>
                    <li>

                    <Link href="">{<Workspace/>}</Link>
                    <Link href="">{<Notifications/>}</Link>
                    <Link href="">{<Inbox/>}</Link>
                    </li>
                </ul>
                </div>
            <div className="lower-nav">
                <div className="profile">
                </div>

            </div>
        </nav>
    )
  }
  
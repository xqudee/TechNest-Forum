import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import '../styles/Settings.css'
import MaterialIcons from "../components/ui/MaterialIcons";

const Settings = () => {
    const auth = useAuth();

    return (
        <div className="center_section">
            <Link to={'/settings'}><h3 className="h3-bg settings_main-link">Settings</h3></Link>
            <div className="settings-cont-main">
                <Outlet />
            </div>
        </div>
    )
}

export default Settings
import { Link, useNavigate } from "react-router-dom";
import '../../styles/Settings.css'
import { useAuth } from "../../hooks/useAuth";
import MaterialIcons from "../ui/MaterialIcons";
import { useActions } from "../../hooks/useActions";
import axios from "../../API/axios";
import { toastr } from "react-redux-toastr";

const SettingsMain = () => {
    const auth = useAuth();
    const navigate = useNavigate()
    const { logout } = useActions();

    const handleDelete = async () => {

        toastr.confirm("Confirm deletion", {
            onOk: async () => {
                try {
                    const response = await axios.delete(`/api/users/${auth.id}`, {withCredentials: true});
                    if (response) {
                        await logout();
                        navigate('/');
                    }
                } catch (error) {
                    toastr.error('Error deleting account')
                }
            }
        });
    }

    const handleLogOut = async () => {
        await logout();
        navigate('/');
    }

    return (
        <div>
            <div className="settings-container">
                <Link to={`/users/${auth.id}`} className="settings-item">
                    <div>My profile</div>
                    <div className="arrow-cont"><MaterialIcons iconName={'ArrowSettings'} /></div>
                </Link>
                <Link to={`/settings/change-email`} className="settings-item">
                    <div>Email</div>
                    <div className="rigth-cont-settings">
                        <span>{auth?.email}</span>
                        <div className="arrow-cont">
                            <MaterialIcons iconName={'ArrowSettings'} />
                        </div>
                    </div>
                </Link>
                <Link to={`/settings/change-password`} className="settings-item">
                    <div>Change password</div>
                    <div className="arrow-cont"><MaterialIcons iconName={'ArrowSettings'} /></div>
                </Link>
                <Link to={`/settings/change-name`} className="settings-item">
                    <div>Change name</div>
                    <div className="rigth-cont-settings">
                        <span>{auth?.name}</span>
                        <div className="arrow-cont">
                            <MaterialIcons iconName={'ArrowSettings'} />
                        </div>
                    </div>
                </Link>
            </div>
            <div>
                <div className='menu-logout-div'>
                    <p onClick={handleLogOut} className='menu-logout-item'>Log Out</p>
                </div>
                <div className='menu-logout-div'>
                    <p onClick={handleDelete} className='menu-logout-item'>Delete account</p>
                </div>
            </div>
        </div>
    )
}

export default SettingsMain
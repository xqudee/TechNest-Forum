import axios from "../../API/axios";
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import HeaderUserMenu from "./HeaderUserMenu";
import './Header.css'
import menu from "../../data/menu.json";
import { CONFIG } from "../../App";
import { getStoreLocal, removeTokensStorage } from "../../utils/locale-storage";
import { useActions } from "../../hooks/useActions";
import { useAuth } from "../../hooks/useAuth";
import { useWidth } from "../../hooks/useWidth";
import MenuMobile from "./MenuMobile";
import MaterialIcons from "../ui/MaterialIcons";


const Header = () => {
    // const [auth, setAuth] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {windowWidth} = useWidth();
    const [menuOpen, setMenuOpen] = useState(false);

    const { logout, checkAuth } = useActions();

    const handleLogOut = async () => {
        await logout();
        // setAuth(false)
        navigate('/');
    }

    const handleClickMenu = () => {
        setMenuOpen(menuOpen => !menuOpen)
    }

    return (
        <header>
            <section className="header-section">
                <div className="header-container">
                    <div className="logo-container_header">
                        <img className='logo-img_header' src='/logo2.svg' onClick={() => navigate('/')} />
                    </div>

                    {windowWidth > 768 && (
                        <div className="header-menu-container">
                            <ul className="header-menu-list ul">
                                {
                                    menu.menuData.map((item, index) => (
                                        <li key={index}>
                                            <Link to={`${item.link}`}>{item.name}</Link>
                                        </li>
                                    ))
                                }
                                {auth?.role === 'admin' &&
                                    <li>
                                        <Link to='admin-panel/users'>Admin</Link>
                                    </li>
                                }
                            </ul>
                        </div>
                    )}

                    <div className="mobile_rigth_menu">
                        {(auth) ? (
                            windowWidth > 768 && <HeaderUserMenu handleLogOut={handleLogOut} />
                        ) : (
                            <div className="auth-section">
                                <Link className="auth-link-login" to="/login">
                                    Login
                                </Link>{" "}
                                <Link className="auth-link-registration" to="/registration">
                                    Register
                                </Link>
                            </div>
                        )}
                        {windowWidth <= 768 && <div>
                            <div className="header-menu-icon" onClick={handleClickMenu}><MaterialIcons iconName={'Menu'} /></div>
                        </div>}
                    </div>

                    {menuOpen && <MenuMobile setIsOpen={setMenuOpen} handleLogOut={handleLogOut} />}
                </div>
            </section>
        </header>
    )
}

export default Header
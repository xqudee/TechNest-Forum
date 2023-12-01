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
import './MenuMobile.css'

const MenuMobile = ({setIsOpen, handleLogOut}) => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path)
        setIsOpen(false);
    }

    return (
        <div className="menu_mobile-section">
            <ul className="menu_mobile-list ul">
                {auth && <li className="menu_mobile-list-item" onClick={() => handleClick(`users/${auth.id}`)}>My profile</li>}
                <li className="menu_mobile-list-item" onClick={() => handleClick('/')}>Main</li>
                <li className="menu_mobile-list-item" onClick={() => handleClick('/users')}>Users</li>
                <li className="menu_mobile-list-item" onClick={() => handleClick('/categories')}>Categories</li>
                <div className="del"></div>
                <li className="menu_mobile-list-item" onClick={() => handleClick('/settings')}>Settings</li>
                <li className="menu_mobile-list-item" onClick={() => handleClick('/blocked_posts')}>Blocked posts</li>
                <div className="del"></div>
                <li className="menu_mobile-list-item" onClick={() => { handleLogOut(); handleClick('/')}}>Log out</li>
            </ul>
        </div>
    )
}

export default MenuMobile
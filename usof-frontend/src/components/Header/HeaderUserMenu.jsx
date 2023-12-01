import Header, { checkToken } from './Header';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../API/axios';
import { useCookies } from 'react-cookie';
import { CONFIG } from '../../App';
import route from '../../API/route';
import './Header.css'
import { getStoreLocal } from '../../utils/locale-storage';
import { useAuth } from '../../hooks/useAuth';

const HeaderUserMenu = ({handleLogOut}) => {
    const location = useLocation();
    const [isActiveMenu, setActiveMenu] = useState(false)
    const auth = useAuth();
    const [avatarName, setAvatarName] = useState('user.svg');

    const [userData, setUserData] = useState({
        avatar: 'user.svg',
        login: '',
        email: '',
        name: '',
    });

    async function getUserInfo(currentUser) {
        const userId = currentUser.id;

        setUserData((prevUserData) => ({
            ...prevUserData,
            login: currentUser.login,
            email: currentUser.email,
            name: currentUser.name,
        }))
        await axios.get(`/api/users/${userId}/avatar`, CONFIG)
        .then((res) => {
            const avatarPath = res.data.result.file;
            setUserData((prevUserData) => ({
                ...prevUserData,
                avatar: avatarPath
            }))
        }).catch(err => {
            // console.log(err);
        });
    }

    useEffect(() => {
        const currentUser = getStoreLocal('user');
        const token = getStoreLocal('accessToken');
        
        if (currentUser) {
            if (token) {
                getUserInfo(currentUser);
                setAvatarName(currentUser.photo)
            } 
        }

    }, [location])

    const handleMenuEnter = () => {
        setActiveMenu(status => status = true);
    }

    const handleMenuLeave = () => {
        setActiveMenu(status => status = false);
    }

    return (
    <div className='user-section'>
        <div className='login-div'>
            {userData.login}
        </div>
        <div 
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
            className='avatar-div'>
            <img className='avatar-img small' src={`${route.serverURL}/avatars/${avatarName}`} />
            {
                isActiveMenu && 
                <div className='menu-container'>
                    <div className='menu-div'>
                        <div className='info-div'>
                            <div className='menu-top-info'>
                                <div className='avatar-div big'>
                                    <img className='avatar-img' src={`${route.serverURL}/avatars/${avatarName}`} />
                                </div>
                                <h3>{userData.name}</h3>
                                <p className='menu-div_email'>{userData.email}</p>
                            </div>
                            <ul className='menu-profile-list ul'>
                                <Link to={`/users/${auth.id}`} className='menu-profile-item' >
                                    Profile
                                </Link>
                                <Link to={`/settings`} className='menu-profile-item' >
                                    Settings
                                </Link>
                                <Link to={`/blocked_posts`} className='menu-profile-item' >
                                    Blocked posts
                                </Link>
                            </ul>

                            <div className='menu-logout-div'>
                                <p onClick={handleLogOut} className='menu-logout-item'>Log Out</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
        
    </div>
    )
}

export default HeaderUserMenu
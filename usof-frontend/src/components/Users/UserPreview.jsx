import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from "../../API/axios";
import { useContext, useEffect, useState } from 'react';
import route from '../../API/route';
import "./Users.css"
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import MaterialIcons from '../ui/MaterialIcons';

const UserPreview = ({user, currentItems}) => {
    const { addUserToFollow, isFavoriteAuthors, isFollow } = useUsers();
    // const [isFollow, setIsFollow] = useState(false);
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className='user_info-container default-bg' onClick={() => navigate(`/users/${user?.user_id || user?.id}`)}>
            <div className='user_info-container-top'>
                <div className='user_info-avatar_cont'>
                    <img src={`${route.serverURL}/avatars/${user?.photo || user?.user_avatar}`} />
                </div>
            </div>
            <div className='user_info-main_info-cont'>
                <div className='user_info-main_info-login'>
                    {user?.login || user?.login}
                </div>
                <div className='user_profile-info_main-rating_cont'>
                    <div className='user_profile-info_main-rating rating-count'>{user?.rating}</div>
                    <div className='user_profile-info_main-rating_star'><MaterialIcons iconName={'StarRating'} /></div>
                </div>
            </div>
        </div>
    )
}

export default UserPreview
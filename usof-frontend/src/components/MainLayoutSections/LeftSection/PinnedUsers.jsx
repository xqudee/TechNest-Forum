import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from "../../../API/axios";
import { useEffect, useState } from 'react';
import route from '../../../API/route';
import { useModel } from '../../../hooks/useModel';
import modelsEnum from '../../../utils/models-enum';
import { usePost } from '../../../hooks/usePost';
import { useAuth } from '../../../hooks/useAuth';
import { useUsers } from '../../../hooks/useUsers';
import MaterialIcons from '../../ui/MaterialIcons';

const PinnedUsers = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { getFollowingUsers, addUserToFollow } = useUsers();
    const [ pinnedUsers, setPinnedUsers ] = useState([]);

    const handleDelete = async (user_id) => {
        await addUserToFollow(user_id);
        navigate(location)
    }

    useEffect(() => {
        const getUsers = async () => {
            const res = await getFollowingUsers();
            setPinnedUsers(res) 
        }
        getUsers();
    }, [location])

    return (
        <div className='pinned_users_section main_layout-section-container default-bg'>
            <h4>Pinned users</h4>
            { auth ? (
                <div className='main_layout-section-container'>
                    {pinnedUsers?.map((user, index) => (
                        index < 8 &&
                        <div key={index} className='pinned-section-item hover-cont' onClick={() => navigate(`/users/${user.user_id || user.id}`)}>
                            <div className='pinned_users-info-section'>
                                <div className='pinned_users-info-avatar_cont'>
                                    <img src={`${route.serverURL}/avatars/${user?.photo || user?.user_avatar}`} />
                                </div>
                                <h4>{user.login}</h4>
                            </div>
                            <div className='pinned_info-del_cont' onClick={() => handleDelete(user.user_id || user.id)}>
                                <MaterialIcons iconName={'DeleteClose'} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>You must authorised</div>
            )}
        </div>
    )
}

export default PinnedUsers
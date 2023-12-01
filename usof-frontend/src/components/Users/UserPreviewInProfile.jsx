import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from "../../API/axios";
import { useContext, useEffect, useState } from 'react';
import route from '../../API/route';
import "./Users.css"
import "./UserProfile.css"
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import { usePost } from '../../hooks/usePost';
import PostPreview from '../Posts/PostPreview';
import { formattedDate } from '../../utils/helpers';
import Pagination from '../Pagination/Pagination';
import { usePagination } from '../../hooks/usePagination';
import MaterialIcons from '../ui/MaterialIcons';

const USERS_POSTS_PER_PAGE = 10;

const UserPreviewInProfile = ({userId}) => {
    const navigate = useNavigate();
    const { currentItems, paginate, getCurrentItems, currentPage } = usePagination();
    const [ users, setUsers ] = useState();
    const { getFollowers } = useUsers();
    const location = useLocation();
    const auth = useAuth();

    const handleClickPost = (id) => {
        navigate(`/users/${id}`)
    }

    useEffect(() => {
        const getPosts = async () => {
            const res = await getFollowers(userId);
            setUsers(res)
            getCurrentItems(USERS_POSTS_PER_PAGE, res)
        }
        
        getPosts();
    }, [location])
    return (
        <>
            <h3 className='h3-bg'>Followers</h3>
            {auth ? (
                <>
                    {currentItems?.length > 0 ? (
                        <div className='user_profile-posts_list'>
                            {currentItems?.map((user, index) => (
                                <div key={index} className='user_profile-post user_profile-followers' onClick={() => handleClickPost(user.id)}>
                                    <div className='user_profile-followers-container-info'>
                                        <div className='user_info-avatar_cont'>
                                            <img src={`${route.serverURL}/avatars/${user?.photo || user?.user_avatar}`} />
                                        </div>
                                        <div className='user_info-main_info-login'>
                                            {user?.login || user?.login}
                                        </div>
                                    </div>
                                    <div className='user_info-main_info-rating-cont'>
                                        {user?.rating || 0}
                                        <div className='user_profile-info_main-rating_star'><MaterialIcons iconName={'StarRating'} /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='no_posts-cont'>No followers</div>
                    )}
                    <Pagination 
                        itemsPerPage={USERS_POSTS_PER_PAGE} 
                        totalItems={users?.length}
                        paginate={paginate}
                        currentPage={currentPage} />
                </>
            ) : (
                <div>You must authorised to see followers</div>
            )}
        </>
    )
}

export default UserPreviewInProfile
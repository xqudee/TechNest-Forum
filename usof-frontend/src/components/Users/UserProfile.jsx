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
import PostPreviewInProfile from './PostPreviewInProfile';
import Pagination from '../Pagination/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { formattedDate } from '../../utils/helpers';
import MaterialIcons from '../ui/MaterialIcons';
import UserPreviewInProfile from './UserPreviewInProfile';
import parse from 'html-react-parser';
import { useWidth } from '../../hooks/useWidth';


const UserProfile = () => {
    const { userId } = useParams();
    const { getUserById, isFavoriteAuthors, addUserToFollow, isFollow, getFollowers } = useUsers();
    const [ user, setUser ] = useState();
    const [ userPosts, setUserPosts ] = useState();
    const [ followersCount, setFollowersCount ] = useState();
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const {windowWidth} = useWidth();

    const handleFollow = async (user_id) => {
        await addUserToFollow(user_id);
        navigate(`/users/${user_id}`)
    }

    const handleEdit = async (user_id) => {
        navigate(`/users/${user_id}/edit`)
    }

    useEffect(() => {
        const getUser = async () => {
            const res = await getUserById(userId);
            setUser(res);
        }

        const isFavorite = async () => {
            const res = await isFavoriteAuthors(userId);
            // setIsFollow(res);
        }

        const getUserFollowers = async () => {
            const res = await getFollowers(userId);
            setFollowersCount(res?.length);
        }
        
        getUser();
        isFavorite();
        getUserFollowers()
    }, [location])

    return (
        <div className='center_section user_profile-section'>
            <div className='user_profile-top_section'>
                <div className='user_profile-top_section-about'>
                    <div className='user_profile-left_cont'>
                        <div className='user_profile-avatar_cont'>
                        <img src={`${route.serverURL}/avatars/${user?.photo}`} className='user_profile-avatar' />
                        </div>
                    </div>
                    <div className='user_profile-info_cont'>
                        <div className='user_profile-info_main'>
                            <div className='user_profile-info_main-login'>
                                <h2 className=''>{user?.login}</h2>
                                {windowWidth <= 768 && auth?.id == userId && (
                                    <button className={`button-yellow follow-btn ${isFollow && 'unfollow_user-btn'}`}
                                        onClick={() => handleEdit(userId)} 
                                    > Edit
                                    </button>
                                )}
                            </div>
                            <div className='user_profile-info_main-date'>Member since {formattedDate(user?.register_date)}</div>
                            <div className='user_profile-info_main-statistics'>
                                <div className='user_profile-info_main-rating_cont user_profile-info_main-item default-bg'>
                                    <div className='user_profile-info_main-rating'>{user?.rating}</div>
                                    <div className='user_profile-info_main-rating_star'><MaterialIcons iconName={'StarRating'} /></div>
                                </div>
                                {followersCount > 0 && (
                                    <div className='user_profile-info_main-followers_cont user_profile-info_main-item default-bg'>
                                        {followersCount} followers
                                    </div>
                                )}
                                {userPosts?.length > 0 && (
                                    <div className='user_profile-info_main-postsnum_cont user_profile-info_main-item default-bg'>
                                        {userPosts.length} posts
                                    </div>
                                )}
                            </div>
                        </div>
                        {auth && (
                            auth.id != userId ? (
                                <button className={`button-yellow follow-btn ${isFollow && 'unfollow_user-btn'}`}
                                    onClick={() => handleFollow(userId)} 
                                > {isFollow ? 'Unfollow' : 'Follow'}
                                </button>
                            ) : (
                                windowWidth > 768 && auth.id == userId && (
                                    <button className={`button-yellow follow-btn ${isFollow && 'unfollow_user-btn'}`}
                                        onClick={() => handleEdit(userId)} 
                                    > Edit
                                    </button>
                                )
                            )
                        )}
                        
                    </div>
                </div>
            </div>
            {user?.about && (
                <div className='user_profile-posts_section user_profile-about-section'>
                    <div className='user_profile-about-container'>{user && parse(user?.about)}</div>
                </div>
            )}

            <div className='user_profile-posts_section user_profile-header-section'>
                <PostPreviewInProfile userId={userId} userPosts={userPosts} setUserPosts={setUserPosts} />
            </div>

            <div className='user_profile-followers_section user_profile-header-section'>
                <UserPreviewInProfile userId={userId} />
            </div>
        </div>
    )
}

export default UserProfile
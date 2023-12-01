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

const POSTS_POSTS_PER_PAGE = 10;

const PostPreviewInProfile = ({userId, userPosts, setUserPosts}) => {
    const navigate = useNavigate();
    const { currentItems, paginate, getCurrentItems, currentPage } = usePagination();
    const { getUserPostById } = useUsers();
    const location = useLocation();

    const handleClickPost = (id) => {
        navigate(`/posts/${id}`)
    }

    useEffect(() => {
        const getPosts = async () => {
            const res = await getUserPostById(userId);
            setUserPosts(res)
            getCurrentItems(POSTS_POSTS_PER_PAGE, res)
        }
        
        getPosts();
    }, [location])
    return (
        <>
            <h3 className='h3-bg'>Posts</h3>
            {currentItems?.length > 0 ? (
                <div className='user_profile-posts_list'>
                    {currentItems?.map((post, index) => (
                        <div key={index} className='user_profile-post' onClick={() => handleClickPost(post.id)}>
                            <div className='user_profile-post-first_cont'>

                                <div className='user_profile-info_main-rating_cont'>
                                    <div className='user_profile-info_main-rating'>{post.rating}</div>
                                    <div className='user_profile-info_main-rating_star'><MaterialIcons iconName={'StarRating'} /></div>
                                </div>

                                {/* <div className='user_profile-post_rating'>{post.rating}</div> */}
                                <div className='user_profile-post_title'>{post.title}</div>
                            </div>
                            <div className='user_profile-post-second_cont'>
                                <div className='user_profile-post_date'>{formattedDate(post.publish_date)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='no_posts-cont'>No posts yet</div>
            )}
            <Pagination 
                itemsPerPage={POSTS_POSTS_PER_PAGE} 
                totalItems={userPosts?.length}
                paginate={paginate}
                currentPage={currentPage} />
        </>
    )
}

export default PostPreviewInProfile
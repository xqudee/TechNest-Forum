import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import route from '../../API/route';
import './Posts.css'
import { usePost } from '../../hooks/usePost';
import MaterialIcons from '../ui/MaterialIcons';
import { TopPostsContext } from '../../pages/Layout';
import { useAuth } from '../../hooks/useAuth';
import { getDaysAgo } from '../../utils/helpers';

const PostPreview = ({post, currentItems, postNameToSearch, currentCategoryPost}) => {

    const { rating, postCommentsCount, commentsCount, clickFavorite, isFavorite, checkFavorite, addToBlocked, getBlockedPosts } = usePost();
    const location = useLocation();
    const navigate = useNavigate();
    const [ isBlock, setIsBlock ] = useState(false); 
    const auth = useAuth();

    const getPostLikes = async (id) => {
        await postCommentsCount(id); 
        if (auth) await checkFavorite(id);
    }
    const handleClickFavorite = async () => {
        await clickFavorite(post.id || post.post_id);
    }

    const handleClickPost = async () => {
        navigate(`/posts/${post.id || post.post_id}`)
    }

    const handleBlock = async () => {
        const res = await addToBlocked(post.id);
        if (res == 'blocked') setIsBlock(true);
        else setIsBlock(false);
        navigate('/blocked_posts')
    }

    const checkBlock = async (postId) => {
        const res = await getBlockedPosts(); 
        res.forEach(post => {
            if (post.id == postId) {
                setIsBlock(true);
                return
            }
            setIsBlock(false);
        });
    }

    useEffect(() => {
        getPostLikes(post.id || post.post_id);
        checkBlock(post.id);
    }, [currentItems, location, postNameToSearch, currentCategoryPost])

    return (
        <div 
            className={`post_info-container default-bg ${post.type == 'inactive' && 'inactive'}`}>
            <div className='post_info-main-container'>
                <div className='post_info-top'>
                    <div className='post_info-main'>
                        <div onClick={post.type === 'active' ? handleClickPost : undefined} className='post-title-cont-link'>
                            <h4 className='post_title'>{post.title}</h4>
                        </div>
                        <div className='categories-container'>
                            {
                                post.post_categories?.map((category, index) => (
                                    <p key={index} className='category-item pointer' onClick={() => navigate(`/${category}/posts`)}>{category}</p>
                                ))
                            }
                        </div>
                    </div>
                    {auth && (

                            isBlock ? (
                                <div className='block-container' onClick={handleBlock}>Unblock</div>
                            ) : (
                                <div className='reaction-container'>

                                <div className='post_info-statistics-comments'>
                                        {post.rating}
                                    </div>
                                    <div className='like-container' onClick={handleClickFavorite}>
                                        { isFavorite ? (
                                            <MaterialIcons iconName={'FavoriteActive'} />
                                        ) : (
                                            <MaterialIcons iconName={'FavoriteInactive'} />
                                        ) }
                                    </div>
                                </div>
                            )
                    )}
                </div>
                <div className='post_info-bottom'>
                    <div className='post_info-author'>
                        <Link to={`/users/${post.author_id || post.user_id}`} className='post_info-author-avatar'>
                            <img className='post_info-author-avatar-img' src={`${route.serverURL}/avatars/${post.user_avatar}`} />
                        </Link>
                        <Link to={`/users/${post.author_id || post.user_id}`} className='post_info-author-info'>
                            <h5 className='post_info-author-info--name'>{post.login}</h5>
                        </Link>
                    </div>
                    <div className='post_info-statistics'>
                        <div className='post_info-statistics-date'>{getDaysAgo(post.publish_date)} days ago</div>
                        <div className='post_info-statistics-comments'>{commentsCount} comments</div>
                    </div>
                </div>
            </div>
            {/* <p>Content: {post.content}</p> */}
        </div>
    )
}

export default PostPreview
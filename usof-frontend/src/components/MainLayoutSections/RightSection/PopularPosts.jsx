import { useLocation, useNavigate } from 'react-router-dom';
import route from '../../../API/route';
import MaterialIcons from '../../ui/MaterialIcons';
import { cutTitle } from '../../../utils/helpers';
import { useEffect, useState } from 'react';
import { usePost } from '../../../hooks/usePost';

const PopularPosts = () => {
    const navigate = useNavigate()
    const [ topFivePosts, setTopPosts ] = useState();
    const { fetchData } = usePost();
    const location = useLocation();

    const handleClick = (index) => {
        navigate(`/posts/${index}`)
    }

    useEffect(() => {
        const getTopFive = async () => {
            let res = await fetchData('rating');
            res = res.sort((a, b) => b.rating - a.rating);
            setTopPosts(res);
        }
        getTopFive();
    }, [location])

    return (
    <div className='popular_post_section main_layout-section-container default-bg'>
        <h4 className='main_layout-section-title'>Top 5 popular posts</h4>
        {
            topFivePosts?.map((post, index) => (
                index < 5 &&
                <div key={index} className='head_info-top_5_posts-section main_layout-section hover-cont' onClick={() => {return handleClick(post.id)}}>
                    <div key={index} className='head_info-top_5_posts main_layout-section-item'>
                        <div className='rating_container'>{post.rating}</div>
                        <div className='top_5_posts-main_info'>
                            <h4>{cutTitle(post.title, 20)}</h4>
                            <div className='top_5_posts-post_info-author'>
                                <div className='top_5_post_info-author-avatar'>
                                    <img className='top_5_posts-author-avatar-img' src={`${route.serverURL}/avatars/${post.user_avatar}`} />
                                </div>
                                <div className='post_info-author-info'>
                                    <p className='top_5_posts-author-info--name'>{post.login}</p>
                                </div>
                            </div>
                            <div className='categories-container'>{
                                post.post_categories?.map((category, index) => (
                                    index < 3 && (
                                        <p key={index} className='category-item category-item-top_5_posts'>{category}</p>
                                    )
                                ))
                            }</div>
                        </div>
                    </div>
                    <div className='top_5_posts-arrow_next'><MaterialIcons iconName={'ArrowRight'} /></div>
                </div>
            ))
        }
    </div>
    )
}

export default PopularPosts
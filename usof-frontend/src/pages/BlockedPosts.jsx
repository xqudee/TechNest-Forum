import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { usePost } from '../hooks/usePost';
import { usePagination } from '../hooks/usePagination';
import { useAuth } from '../hooks/useAuth';
import PostPreview from '../components/Posts/PostPreview';
import Pagination from '../components/Pagination/Pagination';

const POSTS_PER_PAGE = 5;

const BlockedPosts = () => {
    const location = useLocation();
    const { fetchData, getBlockedPosts } = usePost();
    const [posts, setPosts] = useState([]);
    const { currentItems, paginate, getCurrentItems, currentPage } = usePagination();
    const navigate = useNavigate();
    const auth = useAuth();

    const getPosts = async () => {
        let res = await getBlockedPosts();
        setPosts(res);
        getCurrentItems(POSTS_PER_PAGE, res);
    }

    useEffect(() => { 
        getPosts();
    }, [location])

    return (
    <div className='center_section'>
        <h3 className='h3-bg'>Blocked posts</h3>
        {
            posts?.length != 0 ? (
                currentItems?.map((post, index) => {
                    return (post.type == 'active' || auth.role == 'admin') && ( 
                        <PostPreview post={post} key={index} currentItems={currentItems} />
                    )
                })
            ) : (
                <div>No blocked posts</div>
            )
        }
        <Pagination itemsPerPage={POSTS_PER_PAGE} totalItems={posts?.length} paginate={paginate} currentPage={currentPage} />
    </div>
    )
}

export default BlockedPosts
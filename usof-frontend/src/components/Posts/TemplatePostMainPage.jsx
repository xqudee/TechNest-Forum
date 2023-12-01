import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { usePost } from '../../hooks/usePost';
import { usePagination } from '../../hooks/usePagination';
import { useAuth } from '../../hooks/useAuth';
import PostPreview from './PostPreview';
import Pagination from '../Pagination/Pagination';
import { SortedOptions } from '../../data/sortedOptions';

const POSTS_PER_PAGE = 10;

const TemplatePostMainPage = ({sorted, category, searchName}) => {
    const location = useLocation();
    const { fetchData, getFollowingPosts, searchPostByName, getPostsByCategory } = usePost();
    const [posts, setPosts] = useState([]);
    const { currentItems, paginate, getCurrentItems, currentPage } = usePagination();
    const navigate = useNavigate();
    const auth = useAuth();
    const [message, setMessage] = useState('No posts');

    const getPosts = async () => {
        const allPosts = await fetchData();
        let res;

        if (sorted == SortedOptions.DATE) {
            res = allPosts.sort((a, b) => {
                const dateA = new Date(a.publish_date).getTime();
                const dateB = new Date(b.publish_date).getTime();
                return dateB - dateA; 
            });
        }

        if (sorted == SortedOptions.RATING) {
            res = allPosts.sort((a, b) => b.rating - a.rating);
        }
        if (category) {
            res = await getPostsByCategory(category.id)
            if (!auth) {
                setMessage('You must authorised to see posts');
            }
            else if (!res) {
                res = []
                setMessage('No posts in category');
            }
        }
        if (searchName) {
            res = await searchPostByName(searchName)
        }

        setPosts(res);
        getCurrentItems(POSTS_PER_PAGE, res);
    }

    useEffect(() => { 
        getPosts();
    }, [location, category, searchName])

    return (
    <div className='center_section posts_section'>
        {category && (
            <h3 className='h3-bg'>{category.title}</h3>
        )}
        {
            currentItems?.length != 0 ? (
                <div className='posts_container'>
                    {currentItems?.map((post, index) => {
                        return (post.type == 'active' || auth?.role == 'admin') && ( 
                            <PostPreview post={post} key={index} currentItems={currentItems}/>
                        )
                    })}
                </div>
                
            ) : (
                <div className='no-posts-cont'>{message}</div>
            )
        }
        <Pagination itemsPerPage={POSTS_PER_PAGE} totalItems={posts?.length} paginate={paginate} currentPage={currentPage} />
    </div>
    )
}

export default TemplatePostMainPage
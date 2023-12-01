import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { usePost } from '../hooks/usePost';
import { usePagination } from '../hooks/usePagination';
import { useAuth } from '../hooks/useAuth';
import PostPreview from '../components/Posts/PostPreview';
import Pagination from '../components/Pagination/Pagination';
import UserPreview from '../components/Users/UserPreview';
import { useUsers } from '../hooks/useUsers';
import '../components/Posts/Posts.css'

const POSTS_PER_PAGE = 10;
const USERS_PER_PAGE = 30;

const Following = () => {
    const location = useLocation();
    const { fetchData, getFollowingPosts, searchPostByName, getPostsByCategory } = usePost();
    const { getFollowingUsers } = useUsers()
    const [posts, setPosts] = useState([]);
    const { currentItems, paginate, getCurrentItems, currentPage } = usePagination();
    const navigate = useNavigate();
    const auth = useAuth();
    const [currentFollowing, setCurrentFollowing] = useState('Posts');

    const getPosts = async (currentFollowing) => {
        let res = await getFollowingPosts();
        if (currentFollowing == 'Users') res = await getFollowingUsers();
        setPosts(res);
        getCurrentItems(POSTS_PER_PAGE, res);
    }

    const handleClick = (obj) => {
        setCurrentFollowing(obj)
        getPosts(obj);
    } 

    useEffect(() => { 
        getPosts();
    }, [location])

    return (
    <div className='center_section posts_section'>
        <div className='following_menu-cont'>
            <ul className='following_menu default-bg ul'>
                <li className={`following_menu-item ${currentFollowing == 'Posts' && 'box-shadow'}`} onClick={() => handleClick('Posts')}>Posts</li>
                <li className={`following_menu-item ${currentFollowing == 'Users' && 'box-shadow'}`} onClick={() => handleClick('Users')}>Users</li>
            </ul>
        </div>
        {
            currentFollowing == 'Posts' && (
                <div>
                    <div className='posts_container'>
                        {currentItems?.length != 0 ? (
                            currentItems?.map((post, index) => {
                                return (post.type == 'active' || auth?.role == 'admin') && ( 
                                    <PostPreview post={post} key={index} currentItems={currentItems}/>
                                )
                            })
                        ) : (
                            <div>No posts</div>
                        )}
                    </div>

                    <Pagination itemsPerPage={POSTS_PER_PAGE} totalItems={posts?.length} paginate={paginate} currentPage={currentPage} />
                </div>
            )
        }
        {
            currentFollowing == 'Users' && (
                <div className='center_section posts_section'>
                    <div className='users_container'>
                        {currentItems?.length != 0 ? (
                            currentItems?.map((user, index) => {
                                return ( 
                                    <UserPreview user={user} key={index} currentItems={currentItems}/>
                                )
                            })
                        ) : (
                            <div>No users</div>
                        )}
                        <Pagination itemsPerPage={USERS_PER_PAGE} totalItems={posts?.length} paginate={paginate} currentPage={currentPage} />
                    </div>
                </div>
            )
        }
        {/* {
            currentItems?.length != 0 ? (
                currentItems?.map((post, index) => {
                    return (post.type == 'active' || auth?.role == 'admin') && ( 
                        <PostPreview post={post} key={index} currentItems={currentItems}/>
                    )
                })
            ) : (
                <div>No posts</div>
            )
        } */}
    </div>
    )
}

export default Following
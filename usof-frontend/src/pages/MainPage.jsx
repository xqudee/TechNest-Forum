import Header from '../components/Header/Header';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainPage.css'
import '../styles/Buttons.css'
import { useAuth } from '../hooks/useAuth'
import route from '../API/route';
import { usePost } from '../hooks/usePost';
import PostsBySearch from './PostsBySearch';
import { useWidth } from '../hooks/useWidth';

const MainPage = () => {
    const [postName, setPostName] = useState('');
    const auth = useAuth();
    const location = useLocation();
    const {windowWidth} = useWidth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPostName(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    useEffect(() => {
    }, [location])

    return (
    <section className='main_page-section'>
        <div className={`main_page-container`}>
            {auth && (
                <div className='create_post-main_page-container'>
                    <div className='create_post-main_page default-bg'>
                        <Link to={`/users/${auth.id}`} className='post_info-author-avatar'>
                            <img className='post_info-author-avatar-img' src={`${route.serverURL}/avatars/${auth.photo}`} />
                        </Link>
                        <form className='create_post-form' onSubmit={handleSubmit}>
                            <input type='text' id='create' className='create_post-input-main_page border_3' name="create" placeholder="Search..."
                                value={postName}
                                onChange={handleChange}
                            />

                            <button onClick={handleSubmit} className='create_post-button-main_page button fill_bg-btn'>
                                <Link to={{ pathname: "/create_post" }} className='create_post-link border_3'>
                                    Create post
                                </Link>
                            </button>
                        </form>
                    </div>

            </div>
            )}
        </div>
        { windowWidth <= 768 && (
            <div className='main_page-mobile_sort-section'>
                <ul className='ul main_page-mobile_sort-div'>
                    <li className='main_page-mobile_sort-item' onClick={() => navigate('/recent-posts')}>Recent</li>
                    <li className='main_page-mobile_sort-item' onClick={() => navigate('/popular-posts')}>Popular</li>
                    {auth && <li className='main_page-mobile_sort-item' onClick={() => navigate('/following')}>Following</li>}
                </ul>
            </div>
        )}
        {postName.length > 0 ? (
            <PostsBySearch searchName={postName} />
        ) : (
            <Outlet />
        )}
    </section>
    )
}

export default MainPage
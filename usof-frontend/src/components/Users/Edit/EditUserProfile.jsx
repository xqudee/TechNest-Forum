import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from "../../../API/axios";
import { useContext, useEffect, useState } from 'react';
import route from '../../../API/route';
import "../Users.css"
import "../UserProfile.css"
import "./EditProfile.css"
import { useUsers } from '../../../hooks/useUsers';
import { useAuth } from '../../../hooks/useAuth';
import { usePost } from '../../../hooks/usePost';
import PostPreview from '../../Posts/PostPreview';
import PostPreviewInProfile from '../PostPreviewInProfile';
import Pagination from '../../Pagination/Pagination';
import { usePagination } from '../../../hooks/usePagination';
import { formattedDate } from '../../../utils/helpers';
import MaterialIcons from '../../ui/MaterialIcons';
import UserPreviewInProfile from '../UserPreviewInProfile';
import Editor from '../../Posts/Editor';
import { useModel } from '../../../hooks/useModel';
import modelsEnum from '../../../utils/models-enum';
import PhotoUploader from '../../Uploader/PhotoUploader';
import parse from 'html-react-parser';


const EditUserProfile = () => {
    const { userId } = useParams();
    const { getUserById, } = useUsers();
    const { updateById, updatePhotoById } = useModel(modelsEnum.USERS)
    const [ user, setUser ] = useState();
    const [ userPosts, setUserPosts ] = useState();
    const [ followersCount, setFollowersCount ] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({
        login: '',
        name: '',
    });

    const [about, setAbout] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataInputs = {
            login: formData.login,
            about: about
        };

        const jsonData = JSON.stringify(dataInputs);
        console.log(jsonData);

        const res = await updateById(userId, jsonData);

        if (file) {
            await updatePhotoById(userId, file);
        }
        if (res) navigate(`/users/${userId}`);
    }

    useEffect(() => {
        const getUser = async () => {
            const res = await getUserById(userId);
            setUser(res);
            setFormData({
                ...formData,
                login: res.login,
            });
            setAbout(res.about?.trim())
        }
        
        getUser();
    }, [location])

    return (
        <div className='center_section user_profile-section'>
            <div className='user_profile-top_section'>
                <div className='user_profile-top_section-about'>
                    <div className='user_profile-avatar_cont'>
                        <PhotoUploader currentImageUrl={`${route.serverURL}/avatars/${user?.photo}`} image={image} setImage={setImage} setFile={setFile} />
                    </div>
                    <div className='user_profile-info_cont'>
                        <div className='user_profile-info_main'>
                            <div className='user_profile-info_main-login'>
                                <input type='text' id='login' className='edit_profile-input'
                                    name='login'
                                    value={formData['login']}
                                    autoFocus
                                    onChange={handleChange} />
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
                    </div>
                </div>
            </div>
            <div className='user_profile-about_section'>
                <h3 className='default-bg'>About</h3>
                <Editor content={about} setContent={setAbout} />
            </div>
            <div className='submit_edit_container'>
                <button onClick={handleSubmit} className='button-yellow'>Submit</button>
            </div>
        </div>
    )
}

export default EditUserProfile
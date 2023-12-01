import Header from '../../Header/Header';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './CreatePostPage.css'
import axios from '../../../API/axios';
import Editor from '../Editor';
import MaterialIcons from '../../ui/MaterialIcons';
import { useCategory } from '../../../hooks/useCategory';
import { usePost } from '../../../hooks/usePost';
import Select from 'react-select'
import MultiSelect from '../../Select/MultiSelect';

const Template = ({postId, handleSubmit}) => {
    const location = useLocation();
    const { getPostById } = usePost()
    const { fetchCategoryData, getCategoryByFullName } = useCategory();
    const navigate = useNavigate();
    const [options, setOptions] = useState([]);
    const [defaultOptions, setDefaultOptions] = useState([]); 

    const [postInfo, setPostInfo] = useState({
        title: ''
    });
    const [ postCategories, setPostCategories ] = useState([]);
    const [ content, setContent ] = useState();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostInfo({
            ...postInfo,
            [name]: value,
        });
    }

    const handleChooseCategory = async (e) => {
        const arr = [];
        e.forEach(async item => {
            const categoryName = item.value;
            const category = await getCategoryByFullName(categoryName);
            arr.push(category)
            setPostCategories(arr)
        })
    }

    const handleForm = () => {
        const data = {
            title: postInfo.title,
            content: content,
            categories: postCategories,
        }
        handleSubmit(data);
        navigate('/')
    }

    useEffect(() => {
        const getPost = async () => {
            const res = await getPostById(postId);
            setContent(res?.content);
            const defaultArr = []

            res?.post_categories?.forEach(async (category) => {
                if (category != 'Uncategorized')  {
                    const resp = await getCategoryByFullName(category);
                    defaultArr.push({
                        value: resp.title,
                        label: resp.title
                    })
                    setDefaultOptions(defaultArr)
                    console.log(defaultArr);
                }
            });
            setPostInfo({
                ...postInfo,
                title: res?.title,
            });
        }
        const getAllCategories = async () => {
            const res = await fetchCategoryData();
            const arr = []
            res.forEach(category => {
                if (category.title != 'Uncategorised') {
                    arr.push({
                        value: category.title,
                        label: category.title
                    })
                    setOptions(arr);
                }
            });
        }
        
        if (postId) getPost();
        getAllCategories();
    }, [])

    return (
        <div className='create_post_form-cotnainer'>
            <form className='create_post_form' onSubmit={handleForm}>
                <div className='create_post-input_container'>
                    <label className='input_create_post-label'>Post title</label>
                    <input type='text' id='post_title' className='post_title_input create_post-input' 
                        name="title"
                        value={postInfo.title}
                        onChange={handleChange}
                        // placeholder='Title'
                        required />
                </div>
                <div className='create_post-input_container'>
                    <label className='input_create_post-label'>Post content</label>
                    <Editor content={content} setContent={setContent} />
                </div>
                <div className='create_post-input_container'>
                    <label className='input_create_post-label'>Post categories</label>
                    <div className='post_categories-input-container'>
                            <MultiSelect options={options} handleChange={handleChooseCategory} defaultOptions={defaultOptions} />
                    </div> 
                </div>
                <div className='submit_btn-container'>
                    <button className='submit_btn button-yellow'>Create</button>
                </div>
            </form>
        </div>
    )
}

export default Template
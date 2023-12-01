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
import Template from './Template';

const CreatePost = () => {
    const { createPost } = usePost();
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleSubmit = async (data) => {
        await createPost(data);
        navigate('/');
    }

    return (
        <section className='create_post-section center_section'>
            <div className='create_post-container'>
                <h2 className='h3-bg'>Create a new post</h2>
                <Template handleSubmit={handleSubmit} />
            </div>
        </section>
    )
}

export default CreatePost
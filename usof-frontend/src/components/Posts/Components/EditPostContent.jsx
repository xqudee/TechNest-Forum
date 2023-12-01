import Header from '../../Header/Header';
import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './CreatePostPage.css'
import axios from '../../../API/axios';
import Editor from '../Editor';
import MaterialIcons from '../../ui/MaterialIcons';
import { useCategory } from '../../../hooks/useCategory';
import { usePost } from '../../../hooks/usePost';
import Template from './Template';

const EditPost = () => {
    const { postId } = useParams();
    const { editPost } = usePost();
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        await editPost(data, postId);
        navigate('/');
    }

    return (
        <section className='create_post-section center_section'>
            <div className='create_post-container'>
                <h2 className='h3-bg'>Edit</h2>
                <Template postId={postId} handleSubmit={handleSubmit} />
            </div>
        </section>
    )
}

export default EditPost
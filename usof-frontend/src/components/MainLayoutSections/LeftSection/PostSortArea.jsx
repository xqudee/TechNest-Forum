import { Outlet, useNavigate } from 'react-router-dom';
import axios from "../../../API/axios";
import { useEffect, useState } from 'react';
import route from '../../../API/route';
import { useModel } from '../../../hooks/useModel';
import modelsEnum from '../../../utils/models-enum';
import { usePost } from '../../../hooks/usePost';
import { useAuth } from '../../../hooks/useAuth';
import MaterialIcons from '../../ui/MaterialIcons';
import { SortedOptions } from '../../../data/sortedOptions';

const PostSortArea = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    return (
    <div className='posts_sort_section main_layout-section-container default-bg'>
        <div className='main_layout-section-item hover-cont posts_sort_section-item recent' onClick={() => navigate('/recent-posts')}>
            <div className='posts_sort_section-item_icon'><MaterialIcons iconName={'Star'} /></div>
            <div className='posts_sort_section-info'>
                <h4>Recent</h4>
                <p className='posts_sort_section-info-desc'>Most recently created posts</p>
            </div>
        </div>
        <div className='main_layout-section-item hover-cont posts_sort_section-item popular' onClick={() => navigate('/popular-posts')}>
            <div className='posts_sort_section-item_icon'><MaterialIcons iconName={'Top'} /></div>
            <div className='posts_sort_section-info'>
                <h4>Popular</h4>  
                <p className='posts_sort_section-info-desc'>Most popular topics</p>
            </div>
        </div>
        {auth && (
            <div className='main_layout-section-item hover-cont posts_sort_section-item following' onClick={() => navigate('/following')}>
                <div className='posts_sort_section-item_icon'><MaterialIcons iconName={'FollowingPosts'} /></div>
                <div className='posts_sort_section-info'>
                    <h4>Following</h4>
                    <p className='posts_sort_section-info-desc'>Your followed posts</p>
            </div>
        </div>
        )}
    </div>
    )
}

export default PostSortArea
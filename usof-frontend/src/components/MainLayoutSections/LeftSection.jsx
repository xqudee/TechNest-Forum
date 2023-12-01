import { Outlet } from 'react-router-dom';
import axios from "../../API/axios";
import { useEffect, useState } from 'react';
import route from '../../API/route';
import { useModel } from '../../hooks/useModel';
import modelsEnum from '../../utils/models-enum';
import { usePost } from '../../hooks/usePost';
import { useAuth } from '../../hooks/useAuth';
import PostSortArea from './LeftSection/PostSortArea';
import './LayoutSections.css'
import PinnedCategories from './LeftSection/PinnedCategories';
import PinnedUsers from './LeftSection/PinnedUsers';

const LeftSection = () => {
    return (
        <div className='main_layout-section'>
            <PostSortArea />
            <PinnedCategories />
            <PinnedUsers />
        </div>
    )
}

export default LeftSection
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from "../../../API/axios";
import { useContext, useEffect, useState } from 'react';
import route from '../../../API/route';
import { useModel } from '../../../hooks/useModel';
import modelsEnum from '../../../utils/models-enum';
import { usePost } from '../../../hooks/usePost';
import { useAuth } from '../../../hooks/useAuth';
import { useCategory } from '../../../hooks/useCategory';
import { PinnedCategoriesContext } from '../../../pages/Layout';
import MaterialIcons from '../../ui/MaterialIcons';
import { cutTitle } from '../../../utils/helpers';

const PinnedCategories = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { getPinnedCategories, addCategoryToPinned } = useCategory()
    const [ pinnedCategories, setPinnedCategories ] = useState([])

    const handleDelete = async (category_id) => {
        await addCategoryToPinned(category_id);
        navigate(location)
    }

    useEffect(() => {
        const getCategories = async () => {
            const res = await getPinnedCategories();
            setPinnedCategories(res) 
        }
        getCategories();
    }, [location])


    return (
    <div className='pinned_categories_section main_layout-section-container default-bg'>
        <h4>Pinned categories</h4>
        { auth ? (
            <div className='posts_sort_section main_layout-section-container'>
                {pinnedCategories ? pinnedCategories.map((category, index) => (
                    index < 8 &&
                    <div key={index} className='pinned-section-item hover-cont' onClick={() => navigate(`/${category.title}/posts`)}>
                        <div className='posts_sort_section-info'>
                            <h4>{category.title}</h4>
                            <div className='posts_sort_section-info-desc'>{cutTitle(category.description, 28)}</div>
                        </div>
                            <div className='pinned_info-del_cont' onClick={() => handleDelete(category.category_id)}>
                                <MaterialIcons iconName={'DeleteClose'} />
                            </div>
                    </div>
                )) : (
                    <div>No posts</div>
                )}
            </div>
        ) : (
            <div>You must authorised</div>
        )}
    </div>
    )
}

export default PinnedCategories
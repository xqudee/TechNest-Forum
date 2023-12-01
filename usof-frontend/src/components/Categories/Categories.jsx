// import { Outlet, useLocation } from 'react-router-dom';
// import Post from './Post';
// import axios from "../../API/axios";
// import { useContext, useEffect, useState } from 'react';
// import route from '../../API/route';
// import { useModel } from '../../hooks/useModel';
// import modelsEnum from '../../utils/models-enum';
import { useLocation } from 'react-router-dom';
import { useCategory } from '../../hooks/useCategory';
import { usePagination } from '../../hooks/usePagination';
import './Categories.css'
import { useEffect } from 'react';
import CategoryPreview from './CategoryPreview';
import Pagination from '../Pagination/Pagination';
// import { usePost } from '../../hooks/usePost';
// import PostPreview from './PostPreview';
// import { SortedContext } from '../../pages/Layout';
// import { SortedOptions } from '../../data/sortedOptions';
// import Pagination from '../Pagination/Pagination';
// import { usePagination } from '../../hooks/usePagination';

const ITEMS_PER_PAGE = 5;

const Categories = () => {
    // const sorted = useContext(SortedContext);
    const location = useLocation();
    const { fetchCategoryData, categories, isCategoryPinned } = useCategory();
    // const [posts, setPosts] = useState([]);
    const { currentItems, paginate, getCurrentItems, currentPage } = usePagination();

    const getCategories = async () => {
        const res = await fetchCategoryData();
        getCurrentItems(ITEMS_PER_PAGE, res);
        res.forEach(async (category) => {
            await isCategoryPinned(category.id);
        });
    }

    useEffect(() => { 
        getCategories();
    }, [location])

    return (
    <div className='center_section categories_section'>
        <div className='categories_container'>
            {
                categories.length != 0 ? (
                    categories?.map((category, index) => (
                        <CategoryPreview category={category} key={index} currentItems={currentItems} />
                    ))
                ) : (
                    <div>No posts</div>
                )
            }
        </div>
        {/* <Pagination itemsPerPage={ITEMS_PER_PAGE} totalItems={categories.length} paginate={paginate} currentPage={currentPage} /> */}
    </div>
    )
}

export default Categories
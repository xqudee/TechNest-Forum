// import { Outlet, useLocation } from 'react-router-dom';
// import Post from './Post';
// import axios from "../../API/axios";
// import { useContext, useEffect, useState } from 'react';
// import route from '../../API/route';
// import { useModel } from '../../hooks/useModel';
// import modelsEnum from '../../utils/models-enum';
// import './Posts.css'
// import PostPreview from './PostPreview';
// import { SortedContext } from '../../pages/Layout';
// import { SortedOptions } from '../../data/sortedOptions';
// import Pagination from '../Pagination/Pagination';
// import { usePagination } from '../../hooks/usePagination';

import { useLocation } from 'react-router-dom';
import { useUsers } from "../../hooks/useUsers";
import { useEffect, useState } from 'react';
import Pagination from '../Pagination/Pagination';
import { usePagination } from '../../hooks/usePagination';
import UserPreview from './UserPreview';

const USERS_PER_PAGE = 40;

const Users = () => {
    const location = useLocation();
    const { fetchData, isFavoriteAuthors } = useUsers();
    const { currentItems, paginate, getCurrentItems, currentPage } = usePagination();
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        const res = await fetchData();
        setUsers(res);
        getCurrentItems(USERS_PER_PAGE, res);
    }

    useEffect(() => { 
        getUsers();
    }, [location])

    return (
    <div className='center_section users_section'>
        <div className='users_container'>
        {
            currentItems.length != 0 ? (
                currentItems?.map((user, index) => (
                    <UserPreview user={user} key={index} currentItems={currentItems} />
                ))
            ) : (
                <div>No users</div>
            )
        }
        </div>
        <Pagination itemsPerPage={USERS_PER_PAGE} totalItems={users.length} paginate={paginate} currentPage={currentPage} />
    </div>
    )
}

export default Users
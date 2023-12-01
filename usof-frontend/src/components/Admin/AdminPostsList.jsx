import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useModel } from '../../hooks/useModel';
import modelsEnum from '../../utils/models-enum';
import AdminTable from './AdminTable/Table/AdminTable';
import HeaderTitle from '../HeaderTitle';
import Pagination from '../Pagination/Pagination';
import { usePagination } from '../../hooks/usePagination';
// import Navbar from './Navbar';

const ITEMS_PER_PAGE = 10;

const AdminPostsList = () => {
    const { currentItems, paginate, getCurrentItems, currentPage } = usePagination();
    const { handleSearch, tableItems, searchTerm, deleteAsync, fetchData } = useModel(modelsEnum.POSTS);
    const location = useLocation();
    const headerItems = [
        {
            name: 'Title',
            val: 'title'
        }, {
            name: 'Id',
            val: 'id'
        }, {
            name: 'Creator',
            val: 'login'
        }, {
            name: 'Type',
            val: 'type'
        }, {
            name: 'Rating',
            val: 'rating'
        }, 
    ];

    useEffect(() => {
        const getItems = async () => {
            const res = await fetchData();
            getCurrentItems(ITEMS_PER_PAGE, res);
        }
        getItems();
    }, [location])

    return (
        <div className="admin_panel-container">
            <div className='admin_panel-table-section'>
                <HeaderTitle title={'Posts'} />
            </div>

            <AdminTable headerItems={headerItems} tableItems={currentItems || []} removeHandler={deleteAsync} />
            <div className='admin-pagination'>
                <Pagination itemsPerPage={ITEMS_PER_PAGE} totalItems={tableItems?.length} paginate={paginate} currentPage={currentPage} />
            </div>
        </div>
    )
}

export default AdminPostsList
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AdminTable from './AdminTable/Table/AdminTable';
import HeaderTitle from '../HeaderTitle';
import { useModel } from '../../hooks/useModel';
import modelsEnum from '../../utils/models-enum';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../Pagination/Pagination';
// import Navbar from './Navbar';

const ITEMS_PER_PAGE = 10;

const AdminCategoriesList = () => {
    const { currentItems, paginate, getCurrentItems, currentPage } = usePagination();
    const { handleSearch, tableItems, searchTerm, deleteAsync, fetchData } = useModel(modelsEnum.CATEGORIES);
    const location = useLocation();
    const headerItems = [
        {
            name: 'Title',
            val: 'title'
        }, {
            name: 'Id',
            val: 'id'
        }
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
                <HeaderTitle title={'Categories'} />
                <Link to={'/admin-panel/categories/create'} className='button-yellow'>
                    Create New
                </Link>
            </div>

            <AdminTable headerItems={headerItems} tableItems={currentItems} removeHandler={deleteAsync} />
            <div className='admin-pagination'>
                <Pagination itemsPerPage={ITEMS_PER_PAGE} totalItems={tableItems?.length} paginate={paginate} currentPage={currentPage} />
            </div>
        </div>
    )
}

export default AdminCategoriesList
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import Navbar from './Navbar';

const AdminTableHeader = (headerItems) => {
    
    return (
        <thead className='admin_panel-table-head'>
            <tr className="admin_table_header-section">
                {headerItems.headerItems.map((item, index) => (
                    <th key={index}>{item.name}</th>
                ))}
                <th className='td-flex'>Actions</th>
            </tr>
        </thead>
    )
}

export default AdminTableHeader
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AdminTableHeader from './AdminTableHeader';
import AdminTableItem from './AdminTableItem';
// import Navbar from './Navbar';

const AdminTable = ({headerItems, tableItems, removeHandler}) => {
    return (
        <>
            {tableItems.length ? (
                <div className='admin_panel-table-container'>
                    <table className='admin_panel-table'>
                        <AdminTableHeader headerItems={headerItems} />
                        <tbody className='admin_table_item-section'>
                            {tableItems.map((item, index) => 
                                <AdminTableItem 
                                    key={index} 
                                    tableItem={item} 
                                    headerItems={headerItems}
                                    removeHandler={() => removeHandler(item.id)}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>Elements not found</div>
            )}
        </>
    )
}

export default AdminTable
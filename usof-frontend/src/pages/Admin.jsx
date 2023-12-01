import '../styles/Admin.css';
import panel from "../data/admin-nav.json"
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AdminUsersList from '../components/Admin/AdminUsersList';
import { useState } from 'react';

const Admin = () => {
    return (
        <section className='center_section'>
            <div className="admin_nav-container">
                <ul className="admin_nav-list ul">
                    {
                        panel.adminNav.map((item, index) => (
                            <li key={index} className='admin_nav-item'>
                                <Link to={`${item.link}`} className='admin_nav-item_link hover-cont'>{item.name}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <Outlet current={panel.adminNav[0]}/>
        </section>
    )
}

export default Admin
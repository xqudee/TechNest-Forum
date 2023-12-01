import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminCreate.css'
import HeaderTitle from '../../../HeaderTitle';
import { CONFIG } from '../../../../App';
import axios from '../../../../API/axios';
import { toastr } from 'react-redux-toastr';
import MaterialIcons from '../../../ui/MaterialIcons';
import modelsEnum from '../../../../utils/models-enum';
import { useModel } from '../../../../hooks/useModel';
import AdminCreateTemplate from './AdminCreateTemplate';
// import Navbar from './Navbar';

const AdminCreateUser = () => {
    const navigate = useNavigate();
    const { createItem } = useModel(modelsEnum.USERS);
    const backLink = '/admin-panel/users'
    const headerTitle = 'Create user'
    const formInputs = [
        {
            name: 'Login',
            val: 'login',
            type: 'text',
            isRequired: true,
        }, {
            name: 'Email',
            val: 'email',
            type: 'text',
            isRequired: true,
        }, {
            name: 'Password',
            val: 'password',
            type: 'password',
            isRequired: true,
        }, {
            name: 'Role',
            val: 'role',
            type: 'select',
            options: ['user', 'admin'],
            isRequired: true,
        }, {
            name: 'Name',
            val: 'name',
            type: 'text',
            isRequired: false,
        }]

    const [formData, setFormData] = useState({
        login: '',
        email: '',
        password: '',
        role: 'user',
        name: ''
    });

    return (
        <section className='admin_create-section'>
            <AdminCreateTemplate 
                formData={formData} 
                setFormData={setFormData} 
                createItem={createItem} 
                backLink={backLink}
                headerTitle={headerTitle}
                formInputs={formInputs}
                />
        </section>
    )
}

export default AdminCreateUser
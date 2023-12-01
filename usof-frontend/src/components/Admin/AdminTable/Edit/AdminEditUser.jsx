import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useActions } from '../../../../hooks/useActions';
// import './AdminCreate.css'
import HeaderTitle from '../../../HeaderTitle';
import { CONFIG } from '../../../../App';
import { toastError, toastSuccess } from '../../../../utils/toast-error';
import axios from '../../../../API/axios';
import { toastr } from 'react-redux-toastr';
import MaterialIcons from '../../../ui/MaterialIcons';
// import { useUsers } from '../../../../hooks/useUsers';
import { useModel } from '../../../../hooks/useModel';
import modelsEnum from '../../../../utils/models-enum';
import AdminEditTemplate from './AdminEditTemplate';
// import Navbar from './Navbar';

const AdminEditUser = () => {
    const backLink = '/admin-panel/users'
    const headerTitle = 'User info'
    const { getById, updateById } = useModel(modelsEnum.USERS);
    const { id } = useParams();

    const [formData, setFormData] = useState({
        login: '',
        email: '',
        role: '',
        name: '',
        rating: 0
    });

    const formInputs = [
        {
            name: 'Id',
            val: 'id',
            type: 'text',
            isRequired: true,
            isEditable: false,
        },
        {
            name: 'Login',
            val: 'login',
            type: 'text',
            isRequired: true,
            isEditable: false,
        }, {
            name: 'Email',
            val: 'email',
            type: 'text',
            isRequired: true,
            isEditable: false,
        }, {
            name: 'Role',
            val: 'role',
            type: 'select',
            options: ['user', 'admin'],
            isRequired: true,
            isEditable: true,
        }, {
            name: 'Name',
            val: 'name',
            type: 'text',
            isRequired: false,
            isEditable: false,
        }, {
            name: 'Rating',
            val: 'rating',
            type: 'text',
            isRequired: false,
            isEditable: false,
        }]

    return (
        <section className='admin_create-section'>
        
            <AdminEditTemplate 
                modelName={modelsEnum.USERS}
                id={id}
                getById={getById}
                updateById={updateById}
                formData={formData} 
                setFormData={setFormData} 
                backLink={backLink}
                headerTitle={headerTitle}
                formInputs={formInputs}
                />
        </section>
    )
}

export default AdminEditUser
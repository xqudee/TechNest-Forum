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

const AdminCreateCategory = () => {
    const navigate = useNavigate();
    const { createItem } = useModel(modelsEnum.CATEGORIES);
    const backLink = '/admin-panel/categories'
    const headerTitle = 'Create category'
    const formInputs = [
        {
            name: 'Title',
            val: 'title',
            type: 'text',
            isRequired: true,
        }, {
            name: 'Description',
            val: 'description',
            type: 'text',
            isRequired: false,
        }
    ]

    const [formData, setFormData] = useState({
        title: '',
        description: ''
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

export default AdminCreateCategory
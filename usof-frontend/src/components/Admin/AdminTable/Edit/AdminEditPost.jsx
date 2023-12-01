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

const AdminEditPost = () => {
    const backLink = '/admin-panel/posts'
    const headerTitle = 'Post info'
    const { getById, updateById } = useModel(modelsEnum.POSTS);
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        photo: '',
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
            name: 'Title',
            val: 'title',
            type: 'text',
            isRequired: true,
            isEditable: true,
        }, {
            name: 'Creator',
            val: 'user_id',
            type: 'text',
            isRequired: true,
            isEditable: false,
        }, {
            name: 'Publish date',
            val: 'publish_date',
            type: 'text',
            isRequired: true,
            isEditable: false,
        },
        {
            name: 'Rating',
            val: 'rating',
            type: 'text',
            isRequired: true,
            isEditable: false,
        }, {
            name: 'Type',
            val: 'type',
            type: 'select',
            options: ['active', 'inactive'],
            isRequired: true,
            isEditable: true,
        }, {
            name: 'Categories',
            val: 'post_categories',
            type: 'multiselect',
            isRequired: true,
            isEditable: true,
        }
        // {
        //     name: 'Cover',
        //     val: 'photo',
        //     type: 'text',
        //     isRequired: true,
        //     isEditable: false,
        // }
    ]



    return (
        <section className='admin_create-section'>
        
            <AdminEditTemplate 
                modelName={modelsEnum.POSTS}
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

export default AdminEditPost
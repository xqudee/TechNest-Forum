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
import './AdminEdit.css'
import AdminEditTemplate from './AdminEditTemplate';
// import Navbar from './Navbar';

const AdminEditCategory = () => {
    const backLink = '/admin-panel/categories'
    const headerTitle = 'Category info'
    const { getById, updateById } = useModel(modelsEnum.CATEGORIES);
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
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
            name: 'Description',
            val: 'description',
            type: 'text',
            isRequired: false,
            isEditable: true,
        }]



    return (
        <section className='admin_create-section'>
        
            <AdminEditTemplate 
                modelName={modelsEnum.CATEGORIES}
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

export default AdminEditCategory
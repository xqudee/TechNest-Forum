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
import BackButton from '../../../Buttons/BackButton';
// import Navbar from './Navbar';

const AdminCreateTemplate = ({formData, setFormData, createItem, backLink, headerTitle, formInputs}) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataInputs = {}; 

        formInputs.forEach((input) => {
            dataInputs[input.val] = formData[input.val]; 
        });

        const jsonData = JSON.stringify(dataInputs);

        const res = await createItem(jsonData);
        if (res) navigate(backLink);
    }

    return (
        <section className='admin_create-section'>
        
        <div className='admin_create-head-div'>
                <BackButton backLink={backLink} />
                <HeaderTitle title={headerTitle} />
            </div>
            <div className='admin_create-container'>
            <form className='form admin_create' onSubmit={handleSubmit}>
                <div className='inputs-container'>
                    {
                        formInputs.map((inputs, index) => (
                            <div key={index} className='input-container admin_create'>
                                <label className='input_label'>{inputs.name} {inputs.isRequired && (<span style={{color: 'var(--red-color)'}}>*</span>)}</label>
                                {inputs.type === 'select' ? (
                                    <select className='form-input admin_create'
                                        name={`${inputs.val}`}
                                        onChange={handleChange}>
                                        {
                                            inputs.options?.map((option, index) => (
                                                <option key={index}>{option}</option>
                                            ))
                                        }
                                    </select>
                                ) : (
                                    <input type={`${inputs.type}`} id={`${inputs.name}`} className='form-input admin_create' 
                                        name={`${inputs.val}`}
                                        value={formData[inputs.val]}
                                        onChange={handleChange}
                                        required={inputs.isRequired} />
                                )}
                            </div>
                        ))
                    }
                    {/* <div className='input-container admin_create'>
                        <label className='input_label'>Login <span style={{color: 'var(--red-color)'}}>*</span></label>
                        <input type='text' id='login' className='login_input form-input admin_create' name="login" 
                            value={formData.login}
                            onChange={handleChange}
                            required />
                    </div>

                    <div className='input-container admin_create'>
                        <label className='input_label'>Email <span style={{color: 'var(--red-color)'}}>*</span></label>
                        <input type='text' id='email' className='email_input form-input admin_create' name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required />
                    </div>

                    <div className='input-container admin_create'>
                        <label className='input_label'>Password <span style={{color: 'var(--red-color)'}}>*</span></label>
                        <input type='password' id='password' className='password_input form-input admin_create' name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required />
                    </div>

                    <div className='input-container admin_create'>
                        <label className='input_label'>Role <span style={{color: 'var(--red-color)'}}>*</span></label>
                        <select className='role_input form-input admin_create'
                            name='role'
                            onChange={handleChange}>
                            <option>user</option>
                            <option>admin</option>
                        </select>
                    </div>

                    <div className='input-container admin_create'>
                        <label className='input_label'>Name </label>
                        <input type='text' id='name' className='full_name_input form-input admin_create' name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required />
                    </div> */}
                </div>
                <button type="submit" className='form-button button-yellow'>Create</button>
            </form>
            </div>
        </section>
    )
}

export default AdminCreateTemplate
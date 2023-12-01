import Header from '../components/Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../API/axios';
import { CONFIG } from '../App';
import { saveUserToStorage } from '../utils/locale-storage';
import { AuthService } from '../services/auth/auth.service';
import { useActions } from '../hooks/useActions';
import '../styles/Form.css'
import { useDispatch, useSelector } from 'react-redux';
// import Navbar from './Navbar';

const Registration = () => {
    const navigate = useNavigate();
    const { register } = useActions();

    const [formData, setFormData] = useState({
        login: '',
        name: '',
        email: '',
        password: '',
    });

    const [errorMsg, setErrMsg] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jsonData = JSON.stringify({ 
            login: formData.login, 
            name: formData.name,
            email: formData.email, 
            password: formData.password,
        });

        const res = await register(jsonData);
        if (res.type !== "/auth/register/rejected") {
            navigate('/login')
        }
    }

    return (
        <section className='form-section'>
            <div className='logo-container_form-page'>
                <img className='logo-img_form-page' src='/logo_1.svg' />
                <h1>Welcome Back</h1>
            </div>

            <div className='form-container register'>
                <div className='form-container-register-top'>
                    <h1>Create an account</h1>
                    <div className='register_link'>
                        <p>Already have an account?</p>
                        <Link className="login-link" to="/login">
                            Sign In
                        </Link>
                    </div>
                </div>

                <div className='error_container'>
                    {errorMsg}
                </div>
                
                <form className='form register' onSubmit={handleSubmit}>
                    <div className='inputs-container register'>
                        <div className='input-container register'>
                            <label className='input_label register'>Name: </label>
                            <input type='text' id='name' className='full_name_input form-input register editable' name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required />
                        </div>

                        <div className='input-container register'>
                            <label className='input_label '>Login: </label>
                            <input type='text' id='login' className='login_input form-input register editable' name="login" 
                                value={formData.login}
                                onChange={handleChange}
                                required />
                        </div>

                        <div className='input-container register'>
                            <label className='input_label '>Email: </label>
                            <input type='text' id='email' className='email_input form-input register editable' name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required />
                        </div>

                        <div className='input-container register'>
                            <label className='input_label '>Password: </label>
                            <input type='password' id='password' className='password_input form-input register editable' name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required />
                        </div>
                    </div>
                    <button type="submit" className='form-button register'>Sign Up</button>
                    
                </form>
            </div>

        </section>
    )
}

export default Registration
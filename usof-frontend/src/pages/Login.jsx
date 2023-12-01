import Header from '../components/Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../API/axios';
import { CONFIG } from '../App';
import '../styles/Form.css'
import { saveUserToStorage } from '../utils/locale-storage';
import { useActions } from '../hooks/useActions';
// import Navbar from './Navbar';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const { login } = useActions();

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const jsonData = JSON.stringify({ loginOrEmail: formData.login, password: formData.password });
            const res = await login(jsonData);
            if (res.type !== "/auth/login/rejected") {
                navigate('/')
            }
        } catch (error) {
            const responseMsg = error.response.data.message;
            if (responseMsg === "Internal server error") {
                console.log('Something wrong with server');
            } else if (responseMsg === 'Incorrect password') {
                console.log('Incorrect password');
            } else if (responseMsg === 'User not found') {
                console.log('User with such login or email does not exist');
            } 
        }

    }

    return (
        <section className='form-section'>
            <div className='logo-container_form-page'>
                <img className='logo-img_form-page' src='/logo_1.svg' />
                <h1>Welcome Back</h1>
            </div>
            <div className='form-container login'>
                <div className='form-container-login-top'>
                    <h1>Sign In</h1>
                    <div className='register_link'>
                        <p>Are you a new user? </p>
                        <Link className="create_account-link" to="/registration">
                            Create an account
                        </Link>
                    </div>
                    <div className='register_link'>
                        <p>Forgot the password? </p>
                        <Link className="create_account-link" to="/reset-password">
                            Reset
                        </Link>
                    </div>
                </div>
                
                <form className='form login' onSubmit={handleSubmit}>
                    <div className='inputs-container login'>
                        <div className='input-container login'>
                            <label className='input_label'>Login or email </label>
                            <input type='text' id='login' className='login_input form-input login editable' name="login"
                                value={formData.login}
                                onChange={handleChange}
                                required />
                        </div>

                        <div className='input-container login'>
                            <label className='input_label'>Password: </label>
                            <input type='password' id='password' className='password_input form-input login editable' name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required />
                        </div>
                    </div>
                    <button type="submit" className='form-button login'>Sign In</button>
                    
                </form>
            </div>
        </section>
    )
}

export default Login
import Header from '../components/Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../API/axios';
import { CONFIG } from '../App';
import '../styles/Form.css'
import { saveUserToStorage } from '../utils/locale-storage';
import { useActions } from '../hooks/useActions';
import { toastr } from 'react-redux-toastr';
// import Navbar from './Navbar';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [isEmailValid, setIsEmailValid] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        token: ''
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
            const jsonData = JSON.stringify({ email: formData.email });
            try {
                const res = await axios.post(`/api/auth/password-reset`, jsonData, CONFIG);
                setIsEmailValid(true);
            } catch (error) {
                setIsEmailValid(false);
                toastr.error("Such email not found")
            }
        } catch (error) {}
    }

    const handleReset = async (e) => {
        e.preventDefault();

        try {
            const jsonData = JSON.stringify({ password: formData.password });
            try {
                console.log(formData.token);
                const res = await axios.post(`/api/auth/password-reset/${formData.token}`, jsonData, CONFIG);
                if (res) { 
                    toastr.success('Success')
                    navigate('/login')
                }
            } catch (error) {
                console.log(error);
                toastr.error("Password wasn't updated")
            }
        } catch (error) {}
    }

    return (
        <section className='form-section'>
            <div className='logo-container_form-page'>
                <img className='logo-img_form-page' src='/logo_1.svg' />
                <h1>Welcome Back</h1>
            </div>
            <div className='form-container login'>
                <div className='form-container-login-top'>
                    <h1>Reset password</h1>
                    <div className='register_link'>
                        <p>Are you a new user? </p>
                        <Link className="create_account-link" to="/registration">
                            Create an account
                        </Link>
                    </div>
                    <div className='register_link'>
                        <p>Do you remember the password? </p>
                        <Link className="create_account-link" to="/login">
                            Sign in
                        </Link>
                    </div>
                </div>
                
                <div className='form login'>
                    {!isEmailValid ? (
                        <div className='reset-password-page_cont'>
                            <div className='input-container login'>
                                <label className='input_label'>Email </label>
                                <input type='text' id='email' className='login_input form-input login editable' name="email"
                                    value={formData.login}
                                    onChange={handleChange}
                                    required />
                            </div>
                            <button onClick={handleSubmit} className='form-button login'>Next</button>
                        </div>
                    ) : (
                        <div className='reset-password-page_cont'>
                            <div className='message_cont'>An email with the token was sent to the specified email. Copy it and paste it into the field</div>
                            <div className='input-container login'>
                                <label className='input_label'>New password: </label>
                                <input type='password' id='password' className='password_input form-input login editable' name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required />
                            </div>
                            <div className='input-container login'>
                                <label className='input_label'>Token: </label>
                                <input type='token' id='token' className='token_input form-input token login editable' name="token"
                                    value={formData.token}
                                    onChange={handleChange}
                                    required />
                            </div>
                            <button onClick={handleReset} className='form-button login'>Reset</button>
                        </div>
                    )}
                    
                </div>
            </div>
        </section>
    )
}

export default ResetPasswordPage
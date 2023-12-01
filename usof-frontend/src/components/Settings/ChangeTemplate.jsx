
// import Navbar from './Navbar';

import { useState } from "react"
import { useAuth } from "../../hooks/useAuth";
import { comparePasswords } from "../../utils/helpers";
import axios from "../../API/axios";
import { CONFIG } from "../../App";
import { useNavigate } from "react-router-dom";
import { useModel } from "../../hooks/useModel";
import modelsEnum from "../../utils/models-enum";
import ChangePassword from "./ChangePassword";
import ChangeEmail from "./ChangeEmail";
import { toastError } from "../../utils/toast-error";
import { toastr } from "react-redux-toastr";

const ChangeTemplate = ({setIsTruePassword, valToChange}) => {
    const [passwordInput, setPasswordInput] = useState('');
    const auth = useAuth();

    const handleChange = (e) => {
        setPasswordInput(e.target.value);
    }

    const checkPassword = async () => {
        const data = {
            inputPassword: passwordInput,
            hashedPassword: auth.password
        }
        const jsonData = JSON.stringify(data);
        const res = await axios.post(`/api/auth/compare-passwords`, jsonData, CONFIG);
        if (res.data.message == 'Success') {
            setIsTruePassword(true) 
        } else {
            toastr.error('Icorrect password')
            setIsTruePassword(false); 
        }

    }

    return (
        <div className="confirm-password-cont">
            <div className="message_container">
                <p>To change the {valToChange}, you must specify the current password</p>
            </div>
            <div className="change_value-cont">
                <div className="change_value-cont-password">
                    <label>Password</label>
                    <input type="password" name="password" value={passwordInput} onChange={handleChange} />
                </div>
                <div>
                    <button onClick={checkPassword} className="button-yellow">Next</button>
                </div>
            </div>
        </div>
    )
}

export default ChangeTemplate

// import Navbar from './Navbar';

import { useState } from "react"
import { useAuth } from "../../hooks/useAuth";
import { comparePasswords } from "../../utils/helpers";
import axios from "../../API/axios";
import { CONFIG } from "../../App";
import { useNavigate } from "react-router-dom";
import { useModel } from "../../hooks/useModel";
import modelsEnum from "../../utils/models-enum";
import ChangeTemplate from "./ChangeTemplate";

const ChangePassword = () => {
    const [isTruePassword, setIsTruePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const auth = useAuth();
    const { updateById } = useModel(modelsEnum.USERS)
    const navigate = useNavigate();

    const handleChangeNew = (e) => {
        setNewPassword(e.target.value);
    }

    const handleSubmit = async () => {
        const data = {
            password: newPassword
        }
        await updateById(auth.id, JSON.stringify(data));
        navigate('/settings');
    }

    return (
        <>
            {!isTruePassword ? (
                <ChangeTemplate isTruePassword={isTruePassword} setIsTruePassword={setIsTruePassword} valToChange={'password'} />

            ) : (
                <div className="confirm-password-cont">
                    <div className="change_value-cont">
                        <div className="change_value-cont-password">
                            <label>New password</label>
                            <input type="password" name="newPassword" value={newPassword} onChange={handleChangeNew} />
                        </div>
                        <div>
                            <button onClick={handleSubmit} className="button-yellow">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ChangePassword
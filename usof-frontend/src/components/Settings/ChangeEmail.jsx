
// import Navbar from './Navbar';

import { useNavigate } from "react-router-dom";
import { useModel } from "../../hooks/useModel";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import modelsEnum from "../../utils/models-enum";
import ChangeTemplate from "./ChangeTemplate";

const ChangeEmail = () => {
    const [isTruePassword, setIsTruePassword] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const auth = useAuth();
    const { updateById } = useModel(modelsEnum.USERS)
    const navigate = useNavigate();

    const handleChangeNew = (e) => {
        setNewEmail(e.target.value);
    }

    const handleSubmit = async () => {
        const data = {
            email: newEmail
        }
        await updateById(auth.id, JSON.stringify(data));
        navigate('/settings');
    }

    return (
        <>
            {!isTruePassword ? (
                <ChangeTemplate isTruePassword={isTruePassword} setIsTruePassword={setIsTruePassword} valToChange={'email'} />

            ) : (
                <div className="confirm-password-cont">
                    <div className="change_value-cont">
                        <div className="change_value-cont-password">
                            <label>New email</label>
                            <input type="text" name="newEmail" value={newEmail} onChange={handleChangeNew} />
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

export default ChangeEmail
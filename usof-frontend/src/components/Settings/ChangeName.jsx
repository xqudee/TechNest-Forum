
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

const ChangeName = () => {
    const [newName, setNewName] = useState('');
    const auth = useAuth();
    const { updateById } = useModel(modelsEnum.USERS)
    const navigate = useNavigate();

    const handleChangeNew = (e) => {
        setNewName(e.target.value);
    }

    const handleSubmit = async () => {
        const data = {
            name: newName
        }
        await updateById(auth.id, JSON.stringify(data));
        navigate('/settings');
    }

    return (
        <div className="confirm-password-cont">
            <div className="change_value-cont">
                <div className="change_value-cont-password">
                    <label>New name</label>
                    <input type="text" name="newName" value={newName} onChange={handleChangeNew} />
                </div>
                <div>
                    <button onClick={handleSubmit} className="button-yellow">Submit</button>
                </div>
            </div>
        </div>
    )
}

export default ChangeName
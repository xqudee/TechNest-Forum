import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from "../../API/axios";
import { useContext, useEffect, useState } from 'react';
import { formattedDate } from '../../utils/helpers';
import './PhotoUploader.css'
import MaterialIcons from '../ui/MaterialIcons';

const PhotoUploader = ({currentImageUrl, image, setImage, setFile}) => {

    useEffect(() => {
        setImage(currentImageUrl);
    }, [currentImageUrl])

    return (
            <form 
                onClick={() => document.querySelector('.input-load_file').click()}
                className='upload_file-form'>
                <input type='file' accept='image/*' className='input-load_file' hidden
                    onChange={({ target: {files}}) => {
                        files[0] && setFile(files[0]);
                        if (files) {
                            setImage(URL.createObjectURL(files[0]))
                        }
                    }}
                 />
                {image ? (
                    <img className='upload_file-image' src={image} />
                ) : (
                    <MaterialIcons iconName={'FileUploader'} />
                )}
            </form> 
    )
}

export default PhotoUploader
import { useEffect, useMemo, useState } from 'react';
import axios from '../API/axios';
import { toastr } from 'react-redux-toastr';
import modelsEnum from '../utils/models-enum';
import { CONFIG } from '../App';
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useModel = (modelName) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tableItems, setTableItems] = useState([]);
    const location = useLocation();
    const auth = useAuth();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/${modelName}`, { withCredentials: true })
            
            if (response) {
                setTableItems(response.data.data); 
                return response.data.data
            } else {
                setTableItems([]); 
                return [];
            }
        } catch (error) {
            toastr.error('Error request', error.response.data.error)
            return error;
        }
    }

    useEffect(() => {
        fetchData(); 
    }, [location]);

    const createItem = async (jsonData) => {
        try {
            const response = await axios.post(`/api/${modelName}`, jsonData, CONFIG);
            if (response) {
                toastr.success('Successful create');
                return response;
            } 
        } catch (error) {
            toastr.error('Error request', error.response.data.error)
            return error;
        }
    }

    const getById = async (id) => {
        try {
            const response = await axios.get(`/api/${modelName}/${id}`, { withCredentials: true });
            const item = response.data.data;
            return item;
        } catch (error) {
            toastr.error(`Error getting item`);
        }
    }

    const updateById = async (id, jsonData) => {
        if (modelName === modelsEnum.USERS) {
            const user = await getById(id);
            if (((user.role === 'admin' || user.role === 'superadmin') && auth.id != id)) {
                toastr.warning('Access denied', 'You can\'t edit users with admin roots');
                return null;
            }
        } 
        try {
            const response = await axios.patch(`/api/${modelName}/${id}`, jsonData, CONFIG)
            if (response) {
                toastr.success('Successful update');
                return response;
            } 
        } catch (error) {
            toastr.error('Error request', error.response.data.error);
            return error;
        }
    }

    const updatePhotoById = async (id, file) => {
        const data = {
            photo: file
        }
            console.log(modelName);
            console.log(modelsEnum.USERS);
            const jsonData = JSON.stringify(data);
        if (modelName === modelsEnum.USERS) {
            await axios.patch(`/api/users/${id}/avatar`, data, 
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }, withCredentials: true
            })
        }
    }

    const deleteAsync = async (id) => {
        try {
            const item = await getById(id);
            if (item) {
                if (modelName === modelsEnum.USERS && 
                    ((item.role == 'admin' || item.role == 'superadmin') && (id != auth.id))) {
                    toastr.warning('You can\'t delete user with admin roots');
                    return false;
                }
                else {
                    toastr.confirm("Confirm deletion", {
                        onOk: async () => {
                            try {
                                const response = await axios.delete(`/api/${modelName}/${id}`, {withCredentials: true});
                                if (response) {
                                    toastr.success('Success')
                                    fetchData(); 
                                    return true;
                                }
                            } catch (error) {
                                console.log(error);
                                toastr.error('Error')
                                return false;
                            }
                        }
                    });
                }
            }
        } catch (error) {
            toastr.error('Error getting items');
            return false;
        }
    }

    return useMemo(() => ({
        handleSearch, tableItems, searchTerm, deleteAsync, createItem, updateById, getById, updatePhotoById, fetchData
    }), [tableItems, searchTerm, deleteAsync, createItem, updateById, getById, updatePhotoById, fetchData]);
}
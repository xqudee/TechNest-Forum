import { useEffect, useMemo, useState } from 'react';
import axios from '../API/axios';
import { toastr } from 'react-redux-toastr';
import modelsEnum from '../utils/models-enum';
import { CONFIG } from '../App';
import { useAuth } from './useAuth';
import { usePagination } from './usePagination';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [isFollow, setIsFollow] = useState(false);
    const [follow, setFollow] = useState([]);
    const auth = useAuth();

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/users`, { withCredentials: true });
            if (response) {
                setUsers(response.data.data);
                return response.data.data;
            } else {
                setUsers([]);
                return [];
            }
        } catch (error) {
            setUsers([]);
            return [];
        }
    }

    const getUserById = async (id) => {
        try {
            const response = await axios.get(`/api/users/${id}`, { withCredentials: true });
            if (response) {
                return response.data.data;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    const getFollowingUsers = async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId || auth.id}/favorite-users`, { withCredentials: true });
            if (response) {
                return response.data.data || [];
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    const getFollowers = async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId || auth.id}/followers`, { withCredentials: true });
            if (response) {
                return response.data.data || [];
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    const addUserToFollow = async (author_id) => {
        try {
            const response = await axios.post(`/api/users/${author_id}/favorite`, null, { withCredentials: true });
            if (response.data.message == "Author was added to favorites") {
                const arr = follow;
                arr.push(author_id);
                setFollow(arr);
                setIsFollow(true);
            } else {
                setIsFollow(false);
            }
        } catch (error) {
            setIsFollow(false);
        }
    }

    const isFavoriteAuthors = async (author_id) => {
        try {
            const response = await axios.get(`/api/users/${auth.id}/favorite-users`, { withCredentials: true });
            let flag = false;
            if (response.data.data) {
                response.data.data.forEach(item => {
                    console.log(item);
                    if (item.id == author_id) {
                        setIsFollow(true);
                        flag = true;
                        return true;
                    } else if (!flag) {
                        setIsFollow(false);
                    }
                });
                return flag;
            } else {
                setIsFollow(false);
                return false;
            }
        } catch (error) {
            setIsFollow(false);
            return false;
        }
    }

    const getUserPostById = async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId}/posts`, { withCredentials: true });
            if (response) {
                return response.data.data;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }
 
    return useMemo(() => ({
        fetchData, addUserToFollow, isFollow, setIsFollow, isFavoriteAuthors, getUserById, getUserPostById, getFollowingUsers, getFollowers
    }), [fetchData, addUserToFollow, isFollow, setIsFollow, isFavoriteAuthors, getUserById, getUserPostById, getFollowingUsers, getFollowers]);
}
import { useMemo, useState } from 'react';
import axios from '../API/axios';
import { useAuth } from './useAuth';
import { CONFIG } from '../App';

export const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [pinnedCategories, setPinnedCategories] = useState([]);
    const [isPinned, setIsPinned] = useState(false);
    const auth = useAuth();

    const fetchCategoryData = async () => {
        try {
            const response = await axios.get(`/api/categories`, { withCredentials: true });
            if (response) {
                setCategories(response.data.data);
                return response.data.data;
            } else {
                setCategories([]);
                return [];
            }
        } catch (error) {
            setCategories([]);
            return [];
        }
    }

    const getCategoryByName = async (title) => {
        try {
            const response = await axios.get(`/api/categories/category?substring=${title}`, CONFIG);
            console.log(response);
            if (response) {
                return response.data.data;
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    const getCategoryByFullName = async (title) => {
        try {
            const response = await axios.get(`/api/categories/category?title=${title}`, CONFIG);
            console.log(response);
            if (response) {
                return response.data.data[0];
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    const addCategoryToPinned = async (category_id) => {
        try {
            const response = await axios.post(`/api/categories/${category_id}/pinned`, null, { withCredentials: true });
            if (response.data.message == "Category was added to favorites") {
                setIsPinned(true);
            } else {
                setIsPinned(false);
            }
        } catch (error) {
            setIsPinned(false);
        }
    }
 
    const isCategoryPinned = async (category_id) => {
        try {
            const response = await axios.get(`/api/categories/${auth.id}/pinned-categories`, { withCredentials: true });
            if (response.data.data) {
                let flag = true;
                response.data.data.forEach(item => {
                    if (item.category_id == category_id) {
                        setIsPinned(true);
                        flag = false;
                        return true;
                    }
                });
                if (flag) return false;
                return true;
            } else {
                setIsPinned(false);
                return false;
            }
        } catch (error) {
            setIsPinned(false);
        }
    }

    const getPinnedCategories = async () => {
        try {
            const response = await axios.get(`/api/categories/${auth.id}/pinned-categories`, CONFIG);
            if (response) {
                return response.data.data;
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    return useMemo(() => ({
        fetchCategoryData, categories, isPinned, addCategoryToPinned, isCategoryPinned, pinnedCategories, getCategoryByName, getCategoryByFullName, getPinnedCategories
    }), [fetchCategoryData, categories, isPinned, addCategoryToPinned, isCategoryPinned, pinnedCategories, getCategoryByName, getCategoryByFullName, getPinnedCategories]);
}
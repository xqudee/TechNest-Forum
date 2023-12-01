import { useSelector } from 'react-redux'
import { getStoreLocal } from '../utils/locale-storage';

// export const useAuth = () => useSelector((state) =>{ return state.aut });

export const useAuth = () => {
    return getStoreLocal('user')
};
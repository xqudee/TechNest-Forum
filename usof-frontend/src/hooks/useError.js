import { useSelector } from 'react-redux'

export const useError = () => useSelector((state) => state.user?.error);
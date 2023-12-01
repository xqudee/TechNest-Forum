import { SortedOptions } from '../data/sortedOptions';
import TemplatePostMainPage from '../components/Posts/TemplatePostMainPage';
import { useLocation, useParams } from 'react-router-dom';
import { useCategory } from '../hooks/useCategory';
import { useEffect, useState } from 'react';


const PostsByCategory = () => {
    const { categoryName } = useParams();
    const { getCategoryByName } = useCategory();
    const [ category, setCategory ] = useState();
    const location = useLocation();

    useEffect(() => {
        const getCategory = async () => {
            const res = await getCategoryByName(categoryName);
            setCategory(res[0]);
        }

        getCategory();
    }, [location])

    return (
        <TemplatePostMainPage category={category} />
    )
}

export default PostsByCategory
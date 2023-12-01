import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import './Categories.css'
import MaterialIcons from '../ui/MaterialIcons';
import { useCategory } from '../../hooks/useCategory';
import { useAuth } from '../../hooks/useAuth';
import { cutTitle } from '../../utils/helpers';

const CategoryPreview = ({category, currentItems}) => {
    const { addCategoryToPinned, isPinned, isCategoryPinned, getCategoryByFullName } = useCategory();
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();

    const handlePin = async () => {
        await addCategoryToPinned(category.id);
        navigate('/categories')
    }

    const isFavorite = async () => {
        await isCategoryPinned(category.id);
    }

    useEffect(() => {
        isFavorite();
    }, [currentItems, location])

    return (
        <div className='category_info-container'>
            <div className='category_info-top'>
                <div className='category_title' onClick={() => navigate(`/${category.title}/posts`)}>{category.title}</div>
                {auth && (
                    <div className='category_pin-cont' onClick={() => {handlePin()}}>
                        {isPinned ? (
                            <MaterialIcons iconName={'PinActive'} />
                        ) : (
                            <MaterialIcons iconName={'Pin'} />
                        )}
                    </div>
                )}
            </div>
            <div>
                <div className='caegory_desc'>{cutTitle(category.description, 25)}</div>
            </div>
        </div>
    )
}

export default CategoryPreview
import { useAuth } from '../../hooks/useAuth';
import './LayoutSections.css'
import PopularPosts from './RightSection/PopularPosts';

const RightSection = () => {
    const auth = useAuth();

    return (
    <div className='main_layout-section rigth'>
        <PopularPosts />
    </div>
    )
}

export default RightSection
import { SortedOptions } from '../data/sortedOptions';
import TemplatePostMainPage from '../components/Posts/TemplatePostMainPage';


const PopularPosts = () => {
    return (
        <TemplatePostMainPage sorted={SortedOptions.RATING} />
    )
}

export default PopularPosts
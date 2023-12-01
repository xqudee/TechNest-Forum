import { SortedOptions } from '../data/sortedOptions';
import TemplatePostMainPage from '../components/Posts/TemplatePostMainPage';


const PostsBySearch = ({searchName}) => {
    return (
        <TemplatePostMainPage searchName={searchName} />
    )
}

export default PostsBySearch
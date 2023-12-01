import { SortedOptions } from '../data/sortedOptions';
import TemplatePostMainPage from '../components/Posts/TemplatePostMainPage';

const RecentPosts = () => {
    return (
        <TemplatePostMainPage sorted={SortedOptions.DATE} />
    )
}

export default RecentPosts
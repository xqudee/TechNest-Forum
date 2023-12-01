import { Link } from 'react-router-dom';
import MaterialIcons from '../ui/MaterialIcons';
// import Navbar from './Navbar';

const BackButton = ({backLink}) => {
    return (
        <Link to={backLink} className='arrow_back-img-container'>
            <MaterialIcons iconName={'Back'} />
        </Link>
    )
}

export default BackButton
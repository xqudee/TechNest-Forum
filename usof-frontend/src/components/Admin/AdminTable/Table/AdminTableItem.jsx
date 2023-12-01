import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AdminActions from '../AdminActions/AdminActions';
import MaterialIcons from '../../../ui/MaterialIcons';
import { useCategory } from '../../../../hooks/useCategory';
import { usePost } from '../../../../hooks/usePost';
// import Navbar from './Navbar';

const AdminTableItem = ({tableItem, headerItems, removeHandler}) => {
    const [userValues, setUserValues] = useState([]);
    const navigate = useNavigate();
    const { getPostsByCategory } = usePost()

    useEffect(() => {
        const values = [];

        headerItems.forEach(async item => {
            if (tableItem[item.val] == '') values.push('–')
            else if (tableItem[item.val]) values.push(tableItem[item.val]);
        });
        setUserValues(values);
    }, [tableItem])

    const handleClick = () => {
        navigate(`edit/${tableItem.id}`)
    }

    return (
            <tr>
                {userValues.map((item, index) => (
                    <td key={index}>{item}</td>
                ))}
                <td className='td-flex'>
                    <AdminActions removeHandler={removeHandler} user={tableItem}/>
                    <div className='admin_table-icon-container' onClick={handleClick}>
                        <MaterialIcons iconName={'More'} />
                    </div>
                
                </td>
            </tr>

    )
}

export default AdminTableItem
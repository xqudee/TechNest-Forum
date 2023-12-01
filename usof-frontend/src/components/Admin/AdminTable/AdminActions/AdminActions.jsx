import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MaterialIcons from '../../../ui/MaterialIcons';
import './AdminActions.css';
import { toastr } from 'react-redux-toastr';

const AdminActions = ({removeHandler, editUrl = 'edit', item}) => {
    return (
        <div className='admin_table-icon-div'>
            <div className='admin_table-icon-container' onClick={removeHandler}>
                <MaterialIcons iconName={'Close'} />
            </div>
        </div>
    )
}

export default AdminActions
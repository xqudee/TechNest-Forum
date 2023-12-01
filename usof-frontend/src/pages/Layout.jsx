import Header from '../components/Header/Header';
import { Outlet, useLocation } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import PostSortArea from '../components/MainLayoutSections/LeftSection/PostSortArea';
import LeftSection from '../components/MainLayoutSections/LeftSection';
import RightSection from '../components/MainLayoutSections/RightSection';
import { usePost } from '../hooks/usePost';
import { useCategory } from '../hooks/useCategory';
import { useWidth } from '../hooks/useWidth';
// import Navbar from './Navbar';

const Layout = () => {
    const {windowWidth} = useWidth();

    return (
        <>
            <Header  />
            <main className="App">
                <div className='App-container'>
                    { windowWidth > 768 && <LeftSection /> }
                    <Outlet />
                    { windowWidth > 768 && <RightSection /> }
                </div>
            </main>
        </>
    )
}

export default Layout
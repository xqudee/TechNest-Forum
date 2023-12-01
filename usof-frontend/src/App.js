import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Registration from './pages/Registration';
import CreatePost from './components/Posts/Components/CreatePost';
import Admin from './pages/Admin';
import AdminUsersList from './components/Admin/AdminUsersList';
import AdminPostsList from './components/Admin/AdminPostsList';
import AdminCategoriesList from './components/Admin/AdminCategoriesList';
import AdminCreateUser from './components/Admin/AdminTable/Create/AdminCreateUser';
import AdminCreateCategory from './components/Admin/AdminTable/Create/AdminCreateCategory';
import AdminEditUser from './components/Admin/AdminTable/Edit/AdminEditUser';
import AdminEditCategory from './components/Admin/AdminTable/Edit/AdminEditCategory';
import AdminCreatePost from './components/Admin/AdminTable/Create/AdminCreatePost';
import AdminEditPost from './components/Admin/AdminTable/Edit/AdminEditPost';
import { usePost } from './hooks/usePost';
import { useEffect } from 'react';
import Users from './components/Users/Users';
import Categories from './components/Categories/Categories';
import PostContentPage from './components/Posts/PostContentPage';
import UserProfile from './components/Users/UserProfile';
import EditPost from './components/Posts/Components/EditPostContent';
import EditUserProfile from './components/Users/Edit/EditUserProfile';
import BlockedPosts from './pages/BlockedPosts';
import Following from './pages/Following';
import RecentPosts from './pages/RecentPosts';
import PopularPosts from './pages/PopularPosts';
import PostsByCategory from './pages/PostsByCategory';
import Settings from './pages/Settings';
import ChangePassword from './components/Settings/ChangePassword';
import ChangeEmail from './components/Settings/ChangeEmail';
import SettingsMain from './components/Settings/SettingsMain';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangeName from './components/Settings/ChangeName';
import MenuMobile from './components/Header/MenuMobile';

export const CONFIG = { headers: { 'Content-Type': 'application/json' }, withCredentials: true }


function App() {

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/registration' element={<Registration />} />
      <Route path='/reset-password' element={<ResetPasswordPage />} />

      <Route path='/' element={<Layout />}>
        <Route path='/admin-panel' element={<Admin />}>
          <Route path='/admin-panel/users' element={<AdminUsersList />} />
          <Route path='/admin-panel/users/create' element={<AdminCreateUser />} />
          <Route path='/admin-panel/users/edit/:id' element={<AdminEditUser />} />

          <Route path='/admin-panel/posts' element={<AdminPostsList />} />
          <Route path='/admin-panel/posts/create' element={<AdminCreatePost />} />
          <Route path='/admin-panel/posts/edit/:id' element={<AdminEditPost />} />

          <Route path='/admin-panel/categories' element={<AdminCategoriesList />} />
          <Route path='/admin-panel/categories/create' element={<AdminCreateCategory />} />
          <Route path='/admin-panel/categories/edit/:id' element={<AdminEditCategory />} />
        </Route>

        <Route path='/settings' element={<Settings />}>
          <Route path='/settings' element={<SettingsMain />} />
          <Route path='/settings/change-password' element={<ChangePassword />} />
          <Route path='/settings/change-email' element={<ChangeEmail />} />
          <Route path='/settings/change-name' element={<ChangeName />} />
        </Route>
        
        <Route path='/' element={<MainPage />}>
          <Route path='/following' element={<Following />} />
          <Route path='/recent-posts' element={<RecentPosts />} />
          <Route path='/' element={<RecentPosts />} />
          <Route path='/popular-posts' element={<PopularPosts />} />
          <Route path='/:categoryName/posts' element={<PostsByCategory />} />
        </Route>

        <Route path='/create_post' element={<CreatePost />} />
        <Route path='/edit_post/:postId' element={<EditPost />} />
        <Route path='/blocked_posts' element={<BlockedPosts />} />

        <Route path='/posts/:postId' element={<PostContentPage />} />

        <Route path='/users' element={<Users />} />
        <Route path='/users/:userId' element={<UserProfile />} />
        <Route path='/users/:userId/edit' element={<EditUserProfile />} />

        <Route path='/categories' element={<Categories />} />
      </Route>
    </Routes>
  );
}

export default App;

import React from 'react'
import './App.css'
import {Provider} from 'react-redux'
import store from './store/store'
import {Routes,Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'

//User pages
import UserSignupPage from './pages/user/UserSignupPage'
import UserLoginPage from './pages/user/UserLoginPage'
import UserHomePage from './pages/user/UserHomePage'
import UserEditPage from './pages/user/UserEditPage'

//Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminAddUserPage from './pages/admin/AdminAddUserPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUserEditPage from './pages/admin/AdminUserEditPage'

//Protectors
import IsUserLogin from './store/protected/IsUserLogin'
import IsUserLogout from './store/protected/IsUserLogout'
import IsAdminLogin from './store/protected/IsAdminLogin'
import IsAdminLogout from './store/protected/IsAdminLogout'

import { UserProvider } from './store/slice/UserDetails'
import NotFound from './components/NotFound'

const App = () => {
  return (
    <>
    <Provider store={store}>
      <Routes>
        <Route path='/signup' element ={
           <IsUserLogout>
            <UserSignupPage/>
          </IsUserLogout>
          }/>

        <Route path='/login' element={
          <IsUserLogout>
             <UserLoginPage/>
          </IsUserLogout>}/>

        <Route path='/' element={
          <IsUserLogin>
              <UserHomePage/>
          </IsUserLogin>
        }/>

        <Route path='/edit-profile' element={
        <IsUserLogin>
           <UserEditPage/>
       </IsUserLogin>
     }/>


        <Route path='/admin' element={
          <IsAdminLogout>
            <AdminLoginPage/>
          </IsAdminLogout>}/>

        <Route path='/admin/dashboard' element={
              <UserProvider>
          <IsAdminLogin>
                <AdminDashboardPage/>
          </IsAdminLogin>
              </UserProvider>
        }/>

        <Route path='/admin/add-user' element={
        <IsAdminLogin>
           <AdminAddUserPage/>
        </IsAdminLogin>
     }/>

        <Route path='/admin/edit-user' element={
        <UserProvider>
        <IsAdminLogin>
          <AdminUserEditPage/>
        </IsAdminLogin>
        </UserProvider>
    }/>

      <Route path='*' element={<NotFound/>}/>

      </Routes>
      <ToastContainer/>
    </Provider>
    </>
  )
}

export default App

import { Route, Routes } from 'react-router-dom';
import Login from '../pages/authentication/Login';
import Register from '../pages/authentication/Register';
import ForgotPassword from '../pages/authentication/ForgotPassword';
import ResetPassword from '../pages/authentication/ResetPassword';
import Otp from '../pages/authentication/OTP';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Customer from '../pages/customer/Customer';
import Categories from '../pages/catalog/categories/Categories';
import SubCategories from '../pages/catalog/sub-categories/SubCategories';


const AppRoute = () => {
  return (
    <Routes>
      <Route exact path='/register' element={<ProtectedRoute authentication={false}><Register /></ProtectedRoute>}></Route>
      <Route exact path='/login' element={<ProtectedRoute authentication={false}><Login /></ProtectedRoute>}></Route>
      <Route exact path='/otp' element={<ProtectedRoute authentication={false}><Otp /></ProtectedRoute>}></Route>
      <Route exact path='/forgot-password' element={<ProtectedRoute authentication={false}><ForgotPassword /></ProtectedRoute>}></Route>
      <Route exact path='/reset-password' element={<ProtectedRoute authentication={false}><ResetPassword /></ProtectedRoute>}></Route>
      <Route exact path='/' element={<ProtectedRoute authentication={true}><Dashboard /></ProtectedRoute>}></Route>
      <Route exact path='/customers' element={<ProtectedRoute authentication={true}><Customer /></ProtectedRoute>}></Route>
      <Route exact path='/categories' element={<ProtectedRoute authentication={true}><Categories /></ProtectedRoute>}></Route>
      <Route exact path='/sub-categories' element={<ProtectedRoute authentication={true}><SubCategories /></ProtectedRoute>}></Route>
    </Routes>
  )
}

export default AppRoute

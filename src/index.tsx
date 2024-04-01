import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from './Routes/Login';
import ForgotPassword from './Routes/Password/ForgotPassword';
import ResetPassword from './Routes/Password/ResetPassword';
import Dashboard from './Routes/Dashboard';
import Admin from './Routes/Admin/Admin';
import AdminAccounts from './Routes/Admin/Accounts';
import AdminScans from './Routes/Admin/Scans';
import Products from './Routes/Products/Products';
import Categories from './Routes/Products/Categories';
import ShoppingList from './Routes/ShoppingList/ShoppingList';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
  <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/admin" element={<Admin />} />
      <Route path="/dashboard/admin/accounts" element={<AdminAccounts />} />
      <Route path="/dashboard/admin/scans" element={<AdminScans />} />
      <Route path="/dashboard/products" element={<Products />} />
      <Route path="/dashboard/categories" element={<Categories />} />
      <Route path="/dashboard/shoppinglist" element={<ShoppingList />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  </BrowserRouter>
  </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

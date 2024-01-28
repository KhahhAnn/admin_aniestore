import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import MainLayout from './components/MainLayout';
import Category from './pages/Category';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Discount from './pages/Discount';
import Event from './pages/Event';
import ForgotPassword from './pages/ForgotPassword';
import ImportInvoice from './pages/ImportInvoice';
import Login from './pages/Login';
import Message from './pages/Message';
import Order from './pages/Order';
import Products from './pages/Products';
import ResetPassword from './pages/ResetPassword';
import Review from './pages/Review';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='reset-password' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/admin/*' element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='review' element={<Review />} />
          <Route path='category' element={<Category />} />
          <Route path='message' element={<Message />} />
          <Route path='customers' element={<Customers />} />
          <Route path='event' element={<Event />} />
          <Route path='import-invoice' element={<ImportInvoice />} />
          <Route path='order' element={<Order />} />
          <Route path='products' element={<Products />} />
          <Route path='discount' element={<Discount />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

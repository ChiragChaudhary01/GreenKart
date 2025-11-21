import './index.css';
import { ToastContainer } from "react-toastify";
import Signup from "./pages/Auth/Signup.jsx"
import { Routes, Route } from "react-router-dom";
import Login from './pages/Auth/Login.jsx';
import VerifyOTP from './pages/Auth/VerifyOTP.jsx';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import BrowseProducts from './pages/Consumer/BrowseProducts.jsx';
import Product from './pages/Consumer/Product.jsx';
import Cart from './pages/Consumer/Cart.jsx';
import Chekout from './pages/Consumer/Checkout.jsx';
import Order from './pages/Consumer/Order.jsx';
import Overview from './pages/Admin/Overview.jsx';
import Products from './pages/Admin/Products.jsx';
import Assign from './pages/Admin/Assign.jsx';
import DeliveryDashboard from './pages/Delivery/DeliveryDashboard.jsx';
import FarmerDashboard from './pages/Farmer/FarmerDashboard.jsx';
import { ManageProducts } from './pages/Farmer/ManageProducts.jsx';
// import Users from './pages/Admin/Users.jsx';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/products' element={<BrowseProducts />} />
        <Route path='/products/:id' element={<Product />} />
        <Route path='/checkout/:id' element={<Chekout />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/orders' element={<Order />} />
        <Route path='/admin/overview' element={<Overview />} />
        <Route path='/admin/products' element={<Products />} />
        <Route path='/admin/assign-orders' element={<Assign />} />
        <Route path='/delivery/dashboard' element={<DeliveryDashboard />} />
        <Route path='/farmer/dashboard' element={<FarmerDashboard />} />
        <Route path='/farmer/manage-products' element={<ManageProducts />} />
        {/* <Route path='/admin/users' element={<Users />} /> */}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="bg-gray-800 text-white rounded-lg shadow-lg text-sm sm:text-base md:text-lg w-[70%] sm:w-auto"
        bodyClassName="flex items-center"
        closeButton={false}
      />
    </>
  )
}

export default App

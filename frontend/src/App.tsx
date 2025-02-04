import { HashRouter as Router, Routes, Route } from 'react-router-dom'
// import { lazy, Suspense } from 'react'
import Home from './pages/home'
import Cenik from './pages/cenik'
import Eshop from './pages/eshop'
import Iflash from './pages/iflash'
import Register from "./pages/Register";
import Login from './pages/Login'
import ProductDetail from "./pages/ProductDetail";
import CartPage from './pages/CartPage'
import CategoryPage from './pages/CategoryPage'
import CheckoutPage from './pages/CheckoutPage'
import SuccessPage from './pages/SuccessPage'
import CancelPage from './pages/CancelPage'
import OrdersPage from './pages/OrdersPage'

// const LazyHome = lazy(() => import('./pages/home'));
// const LazyCenik = lazy(() => import('./pages/cenik'));
// const LazyEshop = lazy(() => import('./pages/eshop'));
// const LazyIflash = lazy(() => import('./pages/iflash'));
// const LazyRegister = lazy(() => import('./pages/Register'));
// const LazyLogin = lazy(() => import('./pages/Login'));
// const LazyProductDetail = lazy(() => import('./pages/ProductDetail'));
// const LazyCartPage = lazy(() => import('./pages/CartPage'));
// const LazyCategoryPage = lazy(() => import('./pages/CategoryPage'));
// const LazyCheckoutPage = lazy(() => import('./pages/CheckoutPage'));
// const LazySuccessPage = lazy(() => import('./pages/SuccessPage'));

// const SuspenseFallback = () => <div>Loading...</div>;


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cenik' element={<Cenik />} />
          <Route path='/eshop' element={<Eshop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path='/iflash' element={<Iflash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/order" element={<OrdersPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
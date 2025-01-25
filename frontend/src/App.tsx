import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Cenik from './pages/cenik'
import Eshop from './pages/eshop'
import Iflash from './pages/iflash'
import Register from "./pages/Register";
import Login from './pages/Login'
import ProductDetail from "./pages/ProductDetail";



function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cenik' element={<Cenik />} />
          <Route path='/eshop' element={<Eshop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path='/iflash' element={<Iflash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
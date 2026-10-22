
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Orders from './pages/Orders'
import Products from './pages/Products'
import SingleProduct from './pages/SingleProduct'
import Wishlist from './pages/Wishlist'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SignInPage, SignUpPage } from './pages/Auth'
import { useEffect } from 'react'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

function AppRoutes() {
  const location = useLocation()
  const backgroundLocation = location.state?.backgroundLocation

  useEffect(() => {
    window.scrollTo({top:0, right:0, "behavior": "instant"})
  }, [location])

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<SingleProduct />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route path="/checkout" element={<Checkout isModal />} />
        </Routes>
      )}
    </>
  )
}

export default App

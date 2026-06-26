import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import MarketPlace from './pages/MarketPlace'
import MyListing from './pages/MyListing'
import ListingDetails from './pages/ListingDetails'
import ManageListing from './pages/ManageListing'

import Loading from './pages/Loading'
import Navbar from './components/Navbar'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify'
import { Toaster } from 'react-hot-toast'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AllListings from './pages/admin/AllListings'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useAuthContext } from './context/AuthContext'
import { getAllPublicListing, getAllUserListing } from './app/features/listingSlice'
import Footer from './components/Footer'
import { SocketContextProvider } from './context/SocketContext'
import Messages from './pages/Messages'
import ChatBox from './components/ChatBox'

const App = () => {

  const { pathname } = useLocation();
  const { user, token, isSignedIn } = useAuthContext();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPublicListing())
  }, []);

  useEffect(() => {
    if (isSignedIn && token) {
      dispatch(getAllUserListing({ token }))
    }
  }, [isSignedIn, token])

    return (
    <div className='min-h-screen flex flex-col' style={{ background: 'var(--surface-0)' }}>
      <SocketContextProvider>
      <Toaster />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      {!pathname.includes('/admin') && <Navbar />}

      <ChatBox />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/my-listings" element={<MyListing />} />
        <Route path="/listing/:listingId" element={<ListingDetails />} />
        <Route path="/create-listing" element={<ManageListing />} />
        <Route path="/edit-listing/:id" element={<ManageListing />} />
        <Route path="/messages" element={<Messages />} />

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/loading/:nextUrl" element={<Loading />} />
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="list-listings" element={<AllListings />} />
        </Route>
      </Routes>

      {!pathname.includes('/admin') && <Footer />}
      </SocketContextProvider>
    </div>
  )
}

export default App

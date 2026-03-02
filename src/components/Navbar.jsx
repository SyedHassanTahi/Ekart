import React from 'react'
import { useState } from "react"
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import { Menu, X, ShoppingCart } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false)
  const { user } = useSelector(store => store.user)
  const { cart } = useSelector(store => store.product)
  const accessToken = localStorage.getItem('accessToken')
  const admin = user?.role === "admin" ? true : false
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const logoutHandler = async () => {
    try {
      const res = await axios.post(`https://ekart-backend-pink.vercel.app/api/v1/user/logout`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setUser(null))
        toast.success(res.data.message)

      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <header className="text-gray-600 bg-pink-50 fixed w-full z-20 body-font border-b border-b-pink-200">
      <div className="container mx-auto flex items-center justify-between p-5">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold text-pink-500">
            Ekart
          </span>
        </Link>

        {/* Hamburger Button , visible only on mobile */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-medium">
          <Link className="hover:text-gray-900" to="/">Home</Link>

          <Link className="hover:text-gray-900" to="/products">
            Products
          </Link>

          {user && (
            <Link to={`/profile/${user._id}`} className="hover:text-gray-900">
              Hello, {user.firstName}
            </Link>
          )}

          {admin && (
            <Link to="/dashboard/sales" className="hover:text-gray-900">
              Dashboard
            </Link>
          )}

          <Link to="/cart" className="relative hover:text-gray-900">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute text-white -top-3 -right-4 px-2 text-xs">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {user ? (
            <Button onClick={logoutHandler} className="bg-pink-600 text-white">
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-linear-to-tl from-blue-600 to-purple-600 text-white"
            >
              Login
            </Button>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-pink-50 border-t border-pink-200 px-6 pb-6">
          <div className="flex flex-col gap-4 font-medium">

            <Link onClick={() => setIsOpen(false)} to="/">Home</Link>

            <Link onClick={() => setIsOpen(false)} to="/products">
              Products
            </Link>

            {user && (
              <Link
                onClick={() => setIsOpen(false)}
                to={`/profile/${user._id}`}
              >
                Hello, {user.firstName}
              </Link>
            )}

            {admin && (
              <Link
                onClick={() => setIsOpen(false)}
                to="/dashboard/sales"
              >
                Dashboard
              </Link>
            )}

            <Link
              onClick={() => setIsOpen(false)}
              to="/cart"
              className="relative"
            >
              Cart ({cart?.items?.length || 0})
            </Link>

            {user ? (
              <Button
                onClick={() => {
                  logoutHandler()
                  setIsOpen(false)
                }}
                className="bg-pink-600 text-white"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => {
                  navigate("/login")
                  setIsOpen(false)
                }}
                className="bg-linear-to-tl from-blue-600 to-purple-600 text-white"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
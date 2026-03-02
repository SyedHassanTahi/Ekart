import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from "../assets/user-logo.jpg"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'

const Cart = () => {
  const { cart } = useSelector(store => store.product)
  // console.log(cart);

  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal > 299 ? 0 : subtotal === 0 ? 0 : 10
  const tax = parseFloat((subtotal * 0.05).toFixed(2))
  const total = parseFloat((subtotal + shipping + tax).toFixed(2))

  const totalQuantity = cart?.items?.reduce(
    (acc, item) => acc + item.quantity,
    0
  ) || 0

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const API = "https://ekart-backend-pink.vercel.app/api/v1/cart"
  const accessToken = localStorage.getItem("accessToken")

  const loadCart = async () => {
    try {
      const res = await axios(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`, { productId, type }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: { productId }
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
        toast.success('Product remove from cart')
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadCart();
  }, [dispatch])


  return (

    <div className='pt-24 bg-gray-50 min-h-screen px-4 sm:px-6'>
      {cart?.items?.length > 0 ? (
        <div className='max-w-7xl mx-auto'>

          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-7'>
            Shopping Cart
          </h1>

          <div className='flex flex-col lg:flex-row gap-8'>

            {/* LEFT SIDE */}
            <div className='flex flex-col gap-5 flex-1'>
              {cart?.items?.map((product, index) => (
                <Card key={index}>
                  <div className='flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between p-5'>

                    {/* Product Info */}
                    <div className='flex gap-4 items-center'>
                      <img
                        onClick={() => navigate(`/products/${product?.productId?._id}`)}
                        className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded cursor-pointer'
                        src={product?.productId?.productImg?.[0]?.url || userLogo}
                        alt={product?.productId?.productName}
                      />

                      <div>
                        <h1 className='font-semibold text-sm sm:text-base line-clamp-2'>
                          {product?.productId?.productName}
                        </h1>

                        <p className='text-gray-600'>
                          ${product?.productId?.productPrice}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className='flex items-center gap-4'>
                      <Button
                        onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')}
                        variant='outline'
                      >
                        -
                      </Button>
                      <span>{product.quantity}</span>
                      <Button
                        onClick={() => handleUpdateQuantity(product.productId._id, 'increase')}
                        variant='outline'
                      >
                        +
                      </Button>
                    </div>

                    {/* Total Price */}
                    <p className='font-semibold'>
                      ${product?.productId?.productPrice * product?.quantity}
                    </p>

                    {/* Remove */}
                    <p
                      onClick={() => handleRemove(product?.productId?._id)}
                      className='flex text-red-500 items-center gap-1 cursor-pointer'
                    >
                      <Trash2 className='w-4 h-4' />
                      Remove
                    </p>

                  </div>
                </Card>
              ))}
            </div>

            {/* RIGHT SIDE SUMMARY */}
            <div className='w-full lg:w-96'>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span>
                      Subtotal ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
                    </span>
                    <span>
                      ${(cart?.totalPrice || 0).toLocaleString("en-US")}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping}`}
                    </span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={() => navigate("/address")}
                      disabled={!cart?.items?.length}
                      className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
                    >
                      PLACE ORDER
                    </Button>

                    <Button
                      onClick={() => navigate("/products")}
                      variant="outline"
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </div>

                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
          <div className='bg-pink-100 p-6 rounded-full'>
            <ShoppingCart className='w-16 h-16 text-pink-600' />
          </div>

          <h2 className='mt-6 text-2xl font-bold text-gray-800'>
            Your Cart is Empty
          </h2>

          <p className='mt-4 text-gray-600'>
            Looks like you haven't added anything to your cart yet
          </p>

          <Button
            onClick={() => navigate('/products')}
            className='mt-6 bg-pink-600 text-white py-3 hover:bg-pink-700'
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  )
}

export default Cart

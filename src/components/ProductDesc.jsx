import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/productSlice'

const ProductDesc = ({ product }) => {
    const accessToken = localStorage.getItem("accessToken");
    const dispatch = useDispatch();
    const addToCart = async (productId) => {
        try {
            const res = await axios.post(`https://ekart-backend-pink.vercel.app/api/v1/cart/add`, { productId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                toast.success('Product added to cart')
                dispatch(setCart(res.data.cart))
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
    
        <div className="flex flex-col gap-5 w-full">

            {/* Product Name */}
            <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-800 leading-tight">
                {product.productName}
            </h1>

            {/* Category and Brand */}
            <p className="text-sm sm:text-base text-gray-600">
                {product.category} | {product.brand}
            </p>

            {/* Price */}
            <h2 className="text-pink-600 font-bold text-xl sm:text-2xl">
                ${product.productPrice}
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground line-clamp-6 lg:line-clamp-none">
                {product.productDesc}
            </p>

            {/* Quantity Section */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <p className="text-sm sm:text-base font-medium">
                    Quantity:
                </p>
                <Input
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="w-16 sm:w-20"
                />
            </div>

            {/* Add to Cart Button */}
            <Button
                onClick={() => addToCart(product._id)}
                className="bg-pink-600 hover:bg-pink-700 w-full sm:w-max py-3 text-base font-semibold"
            >
                Add to Cart
            </Button>

        </div>
    )
}

export default ProductDesc

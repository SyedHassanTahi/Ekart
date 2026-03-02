import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const OrderCard = ({ userOrder }) => {
    const navigate = useNavigate()
    return (
        
        <div className='flex flex-col gap-3 px-4 sm:px-6 lg:px-20 py-6'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-6'>
                <Button onClick={() => navigate(-1)}><ArrowLeft /></Button>
                <h1 className='text-xl sm:text-2xl font-bold'>Orders</h1>
            </div>

            {/* No orders */}
            {userOrder?.length === 0 ? (
                <p className='text-gray-800 text-lg sm:text-2xl'>No Orders found for this user</p>
            ) : (
                <div className='flex flex-col gap-6 w-full'>
                    {userOrder?.map((order) => (
                        <div className='shadow-lg rounded-2xl p-5 border border-gray-200 w-full' key={order._id}>
                            {/* Order header */}
                            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0'>
                                <h2 className='text-base sm:text-lg font-semibold'>
                                    Order ID: <span className='text-gray-600 break-all'>{order._id}</span>
                                </h2>
                                <p className='text-sm text-gray-500'>
                                    Amount: <span className='font-bold'>{order.currency} {order.amount.toFixed(2)}</span>
                                </p>
                            </div>

                            {/* User info and status */}
                            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0'>
                                <div>
                                    <p className='text-sm text-gray-700'>
                                        <span className='font-medium'>User:</span> {order.user?.firstName || "Unknown"} {order.user?.lastName || ""}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        Email: {order.user?.email || "N/A"}
                                    </p>
                                </div>
                                <span className={`${order.status === "Paid" ? "bg-green-500" : order.status === "Failed" ? "bg-red-500" : "bg-orange-300"} text-white px-2 py-1 rounded-lg mt-2 sm:mt-0`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Products */}
                            <div>
                                <h3 className='font-medium mb-2'>Products:</h3>
                                <ul className='space-y-2'>
                                    {order.products.map((product, index) => (
                                        <li key={index} className='flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 rounded-lg gap-2 sm:gap-4'>
                                            <img
                                                onClick={() => navigate(`/products/${product?.productId?._id}`)}
                                                className='w-24 sm:w-16 cursor-pointer object-cover rounded'
                                                src={product.productId?.productImg?.[0]?.url}
                                                alt={product.productId?.productName || "Product Image"}
                                            />
                                            <span className='line-clamp-2 w-full sm:w-1/3 text-sm sm:text-base'>
                                                {product.productId?.productName}
                                            </span>
                                            <span className='text-sm sm:text-base'>{product?.productId?._id}</span>
                                            <span className='font-medium text-sm sm:text-base'>
                                                ${product.productId?.productPrice} x {product.quantity}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrderCard

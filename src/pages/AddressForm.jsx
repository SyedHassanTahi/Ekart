import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { addAddress, deleteAddress, setCart, setSelectedAddress } from '@/redux/productSlice'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AddressForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    })

    const { cart, addresses, selectedAddress } = useSelector((store) => store.product)
    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = () => {
        dispatch(addAddress(formData))
        setShowForm(false)
    }

    const subtotal = cart.totalPrice
    const shipping = subtotal > 299 ? 0 : 10
    const tax = parseFloat((subtotal * 0.05).toFixed(2))
    const total = parseFloat((subtotal + shipping + tax).toFixed(2))

    const totalQuantity = cart?.items?.reduce(
        (acc, item) => acc + item.quantity,
        0
    ) || 0

    // console.log(cart);

    const handlePaymentRazor = async () => {
        const accessToken = localStorage.getItem("accessToken")
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/v1/order/create-order`, {
                products: cart?.items?.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                tax,
                shipping,
                amount: total,
                currency: "USD"
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (!data.success) return toast.error("Something went wrong")
            console.log("Razorpay data:", data);
            const options = {
                Key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                order_id: data.order.id,
                name: "Ekart",
                description: "Order Payment",
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${import.meta.env.VITE_URL}/api/v1/order/verify-payment`, response, {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        })

                        if (verifyRes.data.success) {
                            toast.success("✅ Payment Successfull!")
                            dispatch(setCart({ items: [], totalPrice: 0 }))
                            navigate("/order-success")
                        } else {
                            toast.error("❌ Payment Verification failed")
                        }
                    } catch (error) {
                        toast.error("Error verifying payment")
                    }
                },
                modal: {
                    ondismiss: async function () {
                        // Handle user closing the popup
                        await axios.post(`${import.meta.env.VITE_URL}/api/v1/order/verify-payment`, {
                            razorpay_order_id: data.order.id,
                            paymentFailed: true
                        }, {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        });
                        toast.error("Payment Cancelled or Failed")
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#F472B6"
                }
            };

            const rzp = new window.Razorpay(options)

            // Listen for payment failures
            rzp.on("payment.failed", async function (response) {
                await axios.post(`${import.meta.env.VITE_URL}/api/v1/order/verify-payment`, {
                    razorpay_order_id: data.order.id,
                    paymentFailed: true
                }, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                toast.error("Payment Failed. Please try again")
            })
            rzp.open()
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while processing payment")
        }
    }

    const handlePayment = async () => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/v1/order/create-order`, {
                products: cart?.items?.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                tax,
                shipping,
                amount: total,
                currency: "USD"
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!data.success) return toast.error("Something went wrong");

            console.log("Order created:", data.dbOrder);

            // Clear cart in Redux
            dispatch(setCart({ items: [], totalPrice: 0 }));

            // Clear cart in DB
            await axios.delete(`${import.meta.env.VITE_URL}/api/v1/cart/clear-cart`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            toast.success("✅ Order Placed Successfully!");
            navigate("/order-success");
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while placing the order");
        }
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>

                {/* LEFT SIDE */}
                <div className='space-y-4 p-6 bg-white rounded-lg shadow-sm'>
                    {showForm ? (
                        <>
                            <div>
                                <Label htmlFor='fullName'>Full Name</Label>
                                <Input
                                    id='fullName'
                                    name='fullName'
                                    required
                                    placeholder='John Doe'
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor='phone'>Phone Number</Label>
                                <Input
                                    id='phone'
                                    name='phone'
                                    required
                                    placeholder='+92 987654321'
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    name='email'
                                    required
                                    placeholder='john@example.com'
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor='address'>Address</Label>
                                <Input
                                    id='address'
                                    name='address'
                                    required
                                    placeholder='123 Street, Area'
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* City + State */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <Label htmlFor='city'>City</Label>
                                    <Input
                                        id='city'
                                        name='city'
                                        required
                                        placeholder='Lahore'
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor='state'>State</Label>
                                    <Input
                                        id='state'
                                        name='state'
                                        required
                                        placeholder='Punjab'
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Zip + Country */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <Label htmlFor='zip'>Zip Code</Label>
                                    <Input
                                        id='zip'
                                        name='zip'
                                        required
                                        placeholder='70010'
                                        value={formData.zip}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor='country'>Country</Label>
                                    <Input
                                        id='country'
                                        name='country'
                                        required
                                        placeholder='Pakistan'
                                        value={formData.country}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <Button onClick={handleSave} className='w-full bg-pink-600 hover:bg-pink-700'>
                                Save & Continue
                            </Button>
                        </>
                    ) : (
                        <div className='space-y-4'>
                            <h2 className='text-lg font-semibold'>Saved Addresses</h2>

                            {addresses.map((addr, index) => (
                                <div
                                    key={index}
                                    onClick={() => dispatch(setSelectedAddress(index))}
                                    className={`border p-4 rounded-md cursor-pointer relative transition ${selectedAddress === index
                                        ? "border-pink-600 bg-pink-50"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <p className='font-medium'>{addr.fullName}</p>
                                    <p>{addr.phone}</p>
                                    <p>{addr.email}</p>
                                    <p className='text-sm text-gray-600'>
                                        {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                                    </p>

                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            dispatch(deleteAddress(index))
                                        }}
                                        variant='outline'
                                        className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm'
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}

                            <Button
                                className='w-full'
                                onClick={() => setShowForm(true)}
                                variant='outline'
                            >
                                + Add New Address
                            </Button>

                            <Button
                                className='w-full bg-pink-600 hover:bg-pink-700'
                                onClick={handlePayment}
                                disabled={selectedAddress === null}
                            >
                                Proceed To Checkout
                            </Button>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE ORDER SUMMARY */}
                <div className='w-full'>
                    <Card className='w-full lg:max-w-md lg:ml-auto'>
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
                                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
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

                            {/* Info Section */}
                            <div className="text-sm text-muted-foreground pt-4 space-y-1">
                                <p>* Free shipping on orders over 299</p>
                                <p>* 30 days return policy</p>
                                <p>* Secure checkout with SSL encryption</p>
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}

export default AddressForm
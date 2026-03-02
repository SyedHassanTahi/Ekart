import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import ProductCard from '@/components/ProductCard'

const ProductsHome = () => {
    const { products } = useSelector(store => store.product)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`https://ekart-backend-pink.vercel.app/api/v1/product/getallproduct`);
            if (res.data.success) {
                setAllProducts(res.data.products)
                dispatch(setProducts(res.data.products))
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [])
    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="lg:w-1/4 md:w-1/2 p-4 w-full"
                        >
                            <ProductCard product={product} loading={loading} />
                        </div>
                    ))}
                </div>
            </div>
        </section>

    )
}

export default ProductsHome
